import functools
from flask import (Blueprint, flash, g, redirect, render_template, request, session, url_for)
from flask import current_app as app
from werkzeug.utils import secure_filename
import os

UPLOAD_FOLDER="./instance/uploads"
ALLOWED_EXTENSIONS = set(['py'])

bp = Blueprint('source',__name__,url_prefix='/')

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def source_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.filename is None:
            return redirect(url_for('source.index'))
        return view(**kwargs)

    return wrapped_view



@bp.before_app_request
def load_existing_source():
    filename = session.get('filename')

    if filename is None:
        g.filename = None
    else:
        g.filename = filename


@bp.route('', methods=('GET', 'POST'))
def index():
    print("in source index")
    if request.method == 'POST':
        error = None
        if 'file' not in request.files:
            error = 'No file selected'
            file = None
            support = []
        else:
            file = request.files['file']
            # if user does not select file, browser also
            # submit an empty part without filename
            if file.filename == '':
                error = 'No selected file'

            fname = file.filename

            if not allowed_file(fname):
                error = "File type not allowed"

            support = request.files.getlist("file2")
        print(request.form)

        print(file)
        print('error')



        if file and error is None:
            filename = secure_filename(file.filename)

            #create new folder for this specific project
            dirPath = app.config["UPLOAD_FOLDER"] + "/" + filename.split(".")[0]

            if not os.path.exists(dirPath):
                os.makedirs(dirPath)

            file.save(os.path.join(dirPath, filename))
            file.save(os.path.join(dirPath, filename.split(".")[0]+"_original.py"))
            for f in support:
                if len(f.filename) > 0:
                    f.save(os.path.join(dirPath, f.filename))

            session.clear()
            os.path.dirname(os.path.abspath(__file__))
            session['filepath'] = os.path.join(dirPath, filename)

            session['filename'] = fname
            session["traces"] = []
            session['output'] = ""
            session["funcInfos"] = []
            session["loopInfos"] = []
            session["depends"] = []
            session["test"] = False
            session["testKey"] = None

            return redirect(url_for('anteater.index', filename=fname))
        elif request.form["test"]=="true":
            fname =session["filename"]
            return redirect(url_for('anteater.index', filename=fname))
        else:

            flash(error)


    return render_template('index.html')


