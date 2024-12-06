from .DAO.users_DAO import *
from .DAO.posts_DAO import *
from flask import jsonify

def get_all_users():
    try:
        users = read_users()
        if users is None:
            return jsonify({"error": "No users found"}), 404
        return jsonify([{"user_id": user.user_id, "username": user.username} for user in users])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_user_by_id(user_id):
    try:
        user = read_user(user_id)
        if user is None:
            return jsonify({"error": "User not found"}), 404
        return jsonify({"user_id": user.user_id, "username": user.username, 
                        "email": user.email, "first_name": user.first_name, "last_name": user.last_name, 
                        "address": user.address, "city": user.city, "state": user.state, 
                        "phone_number": user.phone_number, "is_admin": user.is_admin, "is_blocked": user.is_blocked})
    except Exception as e:
            return jsonify({"error": str(e)}), 500                

def create_new_user(**kwargs):
    try:
        user, error = create_user(**kwargs)
        if user is None:
            return jsonify({"error": error}), 400
        return jsonify({"user_id": user.user_id, "username": user.username, 
                        "email": user.email, "first_name": user.first_name, "last_name": user.last_name, 
                        "address": user.address, "city": user.city, "state": user.state, 
                        "phone_number": user.phone_number, "is_admin": user.is_admin, "is_blocked": user.is_blocked})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def update_user_data(**kwargs):
    try:
        user, error = update_user(**kwargs)
        if user is None:
            return jsonify({"error": error}), 400
        return jsonify({"user_id": user.user_id, "username": user.username, 
                        "email": user.email, "first_name": user.first_name, "last_name": user.last_name, 
                        "address": user.address, "city": user.city, "state": user.state, 
                        "phone_number": user.phone_number, "is_admin": user.is_admin, "is_blocked": user.is_blocked})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_blocked_users():
    try:
        users = read_blocked_users()
        if users is None:
            return jsonify({"error": "No users found"}), 404
        return jsonify([{"user_id": user.user_id, "username": user.username} for user in users])
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def unblock(user_id):
    try:
        user, error = unblock_user(user_id)
        if user is None:
            return jsonify({"error": error}), 400
        return jsonify({"user_id": user.user_id, "username": user.username, "is_blocked": user.is_blocked})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_all_pending_posts():
    try:
        posts, error = get_pending_posts()
        if posts is None:
            return jsonify({"error": "error"}), 404
        return jsonify([{"post_id": post.post_id, "user_id": post.user_id, "status": post.status} for post in posts])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def update_post_status_admin(**kwargs):
    try:
        post, error = update_post(**kwargs)
        if post is None:
            return jsonify({"error": error}), 400
        return jsonify({"post_id": post.post_id, "user_id": post.user_id, "content": post.content, "image_url": post.image_url, "status": post.status, "created_at": post.created_at})
    except Exception as e:
        return jsonify({"error": str(e)}), 500