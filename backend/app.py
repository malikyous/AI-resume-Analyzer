import os

from flask import Flask
from flask_cors import CORS

from config import Config
from models import db
from routes.api import api


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, resources={r"/api/*": {"origins": "*"}})

    db.init_app(app)
    os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)

    app.register_blueprint(api, url_prefix="/api")

    with app.app_context():
        db.create_all()

    return app


app = create_app()


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
