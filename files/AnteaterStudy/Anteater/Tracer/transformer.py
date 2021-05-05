import ast
import uuid
import numpy as np

class ProgramTransformer(ast.NodeTransformer):

    def __init__(self,traceName,tracked,variables,expressions, exclusions, excludedFuncs, excludedLibs, extractedCalls, extractedComprehensions, source):
        #init vars
        #create unique id that will be used to name our variables in the transformed program
        self.id = "f" + str(uuid.uuid4().hex)
        self.traceName=  traceName
        self.helper = TranfsormerHelpers(variables,expressions, exclusions,self,excludedFuncs,excludedLibs,source,extractedCalls, extractedComprehensions)
        self.tracked = tracked
        self.functionStack = []
        self.extractedCalls = extractedCalls
        self.extractedComprehensions = extractedComprehensions
        self.source = source
        self.exclLibs = excludedLibs

    def visit_Import(self, node):
        # print("IMPORTING")
        # print("EXCLIBS", self.exclLibs)
        names = node.names
        for name in names:
            if type(name) is ast.alias:
                if name.name == "numpy" and name.asname is not None:
                    self.numpyName = name.asname

                    if "numpy" in self.exclLibs:
                        self.exclLibs[self.exclLibs.index("numpy")] = self.numpyName
                elif name.name == "numpy":
                    self.numpyName = "numpy"

                if name.name == "math" and name.asname is not None:
                    if "math" in self.exclLibs:
                        self.exclLibs[self.exclLibs.index("math")] = name.asname

        return node

    def visit_Module(self,node):
        #create imports and things needed for the beginning of the transformed program

        #create node to open the trace file
        f = open("Anteater/Tracer/helperText/transformedFileHeader.txt","r")
        text = f.read()
        f.close()
        text = text.replace("REPLACE",self.id)
        text = text.replace("TRACE_NAME", self.traceName)
        body = self.helper.parse_code(text,0)

        for n in node.body:
            body= self.helper.wrap_node(n,body)

        f = open("Anteater/Tracer/helperText/closeFile.txt", "r")
        text = f.read()
        f.close()
        text = text.replace("REPLACE", self.id)
        body = list(np.concatenate((body,self.helper.parse_code(text,0))))


        f = open("Anteater/Tracer/helperText/exceptionEnd.txt", "r")
        exceptionText = f.read()
        f.close()
        exceptionText = exceptionText.replace("REPLACE", self.id)

        exceptNode= ast.ExceptHandler(type=None, name=None, body=self.helper.parse_code(exceptionText,0))

        tryNode = ast.Try(body = body, handlers=[exceptNode],orelse=[],finalbody=[])
        node.body =[tryNode]

        return node

    def visit_FunctionDef(self, node):

        self.functionStack.append([node.name,[]])
        body =  self.helper.generate_tab_nodes(node.lineno,True)
        for arg in node.args.args:
            # body = list(np.concatenate(body,self.helper.wrap_node(arg,node.lineno)))
            body = self.helper.wrap_node(arg, body)

        for n in node.body:
            body = self.helper.wrap_node(n,body)

        node.body = body
        self.functionStack.pop(-1)

        return node

    def visit_For(self, node):
        if len(self.functionStack) > 0:
            self.functionStack[-1][1].append("for")

        targets = []
        if type(node.target) is ast.Tuple:
            recordAttrs = {}
            for i,t in enumerate(node.target.elts):
                name = t.id
                recordAttrs.update({"targetVal"+str(i+1):self.id+"toStr("+name+")"})
                targets.append(t)
        else:
            name = node.target.id
            recordAttrs = {"targetVal": self.id+"toStr("+name+")"}
            targets.append(node.target)


        n = len(self.helper.loopCounterIDStack)
        counterID = self.helper.loopCounterIDStack[n - 1]
        recordAttrs.update({"iteration": counterID})
        incNode = ast.AugAssign(target=ast.Name(id=counterID, ctx=ast.Store()), op=ast.Add(), value=ast.Num(n=1))
        incNode.lineno = node.lineno

        body = [incNode]
        fStr = self.helper.create_containing_function_str()
        comprehensionKeys = self.extractedComprehensions.keys()
        if node.lineno in comprehensionKeys:
            fStr = fStr[:fStr.rfind("_")]



        for t in targets:
            additionalAttrs = {}
            tName = t.id
            if tName  in self.helper.variables:
                print("FOUND ", tName)
                additionalAttrs.update(recordAttrs)
                nTracked = len(self.tracked)
                i = 0
                obj = self.tracked[i]
                while i < nTracked - 1 and (obj.name != tName or obj.containingFunc != fStr):
                    i += 1
                    obj = self.tracked[i]




                if obj.containingFunc == fStr:
                    lineInd = 0
                    if node.lineno in comprehensionKeys:
                        lines = self.helper.build_code_line(self.source[node.lineno-1:])
                        print(lines)
                        lines = lines.split("\n")
                        while lineInd < len(lines) and lines[lineInd].find(" for ") == -1:
                            print(lines[lineInd])
                            lineInd +=1

                        line = self.source[node.lineno-1+lineInd]

                        forInd = line.find(" for ") + len(" for ")
                        inInd = line.find(" in ")
                        vs = line[forInd:inInd].split(",")
                        offset = forInd
                        print(line)
                        print(offset)
                        print(vs)
                        for v in vs:

                            if v.strip() == tName:
                                offset += v.find(v.strip())
                                self.helper.instances[tName].append([node.lineno+lineInd, offset])
                                break
                            else:
                                offset += len(v) +1
                    else:
                        self.helper.instances[tName].append([node.lineno, t.col_offset])

                    targetLbl = tName.replace("\"", "\\\"")

                    additionalAttrs.update({"name": "\"" + str(targetLbl) + "\""})
                    additionalAttrs.update({targetLbl: tName})
                    if obj.custom is not None and len(obj.custom) > 0:
                        for i, e in enumerate(obj.custom):
                            f = open("Anteater/Tracer/helperText/custom.txt", "r")
                            text = f.read()
                            f.close()
                            text = text.replace("REPLACE_I", str(i))
                            text = text.replace("EXPR", e)
                            nodes = self.helper.parse_code(text, node.lineno)
                            body = np.concatenate((body, nodes))
                            additionalAttrs.update({e.replace("\"", "\\\\\\\""): "cExp" + str(i)})
                    if node.lineno in comprehensionKeys:
                        body = list(np.concatenate(
                            (body, self.helper.create_opening_nodes("assign", node.lineno + lineInd, additionalAttrs, body=False,
                                                                    globals=False))))
                        body = list(
                            np.concatenate((body, self.helper.create_closing_nodes("assign", node.lineno+lineInd, False))))
                    else:
                        body = list(np.concatenate(
                        (body, self.helper.create_opening_nodes("assign", node.lineno, additionalAttrs, body=False, globals=False))))
                        body = list(np.concatenate((body, self.helper.create_closing_nodes("assign", node.lineno, False))))

        if node.lineno == 167:
            print(ast.dump(node))
            print(ast.dump(targets[0]))
            print(ast.dump(targets[1]))

        for n in node.body:
            # print(ast.dump(n))
            body = self.helper.wrap_node(n,body,recordAttrs)
            # if type(n) is ast.Expr:
            #     if type(n.value) is ast.Call:
            #         if type(n.value.func) is ast.Attribute:
            #             if type(n.value.func.value) is ast.Name and n.value.func.value.id == 'leaves':
            #                 for b in body:
            #                     print(ast.dump(b))
        # Expr(value=Call(func=Attribute(value=Name(id='leaves', ctx=Load()), attr='append', ctx=Load()),
        #                 args=[Name(id='node', ctx=Load())], keywords=[]))

        # for b in body:
        #     print(ast.dump(b))
        node.body = body

        if len(self.functionStack) > 0:
            self.functionStack[-1][1].pop(-1)

        return node


    # def visit_ListComp(self, node):
    #     f = open("Anteater/Tracer/helperText/listCompToFor.txt")
    #     text = f.read()
    #     f.close()
    #     text=text.replace("REPLACEEXPR",astor.to_source(node.elt))
    #     generator = node.generators[0]
    #     text = text.replace("REPLACEV",astor.to_source(generator.target).strip())
    #
    #     text = text.replace("REPLACERANGE", astor.to_source(generator.iter).strip())
    #
    #     if(len(generator.ifs) >0):
    #         text =text.replace("REPLACEIF", astor.to_source(generator.ifs[0]).strip())
    #     else:
    #         text = text.replace("REPLACEIF","true")
    #
    #
    #     newN = ast.parse(text)



    def visit_While(self, node):
        if len(self.functionStack) > 0:
            self.functionStack[-1][1].append("while")

        self.visit(node.test)
        n = len(self.helper.loopCounterIDStack)
        counterID = self.helper.loopCounterIDStack[n-1]
        recordAttrs = {"iteration":counterID}
        body = []

        for n in node.body:
            body = self.helper.wrap_node(n,body,recordAttrs)

        incNode = ast.AugAssign(target = ast.Name(id=counterID, ctx=ast.Store()), op=ast.Add(), value = ast.Num(n=1))
        incNode.lineno = node.lineno
        body.append(incNode)

        node.body = body

        if len(self.functionStack) > 0:
            self.functionStack[-1][1].pop(-1)

        return node

    def visit_With(self,node):

        body = []
        for n in node.body:
            body = self.helper.wrap_node(n, body, {})

        node.body = body

        return node


    # def visit_Assign(self, node):
    #     if type(node.value) is ast.Call:
    #         n = self.visit(node.value)
    #         node.value = n
    #     return node

class CallTransformer(ast.NodeTransformer):
    def __init__(self,source,tracked):
        self.source = source
        self.tracked = tracked
        self.extractedCalls = {}
        self.expandedComprehensions = {}

    def visit_If(self,node):
        body = []
        for n in node.body:
            self.extractCalls(n,body, True)
            n =self.visit(n)
            body.append(n)
        elseBody = []
        for n in node.orelse:
            self.extractCalls(n,elseBody, True)
            n = self.visit(n)
            elseBody.append(n)
        node.body = body
        node.orelse = elseBody
        return node

    def visit_For(self,node):
        body = []
        for n in node.body:
            self.extractCalls(n,body,True)
            n =self.visit(n)
            body.append(n)
        node.body = body
        return node

    def visit_While(self,node):
        body = []
        for n in node.body:
            self.extractCalls(n, body, True)
            n = self.visit(n)
            body.append(n)
        node.body = body
        return node

    def visit_FunctionDef(self,node):
        body = []
        for n in node.body:
            self.extractCalls(n, body, True)
            n = self.visit(n)
            body.append(n)
        node.body = body
        return node

    def visit_Module(self,node):
        if hasattr(node,"body"):
            body = []
            for n in node.body:
                self.extractCalls(n, body, True)
                n = self.visit(n)
                body.append(n)
            node.body = body
        return node




    def extractCalls(self, node, body, ignoreCall = False):
        nodeType = type(node)

        if nodeType is ast.Assign or nodeType is ast.AugAssign:
            n = self.extractCalls(node.value, body)
            n.lineno = node.lineno

            node.value = n


            return node

        elif nodeType is ast.BinOp:
            left = self.extractCalls(node.left,body)
            right = self.extractCalls(node.right,body)
            node.left = left
            node.right = right
            return node

        elif nodeType is ast.Return or nodeType is ast.Yield:
            if node.value is not None:
                n = self.extractCalls(node.value, body)
                n.lineno = node.lineno
                node.value = n
            return node

        elif nodeType is ast.Tuple:
            for i, elt in enumerate(node.elts):
                n = self.extractCalls(elt,body)
                n.lineno = node.lineno
                node.elts[i] = n
            return node

        elif nodeType is ast.Expr:
            if type(node.value) is ast.Call:
                n = self.extractCalls(node.value,body, ignoreCall)
                n.lineno = node.lineno
                node.value = n

            elif type(node.value) is ast.ListComp:
                n = self.extractCalls(node.value,body)
                n.lineno = node.lineno
                node.value = n

            elif type(node.value) is ast.Yield:
                n = self.extractCalls(node.value, body)
                n.lineno = node.lineno
                node.value = n
            return node
        elif nodeType is ast.ListComp:
            f = open("Anteater/Tracer/helperText/listCompToFor.txt")
            # f = open("helperText/listCompToFor.txt")

            text = f.read()
            f.close()
            lines = text.split("\n")
            generator = node.generators[0]

            targets = astor.to_source(generator.target).strip()
            body2 = []
            expr = self.extractCalls(node.elt,body2)
            yieldExpr = astor.to_source(expr)
            rangeN = self.extractCalls(generator.iter, body)
            forRange = astor.to_source(rangeN).strip()
            origline = self.source[node.lineno - 1]

            if len(generator.ifs) >0:
                ifN = self.extractCalls(generator.ifs[0],body2)
                ifTest =  astor.to_source(ifN).strip()
                ifInd = origline.find("if")
            else:
                ifTest = ""
                ifInd = -1
            # forInd = origline.find("for")
            #
            #
            # for t in self.tracked:
            #     if t.lineno == node.lineno:
            #         print("OFFSETL ", t.offset)
            #         print(forInd)
            #         print(ifInd)
            #
            #         if t.var:
            #             targs =targets.split(",")
            #             ind = targs.index(t.name)
            #             length = 0
            #             for i in range(ind):
            #                 length += len(targs[i]) + 1
            #
            #             t.offset = lines[1].find("REPLACEV") + length + targs[ind].find(t.name)
            #         else:
            #             if t.offset < forInd:
            #                 ind = origline.find(yieldExpr)
            #                 print(node.elt.col_offset)
            #                 t.offset = lines[-1].find("REPLACEEXPR") + t.offset-ind
            #             if ifInd >-1 and t.offset > ifInd:
            #                 ind = origline.find(ifTest)
            #                 t.offset = lines[-1].find("REPLACEIF") + t.offset-ind
            #         print(t.offset)


            text = text.replace("REPLACEEXPR", yieldExpr)
            text = text.replace("REPLACEV",targets)

            text = text.replace("REPLACERANGE", forRange)

            if (len(generator.ifs) > 0):
                text = text.replace("REPLACEIF", ifTest)
            else:
                text = text.replace("REPLACEIF", "True")

            fname = "f" + str(uuid.uuid4().hex) + "gen"

            text = text.replace("REPLACEFUNC", fname)

            n= ast.parse(text).body[0]
            n.lineno = node.lineno
            #set lineno of for loop
            n.body[0].lineno = node.lineno
            #set lineno of if
            n.body[0].body[0].lineno = node.lineno
            #set lineno of if body and add body2 to it
            n.body[0].body[0].body = np.concatenate((body2, n.body[0].body[0].body))
            for n2 in n.body[0].body[0].body:
                n2.lineno = node.lineno


            self.expandedComprehensions.update({node.lineno:{"func":text,"targetInd": node.col_offset + lines[1].find("REPLACEV"), "yieldExprInd":node.col_offset + lines[-1].find("REPLACEEXPR"), "ifTestInd":lines[-1].find("REPLACEIF"), "origLine":origline}})
            # n = self.visit(n)
            body.append(n)

            return ast.parse("list(" + fname + "())").body[0].value


        elif nodeType is ast.Call:
            for i,arg in enumerate(node.args):
                n = self.extractCalls(arg,body)
                n.lineno = arg.lineno

                node.args[i] = n

            if not ignoreCall:
                id = "v"+str(uuid.uuid4().hex)
                n = ast.Assign([ast.Name(id,ast.Store())],node)
                n.lineno = node.lineno
                #the start of the original call
                startInd = node.col_offset
                openParenthCt = 1
                curLine = n.lineno - 1
                #get the portion of the line containing the orignal function
                line = self.source[curLine][startInd:]

                ind = line.find("(") + 1


                #search for the closing parentheses of the call, keeping track of all parentheses in case of nested calls
                while openParenthCt > 0:
                    if ind == len(line) and openParenthCt > 0:
                        curLine += 1
                        line = self.source[curLine]
                        ind = 0
                    if line[ind] == "(":
                        openParenthCt += 1
                    elif line[ind] == ")":
                        openParenthCt -= 1
                    ind += 1



                #check if the call is fully contained on a single line
                if curLine == n.lineno-1 or (curLine == n.lineno and ind == 0):
                    callExpr = self.source[n.lineno-1][startInd:ind+startInd]
                else:
                    #if not, set the expression to the first line
                    callExpr = self.source[n.lineno-1][startInd:]
                #add each additional line except the last (if the call spans multiple lines)
                for i in range(n.lineno,curLine-1):
                    callExpr += self.source[i]+"\n"
                #Add the last line if it spans multiple lines
                if curLine != n.lineno-1:
                    callExpr += self.source[curLine][:ind]
                #check if the line already exists in the call infos
                if n.lineno in self.extractedCalls.keys():
                    #add offset and variable expression pair to the calls
                    self.extractedCalls[n.lineno].update({node.col_offset: [id, callExpr]})
                else:
                    #add the line, the offset, and the variable expression pair to the calls
                    self.extractedCalls.update({n.lineno: {node.col_offset: [id, callExpr]}})
                body.append(n)



                return ast.Name(id,ast.Load())
            else:
                return node

        else:
            return node
