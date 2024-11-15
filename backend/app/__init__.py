from flask import Flask
from flask_cors import CORS
from config import Config 
from flask_sqlalchemy import SQLAlchemy
from app.routes import main

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    # Load configuration
    app.config.from_object(Config)  # Directly using Config since it's imported

    # Initialize extensions
    db.init_app(app)
    CORS(app)

    # Register blueprints
    from app.controllers.user_controller import user_blueprint
    app.register_blueprint(user_blueprint, url_prefix="/users")
    app.register_blueprint(main, url_prefix="/") 

    return app
