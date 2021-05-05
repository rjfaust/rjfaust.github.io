try:
    import numpy as f6ddc42e5cb6b46aa8588bb4df2ac68ccnp
    import json as f6ddc42e5cb6b46aa8588bb4df2ac68ccjson
    import time as f6ddc42e5cb6b46aa8588bb4df2ac68cctime
    import traceback as f6ddc42e5cb6b46aa8588bb4df2ac68cctraceback
    import os as f6ddc42e5cb6b46aa8588bb4df2ac68ccos
    import sys as f6ddc42e5cb6b46aa8588bb4df2ac68ccsys
    f6ddc42e5cb6b46aa8588bb4df2ac68cctoStr = str
    f6ddc42e5cb6b46aa8588bb4df2ac68cctype = type
    f6ddc42e5cb6b46aa8588bb4df2ac68cclist = list
    f6ddc42e5cb6b46aa8588bb4df2ac68ccdict = dict
    f6ddc42e5cb6b46aa8588bb4df2ac68cctuple = tuple
    f6ddc42e5cb6b46aa8588bb4df2ac68ccint = int
    f6ddc42e5cb6b46aa8588bb4df2ac68ccfloat = float
    f6ddc42e5cb6b46aa8588bb4df2ac68cclen = len
    print('CWD', f6ddc42e5cb6b46aa8588bb4df2ac68ccos.getcwd())
    f6ddc42e5cb6b46aa8588bb4df2ac68cc = open('test_trace.trace', 'w')

    def f6ddc42e5cb6b46aa8588bb4df2ac68ccfuncstr(obj):
        try:
            if f6ddc42e5cb6b46aa8588bb4df2ac68cctype(obj
                ) is f6ddc42e5cb6b46aa8588bb4df2ac68cclist:
                return '"Unsupported"'
            elif f6ddc42e5cb6b46aa8588bb4df2ac68cctype(obj
                ) is f6ddc42e5cb6b46aa8588bb4df2ac68ccnp.ndarray:
                return '"Unsupported"'
            elif f6ddc42e5cb6b46aa8588bb4df2ac68cctype(obj
                ) is f6ddc42e5cb6b46aa8588bb4df2ac68ccdict:
                return '"Unsupported"'
            elif f6ddc42e5cb6b46aa8588bb4df2ac68cctype(obj
                ) is f6ddc42e5cb6b46aa8588bb4df2ac68cctoStr:
                return f6ddc42e5cb6b46aa8588bb4df2ac68ccjson.dumps(obj)
            elif f6ddc42e5cb6b46aa8588bb4df2ac68cctype(obj
                ) is f6ddc42e5cb6b46aa8588bb4df2ac68cctuple:
                return '"Unsupported"'
            elif f6ddc42e5cb6b46aa8588bb4df2ac68cctype(obj
                ) is f6ddc42e5cb6b46aa8588bb4df2ac68ccfloat and not f6ddc42e5cb6b46aa8588bb4df2ac68ccnp.isnan(
                obj) and not f6ddc42e5cb6b46aa8588bb4df2ac68ccnp.isinf(obj
                ) or f6ddc42e5cb6b46aa8588bb4df2ac68cctype(obj
                ) is f6ddc42e5cb6b46aa8588bb4df2ac68ccint or f6ddc42e5cb6b46aa8588bb4df2ac68cctype(
                obj) is complex or f6ddc42e5cb6b46aa8588bb4df2ac68cctype(obj
                ) is f6ddc42e5cb6b46aa8588bb4df2ac68ccnp.float64 or f6ddc42e5cb6b46aa8588bb4df2ac68cctype(
                obj) is f6ddc42e5cb6b46aa8588bb4df2ac68ccnp.int64:
                return f6ddc42e5cb6b46aa8588bb4df2ac68cctoStr(obj)
            elif f6ddc42e5cb6b46aa8588bb4df2ac68cctype(obj
                ) is float and f6ddc42e5cb6b46aa8588bb4df2ac68ccnp.isnan(obj):
                return '"nan"'
            elif f6ddc42e5cb6b46aa8588bb4df2ac68cctype(obj
                ) is float and f6ddc42e5cb6b46aa8588bb4df2ac68ccnp.isinf(obj):
                return '"inf"'
            else:
                return '"' + f6ddc42e5cb6b46aa8588bb4df2ac68cctoStr(obj) + '"'
        except:
            return '"INVALID"'
    f6ddc42e5cb6b46aa8588bb4df2ac68ccsys.path[0
        ] = f6ddc42e5cb6b46aa8588bb4df2ac68ccos.path.dirname(
        f6ddc42e5cb6b46aa8588bb4df2ac68ccos.path.realpath(
        f6ddc42e5cb6b46aa8588bb4df2ac68ccsys.argv[0]))
    f6ddc42e5cb6b46aa8588bb4df2ac68ccos.chdir(
        f6ddc42e5cb6b46aa8588bb4df2ac68ccos.path.dirname(
        f6ddc42e5cb6b46aa8588bb4df2ac68ccos.path.realpath(
        f6ddc42e5cb6b46aa8588bb4df2ac68ccsys.argv[0])))
    print('CWD', f6ddc42e5cb6b46aa8588bb4df2ac68ccos.getcwd())
    f6ddc42e5cb6b46aa8588bb4df2ac68ccstartTime = (
        f6ddc42e5cb6b46aa8588bb4df2ac68cctime.time())
    f6ddc42e5cb6b46aa8588bb4df2ac68ccTabs = 1
    f6ddc42e5cb6b46aa8588bb4df2ac68ccclosingStack = [']']
    f6ddc42e5cb6b46aa8588bb4df2ac68cccurID = 0
    f6ddc42e5cb6b46aa8588bb4df2ac68ccblockStack = [0]
    f6ddc42e5cb6b46aa8588bb4df2ac68cc.write('{\n\t "trace":[\n')

    def test():
        global f6ddc42e5cb6b46aa8588bb4df2ac68ccTabs
        global f6ddc42e5cb6b46aa8588bb4df2ac68cccurID
        f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr = ''
        for f6ddc42e5cb6b46aa8588bb4df2ac68cci in range(
            f6ddc42e5cb6b46aa8588bb4df2ac68ccTabs):
            f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr += '\t'
        f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr = ''
        for f6ddc42e5cb6b46aa8588bb4df2ac68cci in range(
            f6ddc42e5cb6b46aa8588bb4df2ac68ccTabs):
            f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr += '\t'
        iters = 5
        f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr = ''
        for f6ddc42e5cb6b46aa8588bb4df2ac68cci in range(
            f6ddc42e5cb6b46aa8588bb4df2ac68ccTabs):
            f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr += '\t'
        val = 6
        f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr = ''
        for f6ddc42e5cb6b46aa8588bb4df2ac68cci in range(
            f6ddc42e5cb6b46aa8588bb4df2ac68ccTabs):
            f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr += '\t'
        output = 1
        f6ddc42e5cb6b46aa8588bb4df2ac68cccurTime = (
            f6ddc42e5cb6b46aa8588bb4df2ac68cctime.time() -
            f6ddc42e5cb6b46aa8588bb4df2ac68ccstartTime)
        f6ddc42e5cb6b46aa8588bb4df2ac68cccurID += 1
        f6ddc42e5cb6b46aa8588bb4df2ac68ccstr = f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr + '{\n' + f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr + """	"type":"assign",
"""
        f6ddc42e5cb6b46aa8588bb4df2ac68ccclosingStack.append('}')
        f6ddc42e5cb6b46aa8588bb4df2ac68ccstr += (
            f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr + '\t"lineno": 4,\n')
        f6ddc42e5cb6b46aa8588bb4df2ac68ccstr += (
            f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr + '\t"timestamp": ' +
            f6ddc42e5cb6b46aa8588bb4df2ac68cctoStr(
            f6ddc42e5cb6b46aa8588bb4df2ac68cccurTime) + ',\n')
        f6ddc42e5cb6b46aa8588bb4df2ac68ccstr += (
            f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr + '\t"id": ' +
            f6ddc42e5cb6b46aa8588bb4df2ac68cctoStr(
            f6ddc42e5cb6b46aa8588bb4df2ac68cccurID) + ',\n')
        f6ddc42e5cb6b46aa8588bb4df2ac68ccparent = (
            f6ddc42e5cb6b46aa8588bb4df2ac68ccblockStack[-1])
        f6ddc42e5cb6b46aa8588bb4df2ac68ccstr += (
            f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr + '\t"parentBlockID": ' +
            f6ddc42e5cb6b46aa8588bb4df2ac68cctoStr(
            f6ddc42e5cb6b46aa8588bb4df2ac68ccparent) + ',\n')
        f6ddc42e5cb6b46aa8588bb4df2ac68ccstr += (
            f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr + '\t"name":')
        f6ddc42e5cb6b46aa8588bb4df2ac68ccstr += (
            f6ddc42e5cb6b46aa8588bb4df2ac68ccfuncstr('output') + ',\n')
        f6ddc42e5cb6b46aa8588bb4df2ac68ccstr += (
            f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr + '\t"output":')
        f6ddc42e5cb6b46aa8588bb4df2ac68ccstr += (
            f6ddc42e5cb6b46aa8588bb4df2ac68ccfuncstr(output) + ',\n')
        f6ddc42e5cb6b46aa8588bb4df2ac68ccstr += 'DELETE\n'
        f6ddc42e5cb6b46aa8588bb4df2ac68cc.write(
            f6ddc42e5cb6b46aa8588bb4df2ac68ccstr)
        f6ddc42e5cb6b46aa8588bb4df2ac68ccTabs += 1
        f6ddc42e5cb6b46aa8588bb4df2ac68ccTabs -= 1
        f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr = ''
        for f6ddc42e5cb6b46aa8588bb4df2ac68cci in range(
            f6ddc42e5cb6b46aa8588bb4df2ac68ccTabs):
            f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr += '\t'
        f6ddc42e5cb6b46aa8588bb4df2ac68ccstr = 'DELETE\n'
        f6ddc42e5cb6b46aa8588bb4df2ac68ccstr += (
            f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr + '},\n')
        f6ddc42e5cb6b46aa8588bb4df2ac68ccclosingStack.pop()
        f6ddc42e5cb6b46aa8588bb4df2ac68cc.write(
            f6ddc42e5cb6b46aa8588bb4df2ac68ccstr)
        f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr = ''
        for f6ddc42e5cb6b46aa8588bb4df2ac68cci in range(
            f6ddc42e5cb6b46aa8588bb4df2ac68ccTabs):
            f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr += '\t'
        f6ddc42e5cb6b46aa8588bb4df2ac68cccurTime = (
            f6ddc42e5cb6b46aa8588bb4df2ac68cctime.time() -
            f6ddc42e5cb6b46aa8588bb4df2ac68ccstartTime)
        f6ddc42e5cb6b46aa8588bb4df2ac68cccurID += 1
        f6ddc42e5cb6b46aa8588bb4df2ac68ccstr = (
            f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr + '{\n' +
            f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr + '\t"type":"for",\n')
        f6ddc42e5cb6b46aa8588bb4df2ac68ccclosingStack.append('}')
        f6ddc42e5cb6b46aa8588bb4df2ac68ccstr += (
            f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr + '\t"lineno": 5,\n')
        f6ddc42e5cb6b46aa8588bb4df2ac68ccstr += (
            f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr + '\t"timestamp": ' +
            f6ddc42e5cb6b46aa8588bb4df2ac68cctoStr(
            f6ddc42e5cb6b46aa8588bb4df2ac68cccurTime) + ',\n')
        f6ddc42e5cb6b46aa8588bb4df2ac68ccstr += (
            f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr + '\t"id": ' +
            f6ddc42e5cb6b46aa8588bb4df2ac68cctoStr(
            f6ddc42e5cb6b46aa8588bb4df2ac68cccurID) + ',\n')
        f6ddc42e5cb6b46aa8588bb4df2ac68ccparent = (
            f6ddc42e5cb6b46aa8588bb4df2ac68ccblockStack[-1])
        f6ddc42e5cb6b46aa8588bb4df2ac68ccstr += (
            f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr + '\t"parentBlockID": ' +
            f6ddc42e5cb6b46aa8588bb4df2ac68cctoStr(
            f6ddc42e5cb6b46aa8588bb4df2ac68ccparent) + ',\n')
        f6ddc42e5cb6b46aa8588bb4df2ac68ccstr += (
            f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr + '\t"target":')
        f6ddc42e5cb6b46aa8588bb4df2ac68ccstr += (
            f6ddc42e5cb6b46aa8588bb4df2ac68ccfuncstr('iter') + ',\n')
        f6ddc42e5cb6b46aa8588bb4df2ac68ccstr += (
            f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr + '\t"body":[\n')
        f6ddc42e5cb6b46aa8588bb4df2ac68ccclosingStack.append(']')
        f6ddc42e5cb6b46aa8588bb4df2ac68ccblockStack.append(
            f6ddc42e5cb6b46aa8588bb4df2ac68cccurID)
        f6ddc42e5cb6b46aa8588bb4df2ac68cc.write(
            f6ddc42e5cb6b46aa8588bb4df2ac68ccstr)
        f6ddc42e5cb6b46aa8588bb4df2ac68ccTabs += 1
        fe284010a452c4af3983356ef10ace33eind = 0
        for iter in range(iters):
            fe284010a452c4af3983356ef10ace33eind += 1
            f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr = ''
            for f6ddc42e5cb6b46aa8588bb4df2ac68cci in range(
                f6ddc42e5cb6b46aa8588bb4df2ac68ccTabs):
                f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr += '\t'
            output /= val
            f6ddc42e5cb6b46aa8588bb4df2ac68cccurTime = (
                f6ddc42e5cb6b46aa8588bb4df2ac68cctime.time() -
                f6ddc42e5cb6b46aa8588bb4df2ac68ccstartTime)
            f6ddc42e5cb6b46aa8588bb4df2ac68cccurID += 1
            f6ddc42e5cb6b46aa8588bb4df2ac68ccstr = f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr + '{\n' + f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr + """	"type":"assign",
"""
            f6ddc42e5cb6b46aa8588bb4df2ac68ccclosingStack.append('}')
            f6ddc42e5cb6b46aa8588bb4df2ac68ccstr += (
                f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr + '\t"lineno": 6,\n')
            f6ddc42e5cb6b46aa8588bb4df2ac68ccstr += (
                f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr + '\t"timestamp": ' +
                f6ddc42e5cb6b46aa8588bb4df2ac68cctoStr(
                f6ddc42e5cb6b46aa8588bb4df2ac68cccurTime) + ',\n')
            f6ddc42e5cb6b46aa8588bb4df2ac68ccstr += (
                f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr + '\t"id": ' +
                f6ddc42e5cb6b46aa8588bb4df2ac68cctoStr(
                f6ddc42e5cb6b46aa8588bb4df2ac68cccurID) + ',\n')
            f6ddc42e5cb6b46aa8588bb4df2ac68ccparent = (
                f6ddc42e5cb6b46aa8588bb4df2ac68ccblockStack[-1])
            f6ddc42e5cb6b46aa8588bb4df2ac68ccstr += (
                f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr +
                '\t"parentBlockID": ' +
                f6ddc42e5cb6b46aa8588bb4df2ac68cctoStr(
                f6ddc42e5cb6b46aa8588bb4df2ac68ccparent) + ',\n')
            f6ddc42e5cb6b46aa8588bb4df2ac68ccstr += (
                f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr + '\t"targetVal":')
            f6ddc42e5cb6b46aa8588bb4df2ac68ccstr += (
                f6ddc42e5cb6b46aa8588bb4df2ac68ccfuncstr(
                f6ddc42e5cb6b46aa8588bb4df2ac68cctoStr(iter)) + ',\n')
            f6ddc42e5cb6b46aa8588bb4df2ac68ccstr += (
                f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr + '\t"iteration":')
            f6ddc42e5cb6b46aa8588bb4df2ac68ccstr += (
                f6ddc42e5cb6b46aa8588bb4df2ac68ccfuncstr(
                fe284010a452c4af3983356ef10ace33eind) + ',\n')
            f6ddc42e5cb6b46aa8588bb4df2ac68ccstr += (
                f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr + '\t"name":')
            f6ddc42e5cb6b46aa8588bb4df2ac68ccstr += (
                f6ddc42e5cb6b46aa8588bb4df2ac68ccfuncstr('output') + ',\n')
            f6ddc42e5cb6b46aa8588bb4df2ac68ccstr += (
                f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr + '\t"output":')
            f6ddc42e5cb6b46aa8588bb4df2ac68ccstr += (
                f6ddc42e5cb6b46aa8588bb4df2ac68ccfuncstr(output) + ',\n')
            f6ddc42e5cb6b46aa8588bb4df2ac68ccstr += 'DELETE\n'
            f6ddc42e5cb6b46aa8588bb4df2ac68cc.write(
                f6ddc42e5cb6b46aa8588bb4df2ac68ccstr)
            f6ddc42e5cb6b46aa8588bb4df2ac68ccTabs += 1
            f6ddc42e5cb6b46aa8588bb4df2ac68ccTabs -= 1
            f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr = ''
            for f6ddc42e5cb6b46aa8588bb4df2ac68cci in range(
                f6ddc42e5cb6b46aa8588bb4df2ac68ccTabs):
                f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr += '\t'
            f6ddc42e5cb6b46aa8588bb4df2ac68ccstr = 'DELETE\n'
            f6ddc42e5cb6b46aa8588bb4df2ac68ccstr += (
                f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr + '},\n')
            f6ddc42e5cb6b46aa8588bb4df2ac68ccclosingStack.pop()
            f6ddc42e5cb6b46aa8588bb4df2ac68cc.write(
                f6ddc42e5cb6b46aa8588bb4df2ac68ccstr)
        f6ddc42e5cb6b46aa8588bb4df2ac68ccblockStack.pop(-1)
        f6ddc42e5cb6b46aa8588bb4df2ac68ccTabs -= 1
        f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr = ''
        for f6ddc42e5cb6b46aa8588bb4df2ac68cci in range(
            f6ddc42e5cb6b46aa8588bb4df2ac68ccTabs):
            f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr += '\t'
        f6ddc42e5cb6b46aa8588bb4df2ac68ccstr = 'DELETE\n'
        f6ddc42e5cb6b46aa8588bb4df2ac68ccstr += (
            f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr + '\t]\n')
        f6ddc42e5cb6b46aa8588bb4df2ac68ccclosingStack.pop()
        f6ddc42e5cb6b46aa8588bb4df2ac68ccstr += (
            f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr + '},\n')
        f6ddc42e5cb6b46aa8588bb4df2ac68ccclosingStack.pop()
        f6ddc42e5cb6b46aa8588bb4df2ac68cc.write(
            f6ddc42e5cb6b46aa8588bb4df2ac68ccstr)
    if __name__ == '__main__':
        f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr = ''
        for f6ddc42e5cb6b46aa8588bb4df2ac68cci in range(
            f6ddc42e5cb6b46aa8588bb4df2ac68ccTabs):
            f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr += '\t'
        f6ddc42e5cb6b46aa8588bb4df2ac68cccurTime = (
            f6ddc42e5cb6b46aa8588bb4df2ac68cctime.time() -
            f6ddc42e5cb6b46aa8588bb4df2ac68ccstartTime)
        f6ddc42e5cb6b46aa8588bb4df2ac68cccurID += 1
        f6ddc42e5cb6b46aa8588bb4df2ac68ccstr = f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr + '{\n' + f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr + """	"type":"call",
"""
        f6ddc42e5cb6b46aa8588bb4df2ac68ccclosingStack.append('}')
        f6ddc42e5cb6b46aa8588bb4df2ac68ccstr += (
            f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr + '\t"lineno": 9,\n')
        f6ddc42e5cb6b46aa8588bb4df2ac68ccstr += (
            f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr + '\t"timestamp": ' +
            f6ddc42e5cb6b46aa8588bb4df2ac68cctoStr(
            f6ddc42e5cb6b46aa8588bb4df2ac68cccurTime) + ',\n')
        f6ddc42e5cb6b46aa8588bb4df2ac68ccstr += (
            f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr + '\t"id": ' +
            f6ddc42e5cb6b46aa8588bb4df2ac68cctoStr(
            f6ddc42e5cb6b46aa8588bb4df2ac68cccurID) + ',\n')
        f6ddc42e5cb6b46aa8588bb4df2ac68ccparent = (
            f6ddc42e5cb6b46aa8588bb4df2ac68ccblockStack[-1])
        f6ddc42e5cb6b46aa8588bb4df2ac68ccstr += (
            f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr + '\t"parentBlockID": ' +
            f6ddc42e5cb6b46aa8588bb4df2ac68cctoStr(
            f6ddc42e5cb6b46aa8588bb4df2ac68ccparent) + ',\n')
        f6ddc42e5cb6b46aa8588bb4df2ac68ccstr += (
            f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr + '\t"func_name":')
        f6ddc42e5cb6b46aa8588bb4df2ac68ccstr += (
            f6ddc42e5cb6b46aa8588bb4df2ac68ccfuncstr('test') + ',\n')
        f6ddc42e5cb6b46aa8588bb4df2ac68ccstr += (
            f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr + '\t"body":[\n')
        f6ddc42e5cb6b46aa8588bb4df2ac68ccclosingStack.append(']')
        f6ddc42e5cb6b46aa8588bb4df2ac68ccblockStack.append(
            f6ddc42e5cb6b46aa8588bb4df2ac68cccurID)
        f6ddc42e5cb6b46aa8588bb4df2ac68cc.write(
            f6ddc42e5cb6b46aa8588bb4df2ac68ccstr)
        f6ddc42e5cb6b46aa8588bb4df2ac68ccTabs += 1
        test()
        f6ddc42e5cb6b46aa8588bb4df2ac68ccblockStack.pop(-1)
        f6ddc42e5cb6b46aa8588bb4df2ac68ccTabs -= 1
        f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr = ''
        for f6ddc42e5cb6b46aa8588bb4df2ac68cci in range(
            f6ddc42e5cb6b46aa8588bb4df2ac68ccTabs):
            f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr += '\t'
        f6ddc42e5cb6b46aa8588bb4df2ac68ccstr = 'DELETE\n'
        f6ddc42e5cb6b46aa8588bb4df2ac68ccstr += (
            f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr + '\t]\n')
        f6ddc42e5cb6b46aa8588bb4df2ac68ccclosingStack.pop()
        f6ddc42e5cb6b46aa8588bb4df2ac68ccstr += (
            f6ddc42e5cb6b46aa8588bb4df2ac68cctabstr + '},\n')
        f6ddc42e5cb6b46aa8588bb4df2ac68ccclosingStack.pop()
        f6ddc42e5cb6b46aa8588bb4df2ac68cc.write(
            f6ddc42e5cb6b46aa8588bb4df2ac68ccstr)
    f6ddc42e5cb6b46aa8588bb4df2ac68cc.write('DELETE\n\t]\n}\n')
    f6ddc42e5cb6b46aa8588bb4df2ac68cc.close()
except:
    f6ddc42e5cb6b46aa8588bb4df2ac68cc.write('DELETE')
    while f6ddc42e5cb6b46aa8588bb4df2ac68cclen(
        f6ddc42e5cb6b46aa8588bb4df2ac68ccclosingStack) > 0:
        f6ddc42e5cb6b46aa8588bb4df2ac68cc.write(
            f6ddc42e5cb6b46aa8588bb4df2ac68ccclosingStack.pop() + '\n')
    f6ddc42e5cb6b46aa8588bb4df2ac68ccerrors = (
        f6ddc42e5cb6b46aa8588bb4df2ac68cctraceback.format_exc())
    f6ddc42e5cb6b46aa8588bb4df2ac68ccerrors = (
        f6ddc42e5cb6b46aa8588bb4df2ac68ccerrors.replace('"', '\\"'))
    f6ddc42e5cb6b46aa8588bb4df2ac68cclines = (
        f6ddc42e5cb6b46aa8588bb4df2ac68ccerrors.split('\n'))
    f6ddc42e5cb6b46aa8588bb4df2ac68ccerrors = ''
    for f6ddc42e5cb6b46aa8588bb4df2ac68ccline in f6ddc42e5cb6b46aa8588bb4df2ac68cclines:
        f6ddc42e5cb6b46aa8588bb4df2ac68ccerrors += (
            f6ddc42e5cb6b46aa8588bb4df2ac68cctoStr(
            f6ddc42e5cb6b46aa8588bb4df2ac68ccline) + '\\n')
    f6ddc42e5cb6b46aa8588bb4df2ac68cc.write(',\n\t"error":"' +
        f6ddc42e5cb6b46aa8588bb4df2ac68cctoStr(
        f6ddc42e5cb6b46aa8588bb4df2ac68ccerrors) + '"}\n')
    f6ddc42e5cb6b46aa8588bb4df2ac68cc.close()
