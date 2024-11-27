from flask import Blueprint, jsonify, request
from controllers.users_controller import *

#Blueprint 
users_bp = Blueprint('users', __name__,url_prefix='/api/users')

@users_bp.route('/<int:user_id>', methods=['GET'])
def get_user(user_id):
    return get_user_by_id(user_id)


@users_bp.route('/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    return update(user_id, **data)