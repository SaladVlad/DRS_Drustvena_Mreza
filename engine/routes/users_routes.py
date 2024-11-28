from flask import Blueprint, jsonify, request
from controllers.users_controller import *

#Blueprint 
users_bp = Blueprint('users', __name__,url_prefix='/api/users')

@users_bp.route('/<int:user_id>', methods=['GET'])
def get_user(user_id):
    return get_user_by_id(user_id)

@users_bp.route('', methods=['POST'])
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
def find_by_username_and_email():
    
    username = request.args.get('username')
    email = request.args.get('email')
    print("username", username, "email", email)
    if not username and not email:
        return jsonify({'error': 'Username or email required'}), 400
    return get_user_by_username_or_email(username, email)


@users_bp.route('/<int:user_id>', methods=['PUT'])
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