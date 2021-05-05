import json
import time, datetime
from flask import (Blueprint, flash, g, redirect, render_template, request, session, url_for,jsonify)
from werkzeug.security import check_password_hash, generate_password_hash

from Anteater.source import source_required
import Anteater.traceWrapper as traceWrapper
from werkzeug.utils import secure_filename

bp = Blueprint('trace', __name__, url_prefix='/trace')


@bp.route('/trace', methods=('GET', 'POST'))
@source_required
def newtrace():
    fname = session.get("filepath")
    # print(fname)
    # f = open(fname, "r")
    # source = f.read()

    source = request.form["source"]
    source = json.loads(source)
    lines = source.split("\n")
    textStr = ""
    filepath = session["filepath"]
    f = open(filepath, "w")
    for line in lines:
        textStr += line + "\\n"
        f.write(line + "\n")
    f.close()

    g.source = textStr
    g.filename = session['filename']
    g.filepath = session['filepath']

    if request.method == 'POST' and "init" not in request.form:
        varStr = request.form['variables']
        exprStr = request.form['expressions']

        # newSource = request.form['sourceCode']

        funcExclStr = request.form['funcExcl']
        libExclStr = request.form['libExcl']


        filePrefix = g.filepath.replace(".py", "")
        date = str(datetime.datetime.fromtimestamp(time.time())).replace(" ", "_")
        date = date.replace(":", "-")
        filePrefix += date.split(".")[0]

        session["test"] = False


        if len(varStr) > 0:
            variables = json.loads(varStr)
        else:
            variables = []
        if len(exprStr) > 0:
            expressions = json.loads(exprStr)
        else:
            expressions = []
        if len(funcExclStr) > 0:
            funcExclusions = json.loads(funcExclStr)
        else:
            funcExclusions = []
        if len(libExclStr) > 0:
            libExclusions = json.loads(libExclStr)
        else:
            libExclusions = []

        overview = request.form['overview']
        if overview == "false":
            overview = False
        else:
            overview = True

        error = None

        if len(variables) == 0 and len(expressions) == 0 and not overview:
            error = 'Nothing to Trace'

        if error is None:
            g.variables = variables
            trace, funcInfo, dependencies, output, loopInfo = traceWrapper.runTrace(g.filepath, variables, expressions, funcExclusions, libExclusions, overview, filePrefix)
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

            session["tracked"] = [variables, expressions, funcExclusions, libExclusions]

            return redirect(url_for('anteater.index', filename=g.filename))

        flash(error)

    return render_template('newTrace.html')


ALLOWED_EXTENSIONS = set(['trace'])


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

