# Routes: posts_routes.py
from flask import Blueprint
from controllers.posts_controller import *

posts_bp = Blueprint("posts", __name__, url_prefix="/api/posts")

@posts_bp.route("", methods=["GET"])
def get_posts():
    user_id = request.args.get("user_id")
    if user_id:
        return get_posts_by_user_controller(user_id)
    return get_all_posts_controller()

@posts_bp.route("/pending", methods=["GET"])
def get_pending_posts():
    return get_pending_posts_controller()

@posts_bp.route("/friends", methods=["GET"])
def get_friends_posts():
    user_id = request.args.get("user_id")
    status = request.args.get("status")  
    return get_posts_from_friends_controller(user_id, status)

@posts_bp.route("", methods=["POST"])
def create_new_post():
    return create_post_controller()

@posts_bp.route("", methods=["PUT"])
def update_post():
    return update_post_controller()

@posts_bp.route("", methods=["DELETE"])
def delete_post():
    return delete_post_controller()
