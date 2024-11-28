from .DAO.users_DAO import *

def get_all_users():
    read_users()

def get_user_by_id(user_id):
    user_data = read_user(user_id)

    if user_data:
        return jsonify(user_data), 200  # Return the user data as JSON with a 200 OK status
    else:
        return jsonify({"error": "User not found"}), 404

def get_user_by_username_or_email(username,email):
    user_data = find_user_by_username_or_email(username,email)
    print("user data: ",user_data)
    if user_data:
        print("user found")
        return jsonify(user_data), 200  # Return the user data as JSON with a 200 OK status
    else:
        print("user not found")
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
            return {"error": f"{key} cannot be null"}, 400
    return create_user(**create_user_kwargs)

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


