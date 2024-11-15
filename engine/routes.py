from flask import Blueprint, jsonify
from controllers.posts_controller import *

#Blueprint 
test_bp = Blueprint('test', __name__)
posts_bp = Blueprint('posts', __name__)

@test_bp.route('/test/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Hello from Flask!"})


@posts_bp.route('/posts', methods=['GET'])
def get_posts():
    return get_all_posts()