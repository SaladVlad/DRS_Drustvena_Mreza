from .DAO.users_DAO import *
from .DAO.posts_DAO import *
from flask import jsonify

from .logging import create_log

def get_all_users():
    try:
        users = read_users()
        if users is None:
            create_log("No users found", "GET_USERS_ADMIN")
            return jsonify({"error": "No users found"}), 404
        create_log("Users fetched", "GET_USERS_ADMIN")
        return jsonify([{"user_id": user.user_id, "username": user.username} for user in users])
    except Exception as e:
        create_log("Failed to fetch users", "SERVER_ERROR_GET_USERSADMIN")
        return jsonify({"error": str(e)}), 500

def get_user_by_id(user_id):
    try:
        user = read_user(user_id)
        if user is None:
            create_log("User not found", "GET_USER_ADMIN")
            return jsonify({"error": "User not found"}), 404
        create_log("User fetched", "GET_USER_ADMIN")
        return jsonify({"user_id": user.user_id, "username": user.username, 
                        "email": user.email, "first_name": user.first_name, "last_name": user.last_name, 
                        "address": user.address, "city": user.city, "state": user.state, 
                        "phone_number": user.phone_number, "is_admin": user.is_admin, "is_blocked": user.is_blocked})
    except Exception as e:
        create_log("Failed to fetch user", "SERVER_ERROR_GET_USER_ADMIN")
        return jsonify({"error": str(e)}), 500                

def create_new_user(**kwargs):
    try:
        user, error = create_user(**kwargs)
        if user is None:
            create_log("User not created", "POST_USER_ADMIN")
            return jsonify({"error": error}), 400
        create_log("User created", "POST_USER_ADMIN")
        return jsonify({"user_id": user.user_id, "username": user.username, 
                        "email": user.email, "first_name": user.first_name, "last_name": user.last_name, 
                        "address": user.address, "city": user.city, "state": user.state, 
                        "phone_number": user.phone_number, "is_admin": user.is_admin, "is_blocked": user.is_blocked})
    except Exception as e:
        create_log("Failed to create user", "SERVER_ERROR_POST_ADMIN")
        return jsonify({"error": str(e)}), 500

def update_user_data(**kwargs):
    try:
        user, error = update_user(**kwargs)
        if user is None:
            create_log("User not found", "PUT_USER_ADMIN")
            return jsonify({"error": error}), 400
        create_log("User updated", "PUT_USER_ADMIN")
        return jsonify({"user_id": user.user_id, "username": user.username, 
                        "email": user.email, "first_name": user.first_name, "last_name": user.last_name, 
                        "address": user.address, "city": user.city, "state": user.state, 
                        "phone_number": user.phone_number, "is_admin": user.is_admin, "is_blocked": user.is_blocked})
    except Exception as e:
        create_log("Failed to update user", "SERVER_ERROR_PUT_ADMIN")
        return jsonify({"error": str(e)}), 500

def get_blocked_users():
    try:
        users = read_blocked_users()
        if users is None:
            create_log("No users found", "GET_BLOCKED_USERS_ADMIN")
            return jsonify({"error": "No users found"}), 404
        create_log("Users fetched", "GET_BLOCKED_USERS_ADMIN")
        return jsonify([{"user_id": user.user_id, "username": user.username} for user in users])
    except Exception as e:
        create_log("Failed to fetch users", "SERVER_ERROR_GET_BLOCKED_USERS_ADMIN")
        return jsonify({"error": str(e)}), 500


def unblock(user_id):
    try:
        user, error = unblock_user(user_id)
        if user is None:
            create_log("User not found", "UNBLOCK_USER_ADMIN")
            return jsonify({"error": error}), 400
        create_log("User unblocked", "UNBLOCK_USER_ADMIN")
        return jsonify({"user_id": user.user_id, "username": user.username, "is_blocked": user.is_blocked})
    except Exception as e:
        create_log("Failed to unblock user", "SERVER_ERROR_UNBLOCK_USER_ADMIN")
        return jsonify({"error": str(e)}), 500

def get_all_pending_posts():
    try:
        posts, error = get_pending_posts()
        if posts is None:
            create_log("Posts not found", "GET_PENDING_POSTS_ADMIN")
            return jsonify({"error": "error"}), 404
        create_log("Posts fetched", "GET_PENDING_POSTS_ADMIN")
        return jsonify([{"post_id": post.post_id, "user_id": post.user_id, "status": post.status} for post in posts])
    except Exception as e:
        create_log("Failed to fetch posts", "SERVER_ERROR_GET_PENDING_POSTS_ADMIN")
        return jsonify({"error": str(e)}), 500

def update_post_status_admin(post_id, **kwargs):
    try:    
        post, error = update_post_status(post_id,**kwargs)
        if post is None:
            create_log("Post not found", "UPDATE_POST_STATUS_ADMIN")
            return jsonify({"error": error}), 400
        create_log("Post status updated", "UPDATE_POST_STATUS_ADMIN")
        return jsonify({
                        "post_id": post.post_id,
                        "user_id": post.user_id,
                        "content": post.content,
                        "status": post.status
        })
    except Exception as e:
        create_log("Failed to update post status", "SERVER_ERROR_UPDATE_POST_STATUS_ADMIN")
        return jsonify({"error": str(e)}), 500