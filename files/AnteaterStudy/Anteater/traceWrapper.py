variables = None
tracked = []

def initialize_tracer(fname):
    t = Tracer()

    lines = t.readFile(fname)
    return t, lines


def addObject(tracer, name, isVar, lineno, offset, containingFuncStr,custom):
    obj = TrackObject(name, isVar, lineno, offset, containingFuncStr,custom)
    tracked.append(obj)
    tracer.add_tracked(obj)


def findContainingFuncs(lineno,functions):
    funcs = list(functions.keys())
    ind = 0
    maxInd = len(funcs)
    currChoice = ""
    for i in range(maxInd):
        if (functions[funcs[i]]["start"] < lineno and functions[funcs[i]]["end"] > lineno):
            if currChoice == "":
                currChoice = funcs[i]
            else:
                if functions[funcs[currChoice]]["start"] < functions[funcs[i]]["start"] and functions[funcs[currChoice]]["end"] >= functions[funcs[i]]["end"]:
                        currChoice = currChoice+"_"+funcs[i]

    return currChoice


def addExclusion(tracer, name, isFunc, lineno, containingFuncStr):
    obj = ExclusionObject(name, isFunc, lineno, containingFuncStr)
    tracer.add_exclusion(obj)


def runTrace(fname, variables, expressions, funcExclusions, libExclusions, overview, outputFileName=None):
    import os
    print("CWD: ", os.getcwd())

    f = open(fname, "r")
    text = f.read()
    f.close()
    head = sv_generateHead(text)

    visitor = CallExtentVisitor(text.split("\n"))
    visitor.visit(head)
    functions = visitor.functions
    loops = visitor.loops

    visitor = DependencyVisitor()
    visitor.visit(head)
    dependencies = visitor.contributors
    # print(dependencies)

    # visitor = staticVisitor.JoinVisitor()
    # visitor.visit(head)


    t, lines = initialize_tracer("./" + fname)

    for v in variables:
        funcStr = findContainingFuncs(v["line"], functions)

        addObject(t, v["name"], True, v["line"], v["offset"], funcStr, v["custom_exprs"])

    for e in expressions:
        funcStr = findContainingFuncs(e["line"], functions)

        addObject(t, e["expr"], False, e["line"], e["offset"], funcStr, e["custom_exprs"])

    for f in funcExclusions:
        if f["name"] in functions:
            contStr = findContainingFuncs(functions[f["name"]]["start"]+1, functions)

            if contStr != "":
                contStr = contStr[:contStr.find(f["name"])]
        else:
            contStr = ""
        addExclusion(t, f["name"], True, f["line"], contStr)



    for f in libExclusions:
        if f["name"] in functions:
            contStr = findContainingFuncs(functions[f["name"]]["start"]+1, functions)
            contStr = contStr[:contStr.find(f["name"])]
        else:
            contStr = ""
        addExclusion(t, f["name"], False, f["line"], contStr)

    t.readFile(fname)
    t.runTrace(outputFileName)
    output = t.output
    lines = output.split("\n")
    output = ""
    for line in lines:
        output += line+"\\n"

    return outputFileName + ".trace", functions, dependencies, output, loops
