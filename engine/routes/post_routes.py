from flask import Blueprint, jsonify, request
from controllers.posts_controller import *

#Blueprint 
posts_bp = Blueprint('posts', __name__,url_prefix='/api/posts')

@posts_bp.route('/', methods=['GET'])
def get_posts():
    user_id = request.args.get('user_id')
    if user_id:
        return get_posts_by_user(user_id)
    else:
        return get_all_posts()
    
@posts_bp.route('/friends', methods=['GET'])
def get_posts_from_friends_route():
    user_id = request.args.get('user_id')

    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    try:
        posts = get_posts_from_friends(user_id)

        if not posts:
            return jsonify({"message": "No posts found from friends."}), 404

        result = []
        for post in posts:
            post_data = {
                "post_id": post.post_id,
                "user_id": post.user_id,
                "content": post.content,
                "image": post.image,
                "status": post.status,
                "created_at": post.created_at.isoformat()  # Convert datetime to string
            }
            result.append(post_data)

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


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