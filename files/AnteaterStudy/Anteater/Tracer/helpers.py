import ast
import uuid
import numpy as np
import astor
import re


class TranfsormerHelpers:

    def __init__(self,variables,expressions, exclusions,visitor,excludedFuncs,excludedLibs,source,extractedCalls, extractedComprehensions):
        self.expressions = expressions
        self.variables = variables
        self.exclusions = exclusions
        self.loopCounterIDStack = []
        self.visitor = visitor
        self.blockStack = []
        self.id = visitor.id
        self.excludedFuncs = excludedFuncs
        self.excludedLibs = excludedLibs
        self.source = source
        self.extractedCalls =extractedCalls
        self.extractedComprehensions = extractedComprehensions
        self.instances = {}

        for v in variables:
            self.instances.update({v:[]})

    #function to parse a string of source code into AST nodes
    def parse_code(self,code, lineno):
        n = ast.parse(code)
        body = []
        for node in n.body:
            node.lineno = lineno
            body.append(node)
        return body


    def check_exclusion(self,node):

        #TODO: If normal, non attribute call just build the name and check it
        nodeType = type(node.func)
        fStr = self.create_containing_function_str()
        if nodeType is ast.Name:
            fname = self.create_function_name(node.func)
            if fname in self.excludedFuncs:
                i =0
                while i < len(self.exclusions):
                    excl =  self.exclusions[i]
                    if excl.func and excl.name == fname:
                        if excl.containingFuncStr =="":
                            return True
                        elif fStr.find(excl.containingFuncStr) >-1:
                            return True
                    i+=1
        # TODO: If attribute call, check the whole thing, the final attribute (the actual call),
        # TODO:  and the initial object (in case it is amn excluded libarary)
        elif nodeType is ast.Attribute:
            wholeName = self.create_function_name(node.func)
            final =wholeName[wholeName.rfind(".")+1:]
            lib = wholeName[:wholeName.find(".")]

            if final in self.excludedFuncs:
                i = 0
                while i < len(self.exclusions):
                    excl = self.exclusions[i]
                    if excl.func and excl.name == final:
                        if excl.containingFuncStr == "":
                            return True
                        elif fStr.find(excl.containingFuncStr) > -1:
                            return True
                    i+=1

            if lib in self.excludedLibs:
                return True

        return False


    def finish_node(self,body, node, nodeType,recordAttrs,footer = True, closeBody = False):
        if node.lineno in self.expressions:
            body,node = self.create_expr_nodes(node,node.lineno,body,recordAttrs)

        else:
            body.append(node)

        if footer:
            body = list(np.concatenate((body,self.create_closing_nodes(nodeType,node.lineno,closeBody))))

        return body

    def create_containing_function_str(self):
        funcStack = self.visitor.functionStack
        fStr = ""
        first = True
        for f in funcStack:
            if not first:
                fStr+="_"
            else:
                first = False
            fStr+=f[0]
        return  fStr

    def create_function_name(self,n):

        name = astor.to_source(n)
        cutoff = name.find("(")
        name = name[:cutoff]
        return name

    #Method that wraps source nodes with other nodes to collect information about htem
    def wrap_node(self,n, body,  parentAttrs = None):
        nodeType = type(n)
        recordAttrs = {}
        if parentAttrs is not None:
            recordAttrs.update(parentAttrs)



        #wrap the different node types in the appropriate nodes
        if nodeType is ast.For:
            # Before the loop, record the standard info about the loop.
            # Add an iteration counter that increments with each loop execution
            # For each child, have it record the iteration number
            body = list(np.concatenate((body,self.generate_tab_nodes(n.lineno))))

            #check if the for loop has a tuple of variables it is iterating over
            if type(n.target) is ast.Tuple:
                for i,target in enumerate(n.target.elts):
                    targetName = target.id
                    recordAttrs.update({"target" +str(i+1) : "\"" + targetName + "\""})
                body=list(np.concatenate((body,self.create_opening_nodes("for",n.lineno,recordAttrs, body = True, globals=False))))
            else:
                targetName = n.target.id
                recordAttrs.update({"target":"\""+targetName+ "\""})
                body = list(np.concatenate((body,self.create_opening_nodes("for",n.lineno,recordAttrs,body = True, globals=False))))

            loopId = "f" + str(uuid.uuid4().hex) +"ind"
            while loopId in self.loopCounterIDStack:
                loopId = "f" + str(uuid.uuid4().hex) + "ind"
            self.loopCounterIDStack.append(loopId)
            body = list(np.concatenate((body,self.parse_code(loopId + "=0",n.lineno))))

            n = self.visitor.visit(n)
            body = self.finish_node(body,n, "for", recordAttrs,True,True)
            self.loopCounterIDStack.pop()


        elif nodeType is ast.While:
            body = list(np.concatenate((body,self.generate_tab_nodes(n.lineno))))
            body = list(np.concatenate((body, self.create_opening_nodes("while", n.lineno, recordAttrs, body = True, globals=False))))

            loopId = "f" + str(uuid.uuid4().hex) + "ind"
            while loopId in self.loopCounterIDStack:
                loopId = "f" + str(uuid.uuid4().hex) + "ind"
            self.loopCounterIDStack.append(loopId)
            body = list(np.concatenate((body,self.parse_code(loopId + "=0",n.lineno))))


            n = self.visitor.visit(n)
            body = self.finish_node(body, n, "while", recordAttrs, True, True)
            self.loopCounterIDStack.pop()


        elif nodeType is ast.Expr and type(n.value) is ast.Call:
            n = self.visitor.visit(n)
            body = list(np.concatenate((body,self.generate_tab_nodes(n.lineno))))
            if not self.check_exclusion(n.value):

                recordAttrs.update({"func_name" : "\""+self.create_function_name(n.value)+"\"" })

                body = list(np.concatenate((body, self.create_opening_nodes("call", n.lineno, recordAttrs, body=True,
                                                                            globals=False))))
                body = self.finish_node(body, n, "call", recordAttrs, True, True)
            else:
                self.finish_node(body,n,"call",recordAttrs,False,False)


        elif nodeType is ast.Return:
            n = self.visitor.visit(n)

            if n.lineno in self.expressions:
                body, n = self.create_expr_nodes(n,n.lineno,body,recordAttrs,False)


            if len(self.visitor.functionStack) > 0:
                for block in self.visitor.functionStack[-1][1]:
                    # body = self.create_closing_nodes(block,n.lineno,body)
                    body = list(np.concatenate((body, self.create_closing_nodes(block, n.lineno, True))))

            body.append(n)



        elif nodeType is ast.Assign or nodeType is ast.AugAssign:

            n = self.visitor.visit(n)
            body = list(np.concatenate((body, self.generate_tab_nodes(n.lineno))))
            targets = []
            targetNames = []
            if type(n) is ast.AugAssign:
                targets = [n.target]
                targetNames = [astor.to_source(n.target).strip()]
            elif type(n.targets[0]) is ast.Tuple:
                for t in n.targets[0].elts:
                    targets.append(t)
                    targetNames.append(astor.to_source(t).strip())
            else:
                targets.append(n.targets[0])
                targetNames.append(astor.to_source(n.targets[0]).strip())

            call = False
            if type(n.value) is ast.Call and not self.check_exclusion(n.value):
                callAttrs= recordAttrs.copy()
                callAttrs.update({"func_name":"\"" + self.create_function_name(n.value).strip() + "\""})

                body = list(np.concatenate((body,self.create_opening_nodes("call",n.lineno,callAttrs,body = True, globals = False))))
                call = True

            if n.lineno in self.expressions:
                body,n= self.create_expr_nodes(n,n.lineno,body,recordAttrs)
            else:
                body.append(n)

            if call:
                body = list(np.concatenate((body,self.create_closing_nodes("call",n.lineno,True))))


            fStr = self.create_containing_function_str()

            for i,target in enumerate(targets):
                additionalAttrs= {}
                tName = targetNames[i]
                if tName in self.variables:
                    additionalAttrs.update(recordAttrs)
                    nTracked = len(self.visitor.tracked)
                    i = 0
                    obj = self.visitor.tracked[i]
                    while i < nTracked - 1 and (obj.name !=tName or obj.containingFunc != fStr):
                        i+=1
                        obj = self.visitor.tracked[i]

                    if obj.containingFunc == fStr:
                        self.instances[tName].append([n.lineno,target.col_offset])

                        targetLbl = tName.replace("\"","\\\"")

                        additionalAttrs.update({"name": "\""+str(targetLbl)+"\""})
                        additionalAttrs.update({targetLbl:tName})
                        if obj.custom is not None and len(obj.custom) > 0:
                            for i, e in enumerate(obj.custom):
                                f = open("Anteater/Tracer/helperText/custom.txt", "r")
                                text = f.read()
                                f.close()
                                text = text.replace("REPLACE_I", str(i))
                                text = text.replace("EXPR", e)
                                nodes = self.parse_code(text, n.lineno)
                                body = np.concatenate((body,nodes))
                                additionalAttrs.update({e.replace("\"","\\\\\\\""):"cExp"+str(i)})


                        body = list(np.concatenate((body,self.create_opening_nodes("assign", n.lineno, additionalAttrs,body=False,globals=False))))
                        body= list(np.concatenate((body,self.create_closing_nodes("assign",n.lineno,False))))




        elif nodeType is ast.If:
            # This doesn't really belong here but things are weird
            self.visitor.visit(n.test)
            ifBody = []
            elseBody = []
            for node in n.body:
                ifBody = self.wrap_node(node,ifBody,recordAttrs)
            if n.orelse is not None:
                for node in n.orelse:
                    elseBody = self.wrap_node(node,elseBody,recordAttrs)
            n.body = ifBody
            n.orelse = elseBody
            body = self.finish_node(body,n,"if",recordAttrs,False,False)

        elif nodeType is ast.arg:
            if n.arg in self.variables:
                i=0
                nTracked = len(self.visitor.tracked)
                while i < nTracked and (self.visitor.tracked[i].name != n.arg or self.visitor.tracked[i].lineno !=n.lineno):
                    i += 1
                if i < nTracked:
                    self.instances[n.arg].append([n.lineno,n.col_offset])
                    additionalAttrs = {"name": "\"" + str(n.arg) + "\"",n.arg: n.arg}
                    obj = self.visitor.tracked[i]
                    if obj.custom is not None and len(obj.custom) > 0:
                        for i, e in enumerate(obj.custom):
                            f = open("Anteater/Tracer/helperText/custom.txt", "r")
                            text = f.read()
                            f.close()
                            text = text.replace("REPLACE_I", str(i))
                            text = text.replace("EXPR", e)
                            nodes = self.parse_code(text, n.lineno)
                            body = np.concatenate((body, nodes))
                            additionalAttrs.update({e.replace("\"", "\\\\\\\""): "cExp" + str(i)})

                    body = list(np.concatenate((body, self.create_opening_nodes("param", n.lineno,additionalAttrs , False, False))))
                    body = list(np.concatenate((body, self.create_closing_nodes("param", n.lineno, False))))

        # elif nodeType is ast.Expression and type(n.value) is ast.ListComp:
        #     f = open("Anteater/Tracer/helperText/listCompToFor.txt")
        #     text = f.read()
        #     f.close()
        #     text = text.replace("REPLACEEXPR", astor.to_source(n.elt))
        #     generator = n.generators[0]
        #     text = text.replace("REPLACEV", astor.to_source(generator.target).strip())
        #
        #     text = text.replace("REPLACERANGE", astor.to_source(generator.iter).strip())
        #
        #     if (len(generator.ifs) > 0):
        #         text = text.replace("REPLACEIF", astor.to_source(generator.ifs[0]).strip())
        #     else:
        #         text = text.replace("REPLACEIF", "true")
        #
        #     fname = "f" + str(uuid.uuid4().hex) +"gen"
        #
        #     text = text.replace("REPLACEFUNC",fname)
        #
        #
        #     n = self.parse_code("list(" + fname + ")",n.lineno)[0]
        #
        #     for_node = self.parse_code(text,n.lineno)[0]
        #     for node in for_node.body:
        #         node.lineno = n.lineno
        #
        #     body = self.wrap_node(for_node,body,parentAttrs)


            #split line into three parts: expr, for, and if
            # line = self.source[n.lineno-1]
            # if_ind = line.find("if")
            # if if_ind > -1:
            #     if_ind += 2
            # for_ind = line.find("for") + 3
            # expr_ind = 0

            # body = list(np.concatenate((body, self.generate_tab_nodes(n.lineno))))

            # check if the for loop has a tuple of variables it is iterating over
            # if type(for_node.target) is ast.Tuple:
            #     for i, target in enumerate(for_node.target.elts):
            #         targetName = target.id
            #         recordAttrs.update({"target" + str(i + 1): "\"" + targetName + "\""})
            #     body = list(np.concatenate(
            #         (body, self.create_opening_nodes("for", for_node.lineno, recordAttrs, body=True, globals=False))))
            # else:
            #     targetName = for_node.target.id
            #     recordAttrs.update({"target": "\"" + targetName + "\""})
            #     body = list(np.concatenate(
            #         (body, self.create_opening_nodes("for", for_node.lineno, recordAttrs, body=True, globals=False))))
            #
            # loopId = "f" + str(uuid.uuid4().hex) + "ind"
            # while loopId in self.loopCounterIDStack:
            #     loopId = "f" + str(uuid.uuid4().hex) + "ind"
            # self.loopCounterIDStack.append(loopId)
            # body = list(np.concatenate((body, self.parse_code(loopId + "=0", n.lineno))))
            #
            # n = self.visitor.visit(n)
            # body = self.finish_node(body, n, "for", recordAttrs, True, True)
            # self.loopCounterIDStack.pop()



            # tokens = line.split("if")
            # if len(tokens) >1:
            #     comp_if = line.split("if")[1]
            # else:
            #     comp_if = ""
            # comp_for =


        else:
            self.visitor.visit(n)
            body = self.finish_node(body,n,"",recordAttrs,False,False)

        return body


    def create_opening_nodes(self,nodeType, lineno, attr, globals, body):
        # create node for id
        nodes = []
        if globals:
            gNode =ast.Global(names=[self.id + "startTime"])
            gNode.lineno = lineno
            nodes.append(gNode)

        f = open("Anteater/Tracer/helperText/RecordHeader.txt", "r")
        text = f.read()
        f.close()
        text = text.replace("REPLACE",self.id)
        text = text.replace("REPLINENO",str(lineno))
        text = text.replace("RTYPE",nodeType)

        nodes = list(np.concatenate((nodes, self.parse_code(text,lineno))))

        for key in attr.keys():
            # "str + = tabstr + \"\t\"\\\"key \\\" \":\""
            # n = ast.AugAssign(target = ast.Name(id=str(self.id+"str"),ctx=ast.Store()),op=ast.Add(), value=ast.BinOp(
            #     left=ast.Name(id=str(self.id+"tabstr"),ctx=ast.Load()),op=ast.Add(), right = ast.Str(s=str("\t\""+str(key)+"\":"))))
            # n.lineno = lineno
            # nodes.append(n)
            nodes = list(np.concatenate((nodes,self.parse_code(self.id+"str+= "+self.id+"tabstr+\"\\t\\\""+str(key)+"\\\":\"",lineno))))
            if type(attr[key]) is dict:
                n = ast.AugAssign(target = ast.Name(id=str(self.id+"str"),ctx=ast.Store()),op=ast.Add(), value=ast.BinOp(
                left=ast.Name(id=str(self.id+"tabstr"),ctx=ast.Load()),op=ast.Add(), right = ast.Str(s=str("\t{\n\""))))
                n.lineno = lineno
                nodes.append(n)

                for i,k2 in enumerate(attr[key].keys()):
                    if i >0:
                        n = ast.AugAssign(target=ast.Name(id=str(self.id + "str"), ctx=ast.Store()), op=ast.Add(),
                                          value=ast.Str(s=",\n"))
                        n.lineno = lineno
                        nodes.append(n)
                    n = ast.AugAssign(target=ast.Name(id=str(self.id + "str"), ctx=ast.Store()), op=ast.Add(), value=ast.BinOp(
                        left=ast.BinOp(left=ast.Name(id=str(self.id + "tabstr"), ctx=ast.Load()), op=ast.Add(),
                            right =ast.Str(s=str("\""+str(k2)+"\":"))),op=ast.Add(),right =ast.Call(func=ast.Name(
                                id=str(self.id+"funcstr"),ctx=ast.Load()),args=[ast.Name(id=str(attr[key][k2]),ctx=ast.Load())],keywords=[])))
                    n.lineno = lineno
                    nodes.append(n)

            else:
                nodes = list(np.concatenate((nodes,self.parse_code(self.id+"str+="+self.id+"funcstr("+attr[key]+")+\",\\n\"",lineno))))
                # n = ast.AugAssign(target=ast.Name(id=str(self.id + "str"), ctx=ast.Store()), op=ast.Add(), value=ast.BinOp(
                #     left=ast.Call(func=ast.Name(id=str(self.id+"funcstr"),ctx=ast.Load()),args=[ast.Str(s=str(attr[key]))],keywords=[]), op=ast.Add(),
                #     right=ast.Str(s=",\n")))
                # n.lineno = lineno
                # nodes.append(n)
                pass

        if body:
            n = ast.AugAssign(target=ast.Name(id=self.id+"str", ctx=ast.Store()),op=ast.Add(),value = ast.BinOp(left=ast.Name(id=self.id+"tabstr",
                                          ctx = ast.Load()),op=ast.Add(),right=ast.Str(s="\t\"body\":[\n")))
            n.lineno = lineno
            nodes.append(n)

            n = ast.Expr(value=ast.Call(func=ast.Attribute(value=ast.Name(id=self.id+"closingStack",ctx = ast.Load()), attr='append',ctx=ast.Load()),args=[ast.Str(s="]")],keywords=[]))
            n.lineno = lineno
            nodes.append(n)

        else:
            n = ast.AugAssign(target=ast.Name(id=self.id + "str",ctx = ast.Store()), op=ast.Add(),value=ast.Str(s="DELETE\n"))
            n.lineno = lineno
            nodes.append(n)


        if nodeType is "for" or nodeType is "while" or nodeType is "call":
            # add node id to the stack of blocks (so all its children will match with it)
            blockNode = ast.Expr(
                value=ast.Call(func=ast.Attribute(value=ast.Name(id=self.id + "blockStack", ctx=ast.Load()),
                                                  attr="append", ctx=ast.Load()),
                               args=[ast.Name(id=self.id + "curID", ctx=ast.Load())],keywords=[]))
            blockNode.lineno = lineno
            nodes.append(blockNode)


        n = ast.Expr(value=ast.Call(func=ast.Attribute(value=ast.Name(id=self.id,ctx=ast.Load()),attr="write",ctx=ast.Load()),
                     args=[ast.Name(id=self.id+"str",ctx=ast.Load())],keywords=[]))
        n.lineno = lineno
        nodes.append(n)

        n = ast.AugAssign(target=ast.Name(id=self.id+"Tabs",ctx= ast.Store()),op=ast.Add(),value=ast.Num(n=1))
        n.lineno = lineno
        nodes.append(n)


        return nodes


    def create_closing_nodes(self,nodeType,lineno,body):
        nodes = []
        if nodeType is "for" or nodeType is "while" or nodeType is "call":

            blockNode = ast.Expr(
                value=ast.Call(func=ast.Attribute(value=ast.Name(id=self.id + "blockStack", ctx=ast.Load()),
                                                  attr="pop", ctx=ast.Load()),
                               args=[ast.UnaryOp(op=ast.USub(), operand=ast.Num(n=1))],keywords=[]))
            blockNode.lineno = lineno

            nodes.append(blockNode)

        n = ast.AugAssign(target=ast.Name(id=self.id + "Tabs",ctx = ast.Store()), op=ast.Sub(), value=ast.Num(n=1))
        n.lineno = lineno
        nodes.append(n)
        nodes = list(np.concatenate((nodes,self.generate_tab_nodes(False))))

        n = ast.Assign(targets=[ast.Name(id=self.id + "str", ctx = ast.Store())], value=ast.Str(s="DELETE\n"))
        n.lineno = lineno
        nodes.append(n)

        if body:

            n = ast.AugAssign(target=ast.Name(id=self.id + "str", ctx = ast.Store()), op=ast.Add(),
                              value=ast.BinOp(left=ast.Name(id=self.id + "tabstr",
                                                            ctx=ast.Load()), op=ast.Add(),
                                              right=ast.Str(s="\t]\n")))
            n.lineno = lineno
            nodes.append(n)

            n = ast.Expr(value=ast.Call(func=ast.Attribute(value=ast.Name(id=self.id + "closingStack", ctx=ast.Load()), attr='pop',
                                            ctx=ast.Load()), args=[],keywords = []))
            n.lineno = lineno
            nodes.append(n)

        n = ast.AugAssign(target=ast.Name(id=self.id + "str",ctx =ast.Store()), op=ast.Add(),
                          value=ast.BinOp(left=ast.Name(id=self.id + "tabstr",
                                                        ctx=ast.Load()), op=ast.Add(),
                                          right=ast.Str(s="},\n")))
        n.lineno = lineno
        nodes.append(n)

        n = ast.Expr(value=ast.Call(func=ast.Attribute(value=ast.Name(id=self.id + "closingStack", ctx=ast.Load()), attr='pop',
                                        ctx=ast.Load()), args=[], keywords=[]))
        n.lineno = lineno
        nodes.append(n)

        n = ast.Expr(value = ast.Call(func=ast.Attribute(value=ast.Name(id=self.id, ctx=ast.Load()), attr="write", ctx=ast.Load()),
                     args=[ast.Name(id=self.id+"str",ctx = ast.Load())], keywords=[]))
        n.lineno = lineno
        nodes.append(n)

        return nodes



    def build_code_line(self,lines):


        ind = 0
        curLine = lines[ind].strip()
        whitespace = lines[ind][:lines[ind].find(lines[ind].strip())]
        blockStack = []
        lineInd = 0
        inString = False
        curQuote = None
        lineText = whitespace + lines[ind].strip()
        # print(curLine)
        while (lineInd < len(curLine) or len(blockStack) > 0):

            if curLine[lineInd] == "\"" or curLine[lineInd] == "'":
                if inString and curLine[lineInd] == curQuote:
                    curQuote = None
                    inString = False
                elif not inString:
                    inString = True
                    curQuote = curLine[lineInd]

            if not inString:
                if curLine[lineInd] == "[" or curLine[lineInd] == "(" or curLine[lineInd] == "{":
                    blockStack.append(curLine[lineInd])
                elif curLine[lineInd] == "]" or curLine[lineInd] == ")" or curLine[lineInd] == "}":
                    blockStack.pop()
            lineInd += 1

            if lineInd == len(curLine) and len(blockStack) > 0:
                ind += 1
                whitespace = lines[ind][:lines[ind].find(lines[ind].strip())]
                curLine = lines[ind].strip()
                lineText += "\n"+whitespace + curLine
                lineInd = 0

        return lineText

    def create_expr_nodes(self,n,lineno,body,attrs,append = True):
        if attrs is None:
            attrs={}

        inds =[]
        afterbody = []
        nTracked = len(self.visitor.tracked)
        for i in range(nTracked):
            if self.visitor.tracked[i].lineno == lineno and not self.visitor.tracked[i].var:
                inds.append(i)

        if len(inds) > 0:
            #copy the original text to build the new line
            # newLine =self.source[lineno-1]
            newLine = self.build_code_line(self.source[lineno-1:])
            print(newLine)

            callKeys = list(self.extractedCalls.keys())

            extractedOffsets = []
            if lineno in callKeys:
                extractedOffsets = list(self.extractedCalls[lineno].keys())

            extractedOffsets.sort()

            #replace all function calls in the line from back to front
            for i in range(len(extractedOffsets)-1,-1,-1):
                #TODO: assumes call is on a single line (fix later)
                offset = extractedOffsets[i]
                call = self.extractedCalls[lineno][offset]
                beginning = newLine[:offset]
                newMiddle = call[0]

                #search the current newline for the closing parentheses
                l = newLine[offset:]

                ind = l.find("(") + 1
                openParenthCt = 1
                # search for the closing parentheses of the call, keeping track of all parentheses in case of nested calls
                while openParenthCt > 0:
                    if l[ind] == "(":
                        openParenthCt += 1
                    elif l[ind] == ")":
                        openParenthCt -= 1
                    ind += 1

                ending = newLine[offset + len(self.extractedCalls[lineno][offset][1]):]
                newLine = beginning + newMiddle + ending
            print("After replacement " ,newLine)


                    # for ind in range(3,len(newLines)-1):
                    #     compLine = ind
                    #     lineText = self.build_code_line(newLines[ind:])
                    #     print(lineText)
                    #     n2 = ast.parse(lineText.strip()).body[0]
                    #
                    #     if type(n2) is ast.Assign and n.targets[0].id == n2.targets[0].id:
                    #         newLine = lineText
                    #
                    #         break


            inds.sort(key=lambda x: self.visitor.tracked[x].offset)
            print("Before: ", newLine)
            for j in range(len(inds)):
                i = inds[j]

                expr = self.visitor.tracked[i]
                original_offset = expr.offset
                afterbody = None
                if expr.custom:
                    pass
                #check if an expression starting at a changed offset is present
                #The expression may have been extracted into a variable already
                elif expr.offset in extractedOffsets:
                    curAttrs = attrs.copy()
                    print(ast.dump(n))
                    print(self.extractedCalls[lineno][expr.offset][0])
                    print(self.extractedCalls[lineno][expr.offset][1].strip())
                    if type(n) is ast.Assign and n.targets[0].id == self.extractedCalls[lineno][expr.offset][0] and \
                        expr.name == self.extractedCalls[lineno][expr.offset][1].strip():
                        curAttrs.update({"name":"\"" + str(expr.name) + "\""})
                        print("EXPR ATTR 1: ",curAttrs)
                        #
                        # afterbody = self.generate_tab_nodes(lineno,False)
                        # afterbody = list(np.concatenate((afterbody,self.create_opening_nodes("expression",lineno,curAttrs,False,False))))
                        # afterbody = list(np.concatenate((afterbody,self.create_closing_nodes("expression",lineno,False))))

                    else:
                        print("here")
                        # need to make sure that we have found the actual expression node, not one we extracted but
                        #gave the same line number
                        origNode = self.parse_code(self.source[lineno-1].strip(),lineno)[0]
                        if type(origNode) == type(n):
                            #they are the same type but need to make sure they are the same node.
                            #nodes created during extraction are: a new assignment
                            exprText = self.source[lineno-1][expr.offset:]
                            for i in range(len(extractedOffsets) - 1, -1, -1):
                                offset = extractedOffsets[i]
                                if offset >= expr.offset:
                                    call = self.extractedCalls[lineno][offset]
                                    beginning = exprText[:offset-expr.offset]
                                    newMiddle = call[0]
                                    # search the current newline for the closing parentheses
                                    l = exprText[offset-expr.offset:]

                                    ind = l.find("(") + 1
                                    openParenthCt = 1
                                    # search for the closing parentheses of the call, keeping track of all parentheses in case of nested calls
                                    while openParenthCt > 0:
                                        if l[ind] == "(":
                                            openParenthCt += 1
                                        elif l[ind] == ")":
                                            openParenthCt -= 1
                                        ind += 1

                                    ending = exprText[ind:]
                                    exprText = beginning + newMiddle + ending

                            match = False
                            if type(n) is ast.Assign:
                                if origNode.targets[0].id==n.targets[0].id:
                                    match= True
                            else:
                                print("TOOD: EXPR NOT ASSIGN")

                            if match:
                                f = open("Anteater/Tracer/helperText/exprFunc.txt")
                                text =f.read()
                                f.close()
                                text = text.replace("REPLACE",expr.id)
                                text = text.replace("EXPR", exprText)

                                self.excludedFuncs.append("function"+expr.id)
                                fStr = self.create_containing_function_str()

                                self.exclusions.append(ExclusionObject("function"+expr.id,True, expr.lineno, fStr))

                                funcNode = self.parse_code(text,lineno)[0]

                                curAttrs.update({"name":"\"" + str(expr.name) + "\""})
                                curAttrs.update({expr.name: "temp"+expr.id})

                                print("EXPR ATTR: ", curAttrs)

                                tabNodes = self.generate_tab_nodes(lineno, True)
                                headNodes = self.create_opening_nodes("expression",lineno,curAttrs,True,False)
                                footNodes = self.create_closing_nodes("expression",lineno,False)

                                funBody = [funcNode.body[0]]
                                funBody = list(np.concatenate((funBody, tabNodes)))
                                funBody = list(np.concatenate((funBody,headNodes)))
                                funBody = list(np.concatenate((funBody,footNodes)))
                                funBody.append(funcNode.body[1])

                                funcNode.body = funBody

                                body.append(funcNode)

                                front = newLine[:expr.offset]

                                tail = newLine[expr.offset + len(exprText):]

                                if type(n) is ast.Return:
                                    l = front + "function"+expr.id +"()" +tail
                                    l.strip()
                                    l = "def temp(): +\n\t"+l

                                    n=self.parse_code(l)[0].body[0]
                                elif type(n) is ast.While or type(n) is ast.For:
                                    l = front + "function"+expr.id +"()" +tail
                                    l = l.strip()
                                    l+="\n\tpass"
                                    newN = self.parse_code(l, lineno)[0]
                                    newN.body = n.body
                                    n = newN
                                elif type(n) is ast.If:
                                    l = front + "function" + expr.id + "() " + tail
                                    l = l.strip()
                                    l += "\n\tpass"
                                    for k in range(j + 1, len(inds)):

                                        if self.visitor.tracked[inds[k]].offset > expr.offset:
                                            self.visitor.tracked[inds[k]].offset += len(
                                                "function" + expr.id + "() ") - len(
                                                expr.name)

                                    newN = self.parse_code(l, lineno)[0]
                                    newN.body = n.body
                                    n = newN
                                else:
                                    l = front + "function" + expr.id + "() " + tail
                                    # newLineText = l

                                    l = l.strip()
                                    for k in range(j + 1, len(inds)):
                                        if self.visitor.tracked[k].offset > expr.offset:
                                            self.visitor.tracked[k].offset += len(
                                                "function" + expr.id + "() ") - len(expr.name)
                                    n = self.parse_code(l, lineno)[0]
                                newLine = l

                else:
                    curAttrs = attrs.copy()

                    exprText = expr.name
                    print("EXPR: ", exprText)

                    comprehensionKeys = self.extractedComprehensions.keys()
                    compLine = -1
                    if lineno in comprehensionKeys:
                        newLine = self.extractedComprehensions[lineno]["func"].strip()
                        newLines = newLine.split("\n")

                        # TODO: assume that the if statement is not captured as an expression
                        origLine = self.build_code_line(self.source[lineno - 1:])

                        forInd = origLine.find("for")
                        ifInd = origLine.find("if")

                        if type(n) is ast.FunctionDef:
                            break;
                        elif type(n) is ast.For:
                            newLine = newLines[1]
                            if expr.offset < forInd:
                                break;
                        elif type(n) is ast.If:
                            newLine = newLines[2]

                            if ifInd ==-1 or expr.offset < ifInd:
                                break;
                        elif type(n) is ast.Expr and type(n.value) is ast.Yield:
                            newLine = newLines[-1]

                            for i in range(len(extractedOffsets) - 1, -1, -1):
                                offset = extractedOffsets[i]
                                call = self.extractedCalls[lineno][offset]
                                #if it is contained completely in an extracted call
                                if offset < forInd and expr.offset > offset and expr.offset  + expr.name < offset + len(call[1]):
                                    break;
                                else:
                                    #TODO:: Hacky and not unbreakable
                                    afterYield = newLine.find("yield") + 6

                                    expr.offset = afterYield + newLine[afterYield:].find(expr.name)


                        elif type(n) is ast.Assign:
                            needToBreak = False
                            # TODO: might break with nested calls
                            for i in range(len(extractedOffsets) - 1, -1, -1):
                                offset = extractedOffsets[i]
                                call = self.extractedCalls[lineno][offset]
                                callLine = call[0] + " = " + call[1]
                                if offset < forInd:
                                    newLines.insert(-1, callLine)
                                elif offset > ifInd:
                                    newLines.insert(2, callLine)
                                if call[0] == n.targets[0].id:
                                    newLine = callLine

                                    if offset < forInd and expr.offset < offset:
                                        needToBreak =True
                            if needToBreak:
                                print("NEED TO BREAK")
                                break;
                            origNode = ast.parse(origLine.strip()).body[0]

                            if type(origNode) is ast.Assign:
                                if astor.to_source(n.targets[0]) == astor.to_source(origNode.targets[0]):
                                    break;


                    for i in range(len(extractedOffsets) - 1, -1, -1):
                        call = self.extractedCalls[lineno][extractedOffsets[i]]
                        # callOffset = newLine.find(call[0])
                        callOffset = extractedOffsets[i]

                        # #call is contained in expression
                        if callOffset >= expr.offset and callOffset < expr.offset + len(expr.name):
                            # call = self.extractedCalls[lineno][extractedOffsets[i]]
                            exprText = expr.name[:callOffset - expr.offset + 2] + call[0] + expr.name[callOffset - expr.offset +2 + len(call[1]):]

                            expr.offset += newLine.find(call[0]) - callOffset -2


                            print(exprText)

                        elif expr.offset + len(expr.name) < callOffset:
                            pass

                        #check if expression is in call (as a parameter)
                        if expr.offset > callOffset and  expr.offset + len(expr.name) < callOffset + len(call[1]):
                            if not (type(n) is ast.Assign and n.targets[0].id ==self.extractedCalls[lineno][callOffset][0]):
                                break
                            else:
                                line = self.source[lineno-1]
                                firstInd = line.find(line.strip())
                                newLine = line[:firstInd] + call[0] + " = " + call[1]
                                expr.offset = len(line[:firstInd] + call[0] + " = ") + call[1].find(expr.name)


                        #check if expression is after call
                        elif expr.offset > callOffset + len(call[1]):
                            expr.offset = expr.offset - len(call[1]) + len(call[0])


                    ind = expr.offset
                    # need to make sure that we have found the actual expression node, not one we extracted but
                    # gave the same line number
                    if ind >=0:
                        f = open("Anteater/Tracer/helperText/exprFunc.txt")
                        text = f.read()
                        f.close()
                        text = text.replace("REPLACE", expr.id)
                        text = text.replace("EXPR", expr.name)

                        self.excludedFuncs.append("function" + expr.id)
                        fStr = self.create_containing_function_str()

                        self.exclusions.append(
                            ExclusionObject("function" + expr.id, True, expr.lineno, fStr))

                        funcNode = self.parse_code(text, lineno)[0]
                        curAttrs.update({"name": "\"" + str(expr.name) + "\""})
                        curAttrs.update({expr.name: "temp" + expr.id})


                        tabNodes = self.generate_tab_nodes(lineno,True)
                        headNodes = self.create_opening_nodes("expression", lineno, curAttrs, True, False)
                        footNodes = self.create_closing_nodes("expression", lineno, False)

                        funBody = [funcNode.body[0]]
                        funBody = list(np.concatenate((funBody, tabNodes)))
                        funBody = list(np.concatenate((funBody, headNodes)))
                        funBody = list(np.concatenate((funBody, footNodes)))
                        funBody.append(funcNode.body[1])

                        funcNode.body = funBody

                        body.append(funcNode)


                        front = newLine[:expr.offset]

                        tail = newLine[expr.offset + len(exprText):]

                        if type(n) is ast.Return:
                            l = front + "function" + expr.id + "()" + tail
                            newLine = l

                            l.strip()
                            l = "def temp(): +\n\t" + l

                            n = self.parse_code(l)[0].body[0]
                        elif type(n) is ast.While or type(n) is ast.For:
                            l = front + "function" + expr.id + "()" + tail
                            newLine = l

                            l = l.strip()
                            l += "\n\tpass"
                            newN = self.parse_code(l, lineno)[0]
                            newN.body = n.body
                            n = newN
                        elif type(n) is ast.If:
                            l = front + "function" + expr.id + "() " + tail
                            newLine = l

                            l = l.strip()
                            l += "\n\tpass"
                            for k in range(j + 1, len(inds)):

                                if self.visitor.tracked[inds[k]].offset > expr.offset:
                                    self.visitor.tracked[inds[k]].offset += len(
                                        "function" + expr.id + "() ") - len(
                                        expr.name)

                            newN = self.parse_code(l, lineno)[0]
                            newN.body = n.body
                            n = newN
                        else:
                            print("ELSE: ",newLine)
                            l = front + "function" + expr.id + "() " + tail
                            newLine = l
                            print("ELSE AFTER: ",newLine)

                            l = l.strip()
                            for k in range(j + 1, len(inds)):
                                if self.visitor.tracked[k].offset > expr.offset:
                                    self.visitor.tracked[k].offset += len(
                                        "function" + expr.id + "() ") - len(expr.name)


                            n = self.parse_code(l, lineno)[0]

                    else:
                        print("IN INVALID")
                        print(expr)
                        print(ast.dump(n))
                        nodes = self.generate_tab_nodes(lineno)
                        curAttrs.update({expr.name:"\"INVALID EXPRESSION\""})
                        headNodes = self.create_opening_nodes("expression", lineno, curAttrs, False, False)
                        footNodes = self.create_closing_nodes("expression", lineno, False)
                        body  = list(np.concatenate((body, nodes)))
                        body  = list(np.concatenate((body, headNodes)))
                        body = list(np.concatenate((body, footNodes)))

                expr.offset = original_offset

        print("appended")
        if append:
            body.append(n)
        if afterbody is not None and len(afterbody ) >0:
            body = list(np.concatenate((body,afterbody)))
        return body,n

    # function that generates the ast nodes to that will
    # properly indent the JSON file
    def generate_tab_nodes(self,lineno,globals=False):
        nodes = []
        if globals:
            n = ast.Global(names=[self.id + "Tabs"])
            n.lineno = lineno
            nodes.append(n)

            n = ast.Global(names=[self.id + "curID"])
            n.lineno = lineno
            nodes.append(n)

        f = open("Anteater/Tracer/helperText/tabs.txt","r")
        text = f.read()
        f.close()
        text = text.replace("REPLACE",self.id)

        nodes = list(np.concatenate((nodes,self.parse_code(text,lineno))))

        return nodes
