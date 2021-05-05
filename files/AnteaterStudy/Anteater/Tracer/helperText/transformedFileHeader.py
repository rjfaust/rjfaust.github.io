
REPLACE = open("TRACE_NAME","w")
import numpy as REPLACEnp
import json as REPLACEjson
import time as REPLACEtime
import traceback as REPLACEtraceback
import os as REPLACEos
import sys as REPLACEsys

REPLACEtoStr = str
REPLACEtype = type
REPLACElist = list
REPLACEdict = dict
REPLACEtuple = tuple
REPLACEint = int
REPLACEfloat = float
REPLACElen = len


def REPLACEfuncstr(obj):
    try:
        if REPLACEtype(obj) is REPLACElist:
            # return REPLACEjson.dumps(obj)
            return "\"Unsupported\""
        elif REPLACEtype(obj) is REPLACEnp.ndarray:
            # return REPLACEjson.dumps(obj.tolist())
            return "\"Unsupported\""
        elif REPLACEtype(obj) is REPLACEdict:
            return "\"Unsupported\""
            # REPLACEstringified = {}
            # for REPLACEkey in obj.keys():
            #     if REPLACEtype(obj[REPLACEkey]) is REPLACEnp.ndarray:
            #         REPLACEstringified.update({REPLACEkey:obj[REPLACEkey].tolist()})
            #     else:
            #         REPLACEstringified.update({REPLACEtoStr(REPLACEkey):obj[REPLACEkey]})
            # return REPLACEjson.dumps(REPLACEstringified)
        elif REPLACEtype(obj) is REPLACEtoStr:
            return "\""+obj+"\""
        elif REPLACEtype(obj) is REPLACEtuple:
            # return "\""+REPLACEtoStr(obj)+"\""
            return "\"Unsupported\""
        elif (REPLACEtype(obj) is REPLACEfloat and not REPLACEnp.isnan(obj) and not REPLACEnp.isinf(obj)) or \
            REPLACEtype(obj) is REPLACEint or REPLACEtype(obj) is complex or REPLACEtype(obj) is REPLACEnp.float64 \
             or   REPLACEtype(obj) is REPLACEnp.int64:
            return REPLACEtoStr(obj)
        elif REPLACEtype(obj) is float and REPLACEnp.isnan(obj):
            return "\"nan\""
        elif REPLACEtype(obj) is float and REPLACEnp.isinf(obj):
            return "\"inf\""
        else:
            return "\"" + REPLACEtoStr(obj) + "\""
    except:
        return "\"INVALID\""


#REPLACEsys.path[0] = REPLACEos.path.dirname(REPLACEos.path.realpath(REPLACEsys.argv[0]))
#REPLACEos.chdir(REPLACEos.path.dirname(REPLACEos.path.realpath(REPLACEsys.argv[0])))

REPLACEstartTime = REPLACEtime.time()
REPLACETabs = 1
REPLACEclosingStack = []
REPLACEcurID = 1
REPLACEblockStack = [0]

REPLACE.write("{\n\t \"trace\":[\n")

try:
    pass
except:
    REPLACE.write("DELETE")
    while REPLACElen(REPLACEclosingStack) > 0:
        REPLACE.write(REPLACEclosingStack.pop() +"\n")
    REPLACEerrors = REPLACEtraceback.format_exc()
    REPLACEerrors = REPLACEerrors.replace("\"","\\\"")
    REPLACElines = REPLACEerrors.split("\n")
    REPLACEerrors = ""
    for REPLACEline in REPLACElines:
        REPLACEerrors += REPLACEtoStr(REPLACEline) + "\n"
    REPLACE.write(",\n\t\"error\":\""+REPLACEtoStr(REPLACEerrors) + "\"}\n")
    REPLACE.close()

REPLACEtabstr = "\t"
REPLACEcurTime = REPLACEtime.time()-REPLACEstartTime
REPLACEcurID+=1

REPLACEstr = REPLACEtabstr + "{\n" + REPLACEtabstr + "\t\"type\":\" RTYPE \",\n\""
REPLACEclosingStack.append("}")
REPLACEstr += REPLACEtabstr + "\t\"lineno\": REPLINENO,\n"
REPLACEstr += REPLACEtabstr + "\t\"timestampe\": "+ REPLACEtoStr(REPLACEcurTime) +",\n"
REPLACEstr += REPLACEtabstr + "\t\"id\": "+REPLACEtoStr(REPLACEcurID)+",\n"
REPLACEparent = REPLACEblockStack[-1]
REPLACEstr += REPLACEtabstr + "\t\"parentBlockID\": "+REPLACEtoStr(REPLACEparent)+",\n"



