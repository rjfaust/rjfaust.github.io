try:
    print("starting")
    import numpy as f92b9c372fb344e64a1463011125895e7np
    import json as f92b9c372fb344e64a1463011125895e7json
    import time as f92b9c372fb344e64a1463011125895e7time
    import traceback as f92b9c372fb344e64a1463011125895e7traceback
    import os as f92b9c372fb344e64a1463011125895e7os
    import sys as f92b9c372fb344e64a1463011125895e7sys
    f92b9c372fb344e64a1463011125895e7toStr = str
    f92b9c372fb344e64a1463011125895e7type = type
    f92b9c372fb344e64a1463011125895e7list = list
    f92b9c372fb344e64a1463011125895e7dict = dict
    f92b9c372fb344e64a1463011125895e7tuple = tuple
    f92b9c372fb344e64a1463011125895e7int = int
    f92b9c372fb344e64a1463011125895e7float = float
    f92b9c372fb344e64a1463011125895e7len = len
    print('CWD', f92b9c372fb344e64a1463011125895e7os.getcwd())
    f92b9c372fb344e64a1463011125895e7 = open('test_trace.trace', 'w')

    def f92b9c372fb344e64a1463011125895e7funcstr(obj):
        try:
            if f92b9c372fb344e64a1463011125895e7type(obj
                ) is f92b9c372fb344e64a1463011125895e7list:
                return '"Unsupported"'
            elif f92b9c372fb344e64a1463011125895e7type(obj
                ) is f92b9c372fb344e64a1463011125895e7np.ndarray:
                return '"Unsupported"'
            elif f92b9c372fb344e64a1463011125895e7type(obj
                ) is f92b9c372fb344e64a1463011125895e7dict:
                return '"Unsupported"'
            elif f92b9c372fb344e64a1463011125895e7type(obj
                ) is f92b9c372fb344e64a1463011125895e7toStr:
                return f92b9c372fb344e64a1463011125895e7json.dumps(obj)
            elif f92b9c372fb344e64a1463011125895e7type(obj
                ) is f92b9c372fb344e64a1463011125895e7tuple:
                return '"Unsupported"'
            elif f92b9c372fb344e64a1463011125895e7type(obj
                ) is f92b9c372fb344e64a1463011125895e7float and not f92b9c372fb344e64a1463011125895e7np.isnan(
                obj) and not f92b9c372fb344e64a1463011125895e7np.isinf(obj
                ) or f92b9c372fb344e64a1463011125895e7type(obj
                ) is f92b9c372fb344e64a1463011125895e7int or f92b9c372fb344e64a1463011125895e7type(
                obj) is complex or f92b9c372fb344e64a1463011125895e7type(obj
                ) is f92b9c372fb344e64a1463011125895e7np.float64 or f92b9c372fb344e64a1463011125895e7type(
                obj) is f92b9c372fb344e64a1463011125895e7np.int64:
                return f92b9c372fb344e64a1463011125895e7toStr(obj)
            elif f92b9c372fb344e64a1463011125895e7type(obj
                ) is float and f92b9c372fb344e64a1463011125895e7np.isnan(obj):
                return '"nan"'
            elif f92b9c372fb344e64a1463011125895e7type(obj
                ) is float and f92b9c372fb344e64a1463011125895e7np.isinf(obj):
                return '"inf"'
            else:
                return '"' + f92b9c372fb344e64a1463011125895e7toStr(obj) + '"'
        except:
            return '"INVALID"'
    f92b9c372fb344e64a1463011125895e7sys.path[0
        ] = f92b9c372fb344e64a1463011125895e7os.path.dirname(
        f92b9c372fb344e64a1463011125895e7os.path.realpath(
        f92b9c372fb344e64a1463011125895e7sys.argv[0]))
    f92b9c372fb344e64a1463011125895e7os.chdir(
        f92b9c372fb344e64a1463011125895e7os.path.dirname(
        f92b9c372fb344e64a1463011125895e7os.path.realpath(
        f92b9c372fb344e64a1463011125895e7sys.argv[0])))
    print('CWD', f92b9c372fb344e64a1463011125895e7os.getcwd())
    f92b9c372fb344e64a1463011125895e7startTime = (
        f92b9c372fb344e64a1463011125895e7time.time())
    f92b9c372fb344e64a1463011125895e7Tabs = 1
    f92b9c372fb344e64a1463011125895e7closingStack = [']']
    f92b9c372fb344e64a1463011125895e7curID = 0
    f92b9c372fb344e64a1463011125895e7blockStack = [0]
    f92b9c372fb344e64a1463011125895e7.write('{\n\t "trace":[\n')

    def test():
        global f92b9c372fb344e64a1463011125895e7Tabs
        global f92b9c372fb344e64a1463011125895e7curID
        f92b9c372fb344e64a1463011125895e7tabstr = ''
        for f92b9c372fb344e64a1463011125895e7i in range(
            f92b9c372fb344e64a1463011125895e7Tabs):
            f92b9c372fb344e64a1463011125895e7tabstr += '\t'
        f92b9c372fb344e64a1463011125895e7tabstr = ''
        for f92b9c372fb344e64a1463011125895e7i in range(
            f92b9c372fb344e64a1463011125895e7Tabs):
            f92b9c372fb344e64a1463011125895e7tabstr += '\t'
        iters = 5
        f92b9c372fb344e64a1463011125895e7tabstr = ''
        for f92b9c372fb344e64a1463011125895e7i in range(
            f92b9c372fb344e64a1463011125895e7Tabs):
            f92b9c372fb344e64a1463011125895e7tabstr += '\t'
        val = 6
        f92b9c372fb344e64a1463011125895e7tabstr = ''
        for f92b9c372fb344e64a1463011125895e7i in range(
            f92b9c372fb344e64a1463011125895e7Tabs):
            f92b9c372fb344e64a1463011125895e7tabstr += '\t'
        output = 1
        f92b9c372fb344e64a1463011125895e7tabstr = ''
        for f92b9c372fb344e64a1463011125895e7i in range(
            f92b9c372fb344e64a1463011125895e7Tabs):
            f92b9c372fb344e64a1463011125895e7tabstr += '\t'
        f92b9c372fb344e64a1463011125895e7curTime = (
            f92b9c372fb344e64a1463011125895e7time.time() -
            f92b9c372fb344e64a1463011125895e7startTime)
        f92b9c372fb344e64a1463011125895e7curID += 1
        f92b9c372fb344e64a1463011125895e7str = (
            f92b9c372fb344e64a1463011125895e7tabstr + '{\n' +
            f92b9c372fb344e64a1463011125895e7tabstr + '\t"type":"for",\n')
        f92b9c372fb344e64a1463011125895e7closingStack.append('}')
        f92b9c372fb344e64a1463011125895e7str += (
            f92b9c372fb344e64a1463011125895e7tabstr + '\t"lineno": 5,\n')
        f92b9c372fb344e64a1463011125895e7str += (
            f92b9c372fb344e64a1463011125895e7tabstr + '\t"timestamp": ' +
            f92b9c372fb344e64a1463011125895e7toStr(
            f92b9c372fb344e64a1463011125895e7curTime) + ',\n')
        f92b9c372fb344e64a1463011125895e7str += (
            f92b9c372fb344e64a1463011125895e7tabstr + '\t"id": ' +
            f92b9c372fb344e64a1463011125895e7toStr(
            f92b9c372fb344e64a1463011125895e7curID) + ',\n')
        f92b9c372fb344e64a1463011125895e7parent = (
            f92b9c372fb344e64a1463011125895e7blockStack[-1])
        f92b9c372fb344e64a1463011125895e7str += (
            f92b9c372fb344e64a1463011125895e7tabstr + '\t"parentBlockID": ' +
            f92b9c372fb344e64a1463011125895e7toStr(
            f92b9c372fb344e64a1463011125895e7parent) + ',\n')
        f92b9c372fb344e64a1463011125895e7str += (
            f92b9c372fb344e64a1463011125895e7tabstr + '\t"target":')
        f92b9c372fb344e64a1463011125895e7str += (
            f92b9c372fb344e64a1463011125895e7funcstr('iter') + ',\n')
        f92b9c372fb344e64a1463011125895e7str += (
            f92b9c372fb344e64a1463011125895e7tabstr + '\t"body":[\n')
        f92b9c372fb344e64a1463011125895e7closingStack.append(']')
        f92b9c372fb344e64a1463011125895e7blockStack.append(
            f92b9c372fb344e64a1463011125895e7curID)
        f92b9c372fb344e64a1463011125895e7.write(
            f92b9c372fb344e64a1463011125895e7str)
        f92b9c372fb344e64a1463011125895e7Tabs += 1
        f6c1e39355744413891bc67384c96d538ind = 0
        for iter in range(iters):
            f6c1e39355744413891bc67384c96d538ind += 1
            f92b9c372fb344e64a1463011125895e7tabstr = ''
            for f92b9c372fb344e64a1463011125895e7i in range(
                f92b9c372fb344e64a1463011125895e7Tabs):
                f92b9c372fb344e64a1463011125895e7tabstr += '\t'
            output /= val
        f92b9c372fb344e64a1463011125895e7blockStack.pop(-1)
        f92b9c372fb344e64a1463011125895e7Tabs -= 1
        f92b9c372fb344e64a1463011125895e7tabstr = ''
        for f92b9c372fb344e64a1463011125895e7i in range(
            f92b9c372fb344e64a1463011125895e7Tabs):
            f92b9c372fb344e64a1463011125895e7tabstr += '\t'
        f92b9c372fb344e64a1463011125895e7str = 'DELETE\n'
        f92b9c372fb344e64a1463011125895e7str += (
            f92b9c372fb344e64a1463011125895e7tabstr + '\t]\n')
        f92b9c372fb344e64a1463011125895e7closingStack.pop()
        f92b9c372fb344e64a1463011125895e7str += (
            f92b9c372fb344e64a1463011125895e7tabstr + '},\n')
        f92b9c372fb344e64a1463011125895e7closingStack.pop()
        f92b9c372fb344e64a1463011125895e7.write(
            f92b9c372fb344e64a1463011125895e7str)
    if __name__ == '__main__':
        f92b9c372fb344e64a1463011125895e7tabstr = ''
        for f92b9c372fb344e64a1463011125895e7i in range(
            f92b9c372fb344e64a1463011125895e7Tabs):
            f92b9c372fb344e64a1463011125895e7tabstr += '\t'
        f92b9c372fb344e64a1463011125895e7curTime = (
            f92b9c372fb344e64a1463011125895e7time.time() -
            f92b9c372fb344e64a1463011125895e7startTime)
        f92b9c372fb344e64a1463011125895e7curID += 1
        f92b9c372fb344e64a1463011125895e7str = f92b9c372fb344e64a1463011125895e7tabstr + '{\n' + f92b9c372fb344e64a1463011125895e7tabstr + """	"type":"call",
"""
        f92b9c372fb344e64a1463011125895e7closingStack.append('}')
        f92b9c372fb344e64a1463011125895e7str += (
            f92b9c372fb344e64a1463011125895e7tabstr + '\t"lineno": 9,\n')
        f92b9c372fb344e64a1463011125895e7str += (
            f92b9c372fb344e64a1463011125895e7tabstr + '\t"timestamp": ' +
            f92b9c372fb344e64a1463011125895e7toStr(
            f92b9c372fb344e64a1463011125895e7curTime) + ',\n')
        f92b9c372fb344e64a1463011125895e7str += (
            f92b9c372fb344e64a1463011125895e7tabstr + '\t"id": ' +
            f92b9c372fb344e64a1463011125895e7toStr(
            f92b9c372fb344e64a1463011125895e7curID) + ',\n')
        f92b9c372fb344e64a1463011125895e7parent = (
            f92b9c372fb344e64a1463011125895e7blockStack[-1])
        f92b9c372fb344e64a1463011125895e7str += (
            f92b9c372fb344e64a1463011125895e7tabstr + '\t"parentBlockID": ' +
            f92b9c372fb344e64a1463011125895e7toStr(
            f92b9c372fb344e64a1463011125895e7parent) + ',\n')
        f92b9c372fb344e64a1463011125895e7str += (
            f92b9c372fb344e64a1463011125895e7tabstr + '\t"func_name":')
        f92b9c372fb344e64a1463011125895e7str += (
            f92b9c372fb344e64a1463011125895e7funcstr('test') + ',\n')
        f92b9c372fb344e64a1463011125895e7str += (
            f92b9c372fb344e64a1463011125895e7tabstr + '\t"body":[\n')
        f92b9c372fb344e64a1463011125895e7closingStack.append(']')
        f92b9c372fb344e64a1463011125895e7blockStack.append(
            f92b9c372fb344e64a1463011125895e7curID)
        f92b9c372fb344e64a1463011125895e7.write(
            f92b9c372fb344e64a1463011125895e7str)
        f92b9c372fb344e64a1463011125895e7Tabs += 1
        test()
        f92b9c372fb344e64a1463011125895e7blockStack.pop(-1)
        f92b9c372fb344e64a1463011125895e7Tabs -= 1
        f92b9c372fb344e64a1463011125895e7tabstr = ''
        for f92b9c372fb344e64a1463011125895e7i in range(
            f92b9c372fb344e64a1463011125895e7Tabs):
            f92b9c372fb344e64a1463011125895e7tabstr += '\t'
        f92b9c372fb344e64a1463011125895e7str = 'DELETE\n'
        f92b9c372fb344e64a1463011125895e7str += (
            f92b9c372fb344e64a1463011125895e7tabstr + '\t]\n')
        f92b9c372fb344e64a1463011125895e7closingStack.pop()
        f92b9c372fb344e64a1463011125895e7str += (
            f92b9c372fb344e64a1463011125895e7tabstr + '},\n')
        f92b9c372fb344e64a1463011125895e7closingStack.pop()
        f92b9c372fb344e64a1463011125895e7.write(
            f92b9c372fb344e64a1463011125895e7str)
    f92b9c372fb344e64a1463011125895e7.write('DELETE\n\t]\n}\n')
    f92b9c372fb344e64a1463011125895e7.close()
except:
    print("excepting")

    f92b9c372fb344e64a1463011125895e7.write('DELETE')
    while f92b9c372fb344e64a1463011125895e7len(
        f92b9c372fb344e64a1463011125895e7closingStack) > 0:
        f92b9c372fb344e64a1463011125895e7.write(
            f92b9c372fb344e64a1463011125895e7closingStack.pop() + '\n')
    f92b9c372fb344e64a1463011125895e7errors = (
        f92b9c372fb344e64a1463011125895e7traceback.format_exc())
    f92b9c372fb344e64a1463011125895e7errors = (
        f92b9c372fb344e64a1463011125895e7errors.replace('"', '\\"'))
    f92b9c372fb344e64a1463011125895e7lines = (
        f92b9c372fb344e64a1463011125895e7errors.split('\n'))
    f92b9c372fb344e64a1463011125895e7errors = ''
    for f92b9c372fb344e64a1463011125895e7line in f92b9c372fb344e64a1463011125895e7lines:
        f92b9c372fb344e64a1463011125895e7errors += (
            f92b9c372fb344e64a1463011125895e7toStr(
            f92b9c372fb344e64a1463011125895e7line) + '\\n')
    f92b9c372fb344e64a1463011125895e7.write(',\n\t"error":"' +
        f92b9c372fb344e64a1463011125895e7toStr(
        f92b9c372fb344e64a1463011125895e7errors) + '"}\n')
    f92b9c372fb344e64a1463011125895e7.close()
