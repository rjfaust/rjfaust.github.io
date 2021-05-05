
from flask import (Blueprint, flash, g, redirect, render_template, request, session, url_for, jsonify)

from flask import current_app as app
import os
from Anteater.source import source_required
import Anteater.Tracer.staticVisitor as staticVisitor
import Anteater.traceWrapper as traceWrapper
import datetime, time
import json

bp = Blueprint('anteater', __name__, url_prefix='/anteater')

@bp.route('/index/<filename>', methods=('GET', 'POST'))
@source_required
def index(filename):
    print("HERE")
    if 'file' in request.files:
        file = request.files['file']
        if file.filename == '':
            error = 'No selected file'
            print(error)
            print(request.files)
        else:
            fname = file.filename

            traces = session["traces"]
            traces.append(fname)
            session["traces"] = traces


    fname = session.get("filepath")

    f = open(fname, "r")
    source = f.read()
    f.close()

    lines = source.split("\n")

    textStr = ""
    i = 0
    for line in lines:
        # if(i<90 and i > 75):
        #     print(line)
        #     print(line.replace("\\n","TEST"))
        line = line.replace("\\n","\\\\n")
        textStr += line+"\\n"
        #
        # if(i<90 and i > 75):
        #     print(line)

        i+=1

    if "rerun" in request.form:
        print("POSTED IN RERUN")

        source = json.loads(request.form["source"])
        lines = source.split("\n")
        textStr = ""
        for line in lines:
            textStr += line + "\\n"

        rerunTrace()

    #Do static analysis stuff here so we don't have to pass it around in the session (it gets too big)
    head = staticVisitor.generateHead(source)

    visitor = staticVisitor.CallExtentVisitor(source.split("\n"))
    visitor.visit(head)
    fInfo = visitor.functions
    lInfo = visitor.loops

    visitor = staticVisitor.DependencyVisitor()
    visitor.visit(head)
    deps = visitor.contributors

    g.source = textStr
    g.filename = filename
    traces = session.get("traces")

    if len(traces) > 0:
        tName = traces[len(traces)-1]
        trace = readTrace(tName)
        output = session["output"]
    else:
        trace = None
        fInfo = None
        lInfo = None
        deps = None
        output = None

    if request.method == 'POST':
        print("POSTING EXPLORE")
    print("pre-render")
    return render_template('home.html', traces=traces, trace=trace, fInfo=fInfo, lInfo=lInfo, depends=deps, output=output, test = json.dumps(session["test"]), testKey = json.dumps(session["testKey"]))

@bp.route('/test/',methods=('GET','POST'))
def test():

    if request.method == 'POST':
        print(request.form)
        filename = request.form["filename"]

        # create new folder for this specific project
        dirPath = "Anteater/static/Tests/"

        session.clear()
        os.path.dirname(os.path.abspath(__file__))
        session['filepath'] = os.path.join(dirPath, filename)

        session['filename'] = filename
        session["traces"] = [request.form["trace"]]
        session['output'] = ""
        session["funcInfos"] = []
        session["loopInfos"] = []
        session["depends"] = []
        session["test"] = True
        session["testKey"] = request.form["testKey"]


        return redirect(url_for('anteater.index', filename=filename))
    return render_template('test.html')


@bp.route('/index/', methods=('GET', 'POST'))
@source_required
def loadTrace():
    fname = request.form["fname"]

    trace = readTrace(fname)
    return jsonify({"trace": trace})


@bp.route('/index/upload', methods=('GET', 'POST'))
@source_required
def uploadTrace():

    error = None
    if 'file' not in request.files:
        error = 'No file selected'

    file = request.files['file']

    # if user does not select file, browser also
    # submit an empty part without filename
    if file.filename == '':
        error = 'No selected file'

    fname = file.filename

    traces = session["traces"]
    traces.append(fname)
    session["traces"] = traces
    trace = readTrace(fname)
    return jsonify({"trace": trace})

@bp.route('/index/log', methods=('GET', 'POST'))
@source_required
def writeLog():

    records = json.loads(request.form['records'])
    trace = request.form['trace']

    if trace.rfind("\\") > -1:
        logName = trace.rsplit("\\")[1]
    else:
        logName = trace

    logName = logName.split(".")[0]

    logPath = session["filepath"].rsplit("\\")[0]+"\\"+logName

    f = open(logPath+".log", "w")
    f.write("Action\t Object\t Description\n")

    for record in records:
        print(record)
        # f.write(json.dumps(record))
        f.write(str(record[0])+"\t" + str(record[1])+"\t" + str(record[2])+"\n")
    f.close()
    return "done"


@bp.route('/index/test', methods=('GET', 'POST'))
def runTest():

    print("Running test")
    if request.method == 'POST':
        # print("Post test")
        #
        # g.filename = request.form["filename"]
        # print("160 test")
        #
        # session["filepath"]="Tests/"+g.filename
        # print("163 test")
        #
        # session["test"] = True
        # print("166 test")


        print(session["testKey"])

        print(request.form)

    return "done"
        # return redirect(url_for('anteater.index', filename=filename))
        # return render_template('home.html', traces=session["traces"], trace="", fInfo=session["funcInfos"], lInfo=session["loopInfos"], depends=session["depends"], output=session["output"])




def readTrace(fname):

    fp = session["filepath"]
    ind1 = fp.rfind("/")
    ind2 = fp.rfind("\\")
    if ind1 > ind2:
        ind = ind1
    else:
        ind = ind2
    fp = fp[:ind]

    f = open(fp+"/"+fname, "r")
    text = f.read()
    f.close()

    return text


def readTraceVals(fname):
    fp = session["filepath"]
    ind = fp.rfind("/")
    fp = fp[:ind]

    f = open(fp+"/"+fname+"Vals", "r")
    text = f.read()
    f.close()
    return text


def rerunTrace():
    source = request.form["source"]

    # filepath = './instance/uploads/temp'+session['filename']
    filepath = session["filepath"]
    f = open(filepath,"w")
    source = json.loads(source)

    lines = source.split("\n")

    for line in lines:

        f.write(line + "\n")

    f.close()

    filePrefix = session["filepath"].replace(".py", "")
    date = str(datetime.datetime.fromtimestamp(time.time())).replace(" ", "_")
    date = date.replace(":","-")
    filePrefix += date.split(".")[0]

    tracked = session["tracked"]
    variables = tracked[0]
    expressions = tracked[1]
    funcExclusions = tracked[2]
    libExclusions = tracked[3]

    trace, funcInfo, dependencies, output, loopInfo = traceWrapper.runTrace(filepath, variables, expressions,
                                                                            funcExclusions, libExclusions, False,
                                                                            filePrefix)
    ind1 = trace.rfind("/")
    ind2 = trace.rfind("\\")
    if ind1 > ind2:
        ind = ind1
    else:
        ind = ind2

    trace = trace[ind+1:]

    traces = session['traces']
    traces.append(trace)

    session['traces'] = traces

    fname = trace
    trace = readTrace(fname)

    return trace
