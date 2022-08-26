import json
def convert(fname, varname):
    f = open(fname,"r")
    text = f.read()
    f.close()

    jsname = fname[:fname.rfind(".")]+".js"
    f = open(jsname, "w")
    f.write(varname + "=")
    f.write(json.dumps(text))

    f.close()



if __name__=="__main__":
    # convert("/Users/rjfaust/Documents/Repositories/Anteater_Pyodide/codeexplorer/Anteater/Tracer/exclusionObject.py", "tracerExclObj")
    # convert("/Users/rjfaust/Documents/Repositories/Anteater_Pyodide/codeexplorer/Anteater/Tracer/helpers.py", "tracerHelpers")
    # convert("/Users/rjfaust/Documents/Repositories/Anteater_Pyodide/codeexplorer/Anteater/Tracer/main.py", "tracerMain")
    # convert("/Users/rjfaust/Documents/Repositories/Anteater_Pyodide/codeexplorer/Anteater/Tracer/staticVisitor.py", "tracerStaticVis")
    # convert("/Users/rjfaust/Documents/Repositories/Anteater_Pyodide/codeexplorer/Anteater/Tracer/trackedObject.py", "tracerTrackedObj")
    # convert("/Users/rjfaust/Documents/Repositories/Anteater_Pyodide/codeexplorer/Anteater/Tracer/transformer.py", "tracerTransf")
    # convert("/Users/rjfaust/Documents/Repositories/Anteater_Pyodide/codeexplorer/Anteater/traceWrapper.py", "tracerWrap")
    # convert("/Users/rjfaust/Documents/Repositories/Anteater_Pyodide/codeexplorer/Anteater/pyodide/test2.py","prog")
    convert("/Users/rjfaust/Documents/Repositories/Anteater_Pyodide/codeexplorer/Anteater/Tracer/wholeTracer0.py", "tracerCode")
    # convert("/Users/rjfaust/Documents/Repositories/Anteater_Pyodide/codeexplorer/Anteater/pyodide/writeRewrite.py", "rewriteHelpers")
    # convert("/Users/rjfaust/Documents/Repositories/Anteater_Pyodide/codeexplorer/Anteater/pyodide/testTrace.py", "testTrace")



