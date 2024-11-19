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
    read_user(user_id)

def create(username, email, password, first_name, last_name, address=None, city=None, state=None, phone_number=None):
    create_user(username, email, password, first_name, last_name, address, city, state, phone_number)

def update(user_id, username, email, password, first_name, last_name, address, city, state, phone_number):
    update_user_kwargs = {
            "username": username,
            "email": email,
            "password": password,
            "first_name": first_name,
            "last_name": last_name,
            "address": address,
            "city": city,
            "state": state,
            "phone_number": phone_number,
    }
    update_user(user_id, update_user_kwargs)

def get_blocker_users():
    read_blocked_users()

def unblock(user_id):
    unblock_user(user_id)

def get_all_pending_posts():
    read_pending_posts()

def approve_post(post_id, status='approved'):
    update_post_status(post_id, status)