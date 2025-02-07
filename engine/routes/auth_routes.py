from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from controllers.auth_controller import check_if_admin as ifAdmin, check_if_blocked as checkBlocked, login_user

#Blueprint 
auth_bp = Blueprint('auth', __name__,url_prefix='/api/auth')


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    return login_user(**data)

@auth_bp.route('/isadmin', methods=['GET'])
@jwt_required()
def check_if_admin():
    print("checking if admin")
    return ifAdmin()

@auth_bp.route('/isblocked', methods=['GET'])
@jwt_required()
def check_if_blocked():
    return checkBlocked()

