def rewrite_helpers():
    closeFile = "REPLACE.write(\"DELETE\\n\\t]\\n}\\n\")\nREPLACE.close()"
    customFile = 'cExpREPLACE_I = ""\ntry:\n    cExpREPLACE_I = EXPR\nexcept:\n    cExpREPLACE_I = "Anteater:Expression_Error"'
    exceptionEndFile = 'REPLACE.write("DELETE")\nwhile REPLACElen(REPLACEclosingStack) > 0:\n    REPLACE.write(REPLACEclosingStack.pop() +"\\n")\nREPLACEerrors = REPLACEtraceback.format_exc()\nREPLACEerrors = REPLACEerrors.replace("\\"","\\\\\\"")\nREPLACElines = REPLACEerrors.split("\\n")\nREPLACEerrors = ""\nfor REPLACEline in REPLACElines:\n    REPLACEerrors+= REPLACEtoStr(REPLACEline) +"\\\\n"\nREPLACE.write(",\\n\\t\\"error\\":\\""+REPLACEtoStr(REPLACEerrors) + "\\"}\\n")\nREPLACE.close()'
    exprFuncFile = 'def functionREPLACE():\n    tempREPLACE = EXPR\n    return tempREPLACE\n'
    listCompToForFile = 'def REPLACEFUNC():\n    for REPLACEV in REPLACERANGE:\n        if REPLACEIF:\n            yield REPLACEEXPR'
    recordHeaderFile = 'REPLACEcurTime = REPLACEtime.time()-REPLACEstartTime\nREPLACEcurID+=1\n\nREPLACEstr = REPLACEtabstr + "{\\n" + REPLACEtabstr + "\\t\\"type\\":\\"RTYPE\\",\\n"\nREPLACEclosingStack.append("}")\nREPLACEstr += REPLACEtabstr + "\\t\\"lineno\\": REPLINENO,\\n"\nREPLACEstr += REPLACEtabstr + "\\t\\"timestamp\\": "+ REPLACEtoStr(REPLACEcurTime) +",\\n"\nREPLACEstr += REPLACEtabstr + "\\t\\"id\\": "+REPLACEtoStr(REPLACEcurID)+",\\n"\nREPLACEparent = REPLACEblockStack[-1]\nREPLACEstr += REPLACEtabstr + "\\t\\"parentBlockID\\": "+REPLACEtoStr(REPLACEparent)+",\\n"\n\n\n'
    tabsFile = 'REPLACEtabstr = ""\n\nfor REPLACEi in range(REPLACETabs):\n    REPLACEtabstr+="\\t"'
    transformedFileHeaderFile = '\nprint("starting")\nimport numpy as REPLACEnp\nimport json as REPLACEjson\nimport time as REPLACEtime\nimport traceback as REPLACEtraceback\nimport os as REPLACEos\nimport sys as REPLACEsys\n\nREPLACEtoStr = str\nREPLACEtype = type\nREPLACElist = list\nREPLACEdict = dict\nREPLACEtuple = tuple\nREPLACEint = int\nREPLACEfloat = float\nREPLACElen = len\n\nprint("CWD", REPLACEos.getcwd())\nREPLACE = open("TRACE_NAME","w")\n\ndef REPLACEfuncstr(obj):\n    try:\n        if REPLACEtype(obj) is REPLACElist:\n            # return REPLACEjson.dumps(obj)\n            return "\\"Unsupported\\""\n        elif REPLACEtype(obj) is REPLACEnp.ndarray:\n            # return REPLACEjson.dumps(obj.tolist())\n            return "\\"Unsupported\\""\n        elif REPLACEtype(obj) is REPLACEdict:\n            return "\\"Unsupported\\""\n            # REPLACEstringified = {}\n            # for REPLACEkey in obj.keys():\n            #     if REPLACEtype(obj[REPLACEkey]) is REPLACEnp.ndarray:\n            #         REPLACEstringified.update({REPLACEkey:obj[REPLACEkey].tolist()})\n            #     else:\n            #         REPLACEstringified.update({REPLACEtoStr(REPLACEkey):obj[REPLACEkey]})\n            # return REPLACEjson.dumps(REPLACEstringified)\n        elif REPLACEtype(obj) is REPLACEtoStr:\n            return REPLACEjson.dumps(obj)\n            #return "\\""+obj+"\\""\n        elif REPLACEtype(obj) is REPLACEtuple:\n            # return "\\""+REPLACEtoStr(obj)+"\\""\n            return "\\"Unsupported\\""\n        elif (REPLACEtype(obj) is REPLACEfloat and not REPLACEnp.isnan(obj) and not REPLACEnp.isinf(obj)) or \\\n            REPLACEtype(obj) is REPLACEint or REPLACEtype(obj) is complex or REPLACEtype(obj) is REPLACEnp.float64 \\\n             or   REPLACEtype(obj) is REPLACEnp.int64:\n            return REPLACEtoStr(obj)\n        elif REPLACEtype(obj) is float and REPLACEnp.isnan(obj):\n            return "\\"nan\\""\n        elif REPLACEtype(obj) is float and REPLACEnp.isinf(obj):\n            return "\\"inf\\""\n        else:\n            return "\\"" + REPLACEtoStr(obj) + "\\""\n    except:\n        return "\\"INVALID\\""\n\n\nREPLACEsys.path[0] = REPLACEos.path.dirname(REPLACEos.path.realpath(REPLACEsys.argv[0]))\nREPLACEos.chdir(REPLACEos.path.dirname(REPLACEos.path.realpath(REPLACEsys.argv[0])))\nprint("CWD", REPLACEos.getcwd())\nREPLACEstartTime = REPLACEtime.time()\nREPLACETabs = 1\nREPLACEclosingStack = ["]"]\nREPLACEcurID = 0\nREPLACEblockStack = [0]\n\nREPLACE.write("{\\n\\t \\"trace\\":[\\n")\n\n\n\n\n\n\n'

    print("writing")
    write(closeFile,"closeFile.txt")
    write(customFile,"custom.txt")
    write(exceptionEndFile,"exceptionEnd.txt")
    write(exprFuncFile,"exprFunc.txt")
    write(listCompToForFile,"listCompToFor.txt")
    write(recordHeaderFile,"RecordHeader.txt")
    write(tabsFile,"tabs.txt")
    write(transformedFileHeaderFile,"transformedFileHeader.txt")



def write(s, fname):
    f = open(fname,"w")
    f.write(s)
    f.close()


