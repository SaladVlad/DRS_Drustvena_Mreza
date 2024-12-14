import hashlib
from .DAO.users_DAO import *

from .logging import create_log

def get_all_users():
    read_users()

def get_user_by_id(user_id):
    user_data = read_user(user_id)

    if user_data:
        create_log("User fetched by id", "GET_USER")
        return jsonify(user_data), 200  # Return the user data as JSON with a 200 OK status
    else:
        create_log("User not found", "GET_USER")
        return jsonify({"error": "User not found"}), 404

def get_user_by_username_or_email(username,email):
    user_data = find_user_by_username_or_email(username,email)
    print("user data: ",user_data)
    if user_data:
        print("user found")
        create_log("User fetched by username or email", "GET_USER")
        return jsonify(user_data), 200  # Return the user data as JSON with a 200 OK status
    else:
        print("user not found")
        create_log("User not found", "GET_USER")
        return jsonify({"error": "User not found"}), 404

def create(username, email, password, first_name, last_name, address, city, state, phone_number):
    create_user_kwargs = {
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
    print("create user kwargs: ",create_user_kwargs)
    #for each property, check if null and return the appropriate error
    for key, value in create_user_kwargs.items():
        if value is None:
            create_log("User not created", "BAD_REQUEST_POST_USER")
            return {"error": f"{key} cannot be null"}, 400
    data = create_user(**create_user_kwargs)
    create_log("User created", "POST_USER")
    return data

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
    #for each property, check if null and return the appropriate error
    for key, value in update_user_kwargs.items():
        if value is None:
            return {"error": f"{key} cannot be null"}, 400
    update_user(user_id, update_user_kwargs)
    create_log("User updated", "PUT_USER")

def generate_password_hash(password):
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

def check_password_hash(stored_password, provided_password):
    hashed_provided_password = hashlib.sha256(provided_password.encode('utf-8')).hexdigest()
    return stored_password == hashed_provided_password

def search_users_controller(query=None, address=None, city=None, state=None,user_id=None):
    if not query and not address and not city and not state:
        return jsonify({"error": "At least one search parameter is required"}), 400

    users = search_users(query=query, address=address, city=city, state=state, user_id=user_id)
    if not users:
        return jsonify({"message": "No users found"}), 404

    return jsonify({"users": users}), 200
