import ast
import time
import datetime
import os
import sys
from io import StringIO

class Tracer:
    def __init__(self):
        self.tracked =[]
        self.variables = []
        self.expressionLines = []
        self.exclusions = []
        self.excludedFuncs = []
        self.excludedLibs = []

    def readFile(self,filename):
        self.filename = filename
        f = open(filename,'r')
        text =f.read()
        self.text =text
        return text

    def runTrace(self, filePrefix = None):
        if filePrefix is None:
            filePrefix = self.filename.replace(".py", "")
            date = str(datetime.datetime.fromtimestamp(time.time())).replace(" ", "_")
            filePrefix += date.split(".")[0]

        trimmedFname = filePrefix
        filePrefix = filePrefix.replace("\\", "/")
        # print(filePrefix)

        tObjs = self.tracked.copy()

        self.lines = self.text.split("\n")
        node = ast.parse(self.text)

        transf = CallTransformer(self.lines,self.tracked)
        node = transf.visit(node)
        self.extractedCalls = transf.extractedCalls
        self.extractedComprehensions = transf.expandedComprehensions
        self.head = node
        #
        # for t in self.tracked:
        #     if t.lineno in self.extractedCalls.keys():


        self.transformer = ProgramTransformer(filePrefix+".trace",tObjs, self.variables,
                                   self.expressionLines, self.exclusions, self.excludedFuncs, self.excludedLibs,
                                                          self.extractedCalls,self.extractedComprehensions, self.lines)


        ind = trimmedFname.find("/")
        while(ind >= 0):
            trimmedFname = trimmedFname[ind+1:]
            fs = trimmedFname.find("/")
            bs = trimmedFname.find("\\")
            if fs > bs:
                ind = fs
            else:
                ind = bs


        # self.transformer.setTrack()
        # self.transformer.fname = filePrefix+".trace"
        # print("NAME: ",transformer.fname)
        # self.direct = tempfile.TemporaryDirectory().name


        outputs = self.transformer.visit(self.head)

        ast.fix_missing_locations(outputs)

        f = open("alteredCodeTest.py", "w")

        f.write(astor.to_source(outputs))
        f.close()

        old_dir = os.getcwd()
        print("OLD DIR: ", old_dir)

        comp = compile(outputs, trimmedFname, mode='exec')

        d = {}
        d['__name__'] = '__main__'

        dir_path = os.path.dirname(os.path.realpath(self.filename))
        print("dir_path: ", dir_path)

        sys.argv = [dir_path+"/"+trimmedFname+".py"]

        old_stdout = sys.stdout
        sys.stdout = StringIO()

        exec(comp, d, d)
        self.output = sys.stdout.getvalue()
        os.chdir(old_dir)
        sys.stdout = old_stdout
        # print(self.output)
        self.cleanJson(self.transformer)


    def cleanJson(self, transf):

        f = open(transf.traceName, "r")
        text = f.read()
        text = text.replace("},\nDELETE", "}")
        text = text.replace(",\nDELETE", "")
        text = text.replace("DELETE\n", "")
        text = text.replace("DELETE", "")
        f.close()

        f = open(transf.traceName, "w")
        i = len(text) - 1
        token = text[i]
        while token != "}":
            i -= 1
            token = text[i]
        text = text[:i]

        text += ",\n"
        f.write(text)

        f.write("\t\"tracked\":[\n")
        n = len(self.tracked)
        i = 0
        for obj in self.tracked:
            s = "\t\t{\"name\":\"" + str(obj.name) +"\""
            if obj.var:
                s += ",\"instances\":["
                print(transf.helper.instances[obj.name])
                for inst in transf.helper.instances[obj.name]:
                    s += "{\"lineno\":" + str(inst[0]) + ", \"offset\":" + str(inst[1]) + "},"
                s = s[:-1]
                s += "]"

            else:
                s +=",\"instances\":[{\"lineno\":" + str(obj.lineno) + ", \"offset\":" + str(obj.offset) + "}]"
            s += ",\n\t\t\"custom\":["

            if obj.custom is not None and len(obj.custom)>0:
                for e in obj.custom:
                    s+="\"" +e.replace("\"","\\\"") + "\","
                s = s[:-1]
            s+="]"
            s += "}"

            f.write(s)
            if i < n - 1:
                f.write(",\n")
            else:
                f.write("\n")
            i += 1
        f.write("\t]\n}\n")

        f.close()


    def add_tracked(self,trackedObj):
        self.tracked.append(trackedObj)
        if trackedObj.var:
            self.variables.append(trackedObj.name)
        else:
            self.expressionLines.append(trackedObj.lineno)

    # def remove_tracked(self,trackedObj):

    def add_exclusion(self,exclusion):
        self.exclusions.append(exclusion)
        if exclusion.func:
            self.excludedFuncs.append(exclusion.name)
        else:
            self.excludedLibs.append(exclusion.name)
