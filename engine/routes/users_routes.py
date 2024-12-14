from flask import Blueprint, jsonify, request
from controllers.users_controller import *
from flask_jwt_extended import jwt_required
import hashlib
import hmac
import os
#Blueprint 
users_bp = Blueprint('users', __name__,url_prefix='/api/users')

@users_bp.route('/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    return get_user_by_id(user_id)

@users_bp.route('', methods=['POST'])
@jwt_required()
def create_user():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid payload'}), 400
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    address = data.get('address')
    city = data.get('city')
    state = data.get('state')
    phone_number = data.get('phone_number')

    return create(username, email, password, first_name, last_name, address, city, state, phone_number)



@users_bp.route('/findbyusernameandemail', methods=['GET'])
@jwt_required()
def find_by_username_and_email():
    
    username = request.args.get('username')
    email = request.args.get('email')
    print("username", username, "email", email)
    if not username and not email:
        return jsonify({'error': 'Username or email required'}), 400
    return get_user_by_username_or_email(username, email)


@users_bp.route('/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user_endpoint(user_id):
    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid payload"}), 400

    # Remove read-only fields from payload
    read_only_fields = {"created_at", "user_id"}
    filtered_data = {key: value for key, value in data.items() if key not in read_only_fields}

    # Update user
    user, error = update_user(user_id, **filtered_data)

    if error:
        return jsonify({"error": error}), 404
    return jsonify({
    "message": "User updated successfully",
    "user": {col.name: getattr(user, col.name) for col in User.__table__.columns}
    }), 200

@users_bp.route('/<int:user_id>/change-password', methods=['POST'])
@jwt_required()
def change_password(user_id):
    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid payload"}), 400

    old_password = data.get('oldPassword')
    new_password = data.get('newPassword')

    if not old_password or not new_password:
        return jsonify({"error": "Both old and new passwords are required."}), 400

    session = Session()
    try:
        user = session.query(User).filter_by(user_id=user_id).first()
        if not user:
            return jsonify({"error": "User not found."}), 404

        # Verify old password
        if not check_password_hash(user.password, old_password):
            return jsonify({"error": "Old password is incorrect."}), 400

        # Update password
        user.password = generate_password_hash(new_password)
        session.commit()
        return jsonify({"message": "Password changed successfully."}), 200
    except Exception as e:
        session.rollback()
        print(f"Error changing password: {e}")
        return jsonify({"error": "Internal server error."}), 500
    finally:
        session.close()

@users_bp.route('/search', methods=['GET'])
@jwt_required()
def search_users_route():
    query = request.args.get("query")
    address = request.args.get("address")
    city = request.args.get("city")
    state = request.args.get("state")
    user_id = request.args.get("currentUserId")
    return search_users_controller(query=query, address=address, city=city, state=state, user_id=user_id)

@users_bp.route('/locations', methods=['GET'])
@jwt_required()
def get_locations():
    session = Session()
    try:
        cities = [row[0] for row in session.query(User.city).distinct().all()]
        states = [row[0] for row in session.query(User.state).distinct().all()]
        return jsonify({"cities": cities, "states": states}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        session.close()