from flask import Blueprint, jsonify, request
from controllers.posts_controller import *

#Blueprint 
posts_bp = Blueprint('posts', __name__,url_prefix='/api/posts')

@posts_bp.route('/', methods=['GET'])
def get_posts():
    post_id = request.args.get('post_id')
    user_id = request.args.get('user_id')
    if post_id:
        return get_post_by_id(post_id)
    elif user_id:
        return get_posts_by_user(user_id)
    else:
        return get_all_posts()

@posts_bp.route('/', methods=['POST'])
def create_post():
    data = request.get_json()
    return create_new_post(**data)
    
@posts_bp.route('/', methods=['PUT'])
def update_post():
    data = request.get_json()
    return update_post_data(**data)

@posts_bp.route('/', methods=['DELETE'])
def delete_post():
    data = request.get_json()
    return remove_post(**data)

@posts_bp.route('/approve', methods=['PUT'])
def approve_post():
    data = request.get_json()
    return update_post_status(**data)