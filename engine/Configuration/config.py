from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager
import os

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://{os.getenv("MYSQL_USER")}:{os.getenv("MYSQL_PASSWORD")}@{os.getenv("MYSQL_HOST")}:{os.getenv("MYSQL_PORT")}/{os.getenv("MYSQL_DATABASE")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECTRET_KEY')

jwt = JWTManager(app)

CORS(app,supports_credentials=True)

db = SQLAlchemy(app)

# Registering blueprints after app and db are created to avoid cyclic imports
from routes.post_routes import posts_bp
from routes.admin_routes import admin_bp
from routes.auth_routes import auth_bp

app.register_blueprint(posts_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(admin_bp)




