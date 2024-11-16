from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)

# Database configuration
#app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST', 'mysql') --dodavao mislio sam da ce pomoci, ali mrka kapa
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://user:ftn123@mysql:3306/social_network'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app, supports_credentials=True)

db = SQLAlchemy(app)

from routes import test_bp, posts_bp

app.register_blueprint(test_bp)
app.register_blueprint(posts_bp)



