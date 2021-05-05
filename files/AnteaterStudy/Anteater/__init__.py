import os
from flask import Flask


def create_app(test_config = None):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(SECRET_KEY='dev',DATABASE=os.path.join(app.instance_path,'flaskr.sqlite9'))

    if test_config is None:
        #load the instance of config, if it exists, when not testing
        app.config.from_pyfile('config.py',silent=True)
    else:
        app.config.from_mapping(test_config)

    #ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

    #simple page that says hello world
    # @app.route('/')
    # def index():
    #     return render_template('index.html')

    import Anteater.trace
    app.register_blueprint(Anteater.trace.bp)

    import Anteater.source
    app.register_blueprint(Anteater.source.bp)
    app.config['UPLOAD_FOLDER'] = source.UPLOAD_FOLDER

    import Anteater.main
    app.register_blueprint(Anteater.main.bp)

    return app
