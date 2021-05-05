import ast

def createInfo(lineno):
    info={"start":lineno,
          "end":None}
    return  info

def sv_generateHead(source):
    return ast.parse(source)


def build_code_line(lines):

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

class CallExtentVisitor(ast.NodeVisitor):
    def __init__(self,source):
        self.functions = {}
        self.loops = {}
        self.source = source

    def visit(self,node):
        nodeType = type(node)
        if nodeType is ast.While:
            info = createInfo(node.lineno)

            endNode = self.get_last_child(node.body)

            info["end"] = endNode.lineno

            self.loops.update({"while-" + str(node.lineno): info})
        elif nodeType is ast.For:
            info = createInfo(node.lineno)
            endNode = self.get_last_child(node.body)

            info["end"] = endNode.lineno

            self.loops.update({"for-" + str(node.lineno): info})
        elif nodeType is ast.FunctionDef:
            info = createInfo(node.lineno)
            endNode = self.get_last_child(node.body)

            info["end"] = endNode.lineno

            self.functions.update({node.name: info})
        elif nodeType is ast.Assign and type(node.value)is ast.ListComp:
            info = createInfo(node.value.lineno)
            # endNode = self.get_last_child(node.body)

            lines = build_code_line(self.source[node.value.lineno - 1:])
            lines = lines.split("\n")

            info["end"] = node.value.lineno + len(lines)-1

            self.loops.update({"for-" + str(node.lineno): info})

        if hasattr(node,"body"):
            for n in node.body:
                self.visit(n)



    def get_last_child(self,body):
        lastNode = body[-1]
        while hasattr(lastNode,"body"):
            if type(lastNode) is ast.If and hasattr(lastNode,"orelse") and len(lastNode.orelse) >0:
                lastNode = lastNode.orelse[-1]
            else:
                lastNode = lastNode.body[-1]

        return lastNode



    def visit_While(self,node):
        for n in node.body:
            self.visit(n)
            print(ast.dump(n))

        info = createInfo(node.lineno)

        endNode = self.get_last_child(node.body)

        info["end"] =endNode.lineno

        self.loops.update({"while-"+str(node.lineno):info})

    def visit_For(self, node):
        for n in node.body:
            self.visit(n)
            print(ast.dump(n))

        info = createInfo(node.lineno)
        endNode = self.get_last_child(node.body)

        info["end"] = endNode.lineno

        self.loops.update({"for-"+str(node.lineno):info})


    def visit_Expr(self,node):
        print(ast.dump(node))
        if type(node.value) is ast.ListComp:
            print("HERE")
            info = createInfo(node.value.lineno)
            # endNode = self.get_last_child(node.body)

            lines = build_code_line(self.source[node.value.lineno-1:])
            lines = lines.split("\n")


            info["end"] =node.line + len(lines)

            self.loops.update({"for-" + str(node.lineno): info})

    def visit_FunctionDef(self,node):
        for n in node.body:
            self.visit(n)

        info = createInfo(node.lineno)
        endNode = self.get_last_child(node.body)

        info["end"] = endNode.lineno

        self.functions.update({node.name: info})


class DependencyVisitor(ast.NodeVisitor):
    def __init__(self):
        self.contributors = {}
        self.functionStack =[]

    def visit_FunctionDef(self, node):
        self.functionStack.append(node.name)
        for n in node.body:
            self.visit(n)
        self.functionStack.pop(-1)

    def visit_Assign(self, node):
        targets = node.targets
        val = node.value

        if len(self.functionStack) > 0:
            func = self.functionStack[-1]
        else:
            func = ""

        keys = []
        dependencies = []
        targType = type(targets[0])

        if targType is ast.Tuple:
            elements = targets[0].elts
            if type(val) is ast.Tuple:
                valElts = val.elts
                for i in range(len(elements)):
                    dep = self.parse_expr(valElts[i])

                    if type(elements[i]) is ast.Name:
                        keys.append(func + "_" + elements[i].id)
                        dependencies.append(dep)
                    else:
                        # print("UNHANDLED ASSIGNMENT: ", ast.dump(node))
                        pass
            elif type(val) is ast.Call:
                dep = self.parse_expr(val)
                for i in range(len(elements)):
                    keys.append(func + "_" + elements[i].id)
                    dependencies.append(dep)

        elif type(targets[0]) is ast.Name:
            deps = self.parse_expr(val)
            keys.append(func + "_" + targets[0].id)
            dependencies.append(deps)
            # self.contributors.update({func + "_" + targets[0].id: deps})
        else:
            # print("UNHANDLED ASSIGNMENT: ", ast.dump(node))
            pass
        for i, keyname in enumerate(keys):
            if keyname in self.contributors:
                for d in dependencies[i]:
                    self.contributors[keyname].append(d)
            else:
                self.contributors.update({keyname: dependencies[i]})

    def visit_AugAssign(self, node):
        target = node.target
        val = node.value
        if len(self.functionStack) > 0:
            func = self.functionStack[len(self.functionStack) - 1]
        else:
            func = ""

        keyname = None
        dependencies = []
        if type(target) is ast.Name:

            deps = self.parse_expr(val)

            keyname = func + "_" + target.id
            dependencies = deps
            dependencies.append(keyname)
        else:
            # print("UNHANDLED ASSIGNMENT: ", ast.dump(node))
            pass

        if keyname is not None:
            if keyname in self.contributors:
                for d in dependencies:
                    self.contributors[keyname].append(d)
            else:
                self.contributors.update({keyname: dependencies})

    def visit_Return(self, node):

        if len(self.functionStack) > 0:
            func = self.functionStack[len(self.functionStack) - 1]
        else:
            func = ""

        name = func + "_return"
        if node.value is not None:
            dependencies = self.parse_expr(node.value)
            self.contributors.update({name: dependencies})

    def parse_expr(self, expr):
        depends = []
        if len(self.functionStack) > 0:
            func = self.functionStack[- 1]
        else:
            func = ""
        if type(expr) is ast.BinOp:
            ldeps = self.parse_expr(expr.left)
            rdeps = self.parse_expr(expr.right)
            for d in ldeps:
                depends.append(d)
            for d in rdeps:
                depends.append(d)
        elif type(expr) is ast.Tuple:
            elts = expr.elts
            for e in elts:
                deps = self.parse_expr(e)
                for d in deps:
                    depends.append(d)

        elif type(expr) is ast.Name:
            depends.append(func + "_" + expr.id)
        elif type(expr) is ast.Call:

            if type(expr.func) is ast.Name:
                name = expr.func.id + str(expr.lineno)

            elif type(expr.func) is ast.Attribute:

                dep = self.parse_expr(expr.func.value)

                if len(dep) > 0:
                    ind = dep[0].find(func + "_")

                    if ind > -1 and ind < len(func) + 1:
                        dep[0] = dep[0].replace(func + "_", "")
                    name = dep[0] + "." + expr.func.attr + str(expr.lineno)
                else:
                    name = ""

            else:
                # print("UNHANDLED CALL: ", ast.dump(expr.func))
                # print("BROKE WITH LAMBDAS")
                name = ""
            args = expr.args

            depends.append(name)
            deps2 = []
            for arg in args:
                dep = self.parse_expr(arg)
                for d in dep:
                    deps2.append(d)

            if name in self.contributors:
                for d in deps2:
                    self.contributors[name].append(d)
            else:
                self.contributors.update({name: deps2})

        elif type(expr) is ast.Num:
            pass
        elif type(expr) is ast.Attribute:
            dep = self.parse_expr(expr.value)
            depends.append(dep[0] + "." + expr.attr)
        elif type(expr) is ast.Str:
            pass
            # Nothing needs to happen for hardcoded strings, no dependencies there
        elif type(expr) is ast.Subscript:
            # build subscript expression, make all indices dependencies
            name = ""
            curExpr = expr

            while type(curExpr.value) is ast.Subscript:
                n = "["
                if type(curExpr.slice.value) is ast.Name:
                    n += curExpr.slice.value.id
                elif type(curExpr.slice.value) is ast.Num:
                    n += str(curExpr.slice.value.n)
                elif type(curExpr.slice.value) is ast.Str:
                    n += curExpr.slice.value.s
                else:
                    # print("UNHANDLED INDEX TYPE")
                    pass
                n += "]"
                name = n + name
                curExpr = curExpr.value

            depends.append(func + "_" + name)
        else:
            # print("UNHANDLED: ", ast.dump(expr))
            pass
        return depends

class JoinVisitor(ast.NodeVisitor):

    def __init__(self):
        pass


class PathVisitor(ast.NodeVisitor):

    def __init__(self):
        pass




if __name__=="__main__":
    f = open("../../instance/uploads/broken/broken.py", "r")
    text = f.read()
    f.close()
    head = generateHead(text)

    visitor = CallExtentVisitor(text.split("\n"))
    visitor.visit(head)
    functions = visitor.functions
    loops = visitor.loops
