from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from controllers.admin_controller import *
from controllers.auth_controller import check_if_admin

#Blueprint 
admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

@admin_bp.route('/allusers', methods=['GET'], endpoint='get_users')
@jwt_required()
def get_users():
    print("checking if admin")
    if not check_if_admin():
        return jsonify({"error": "You are not an admin"}), 403
    print("admin")
    return get_all_users()

@admin_bp.route('/blockedusers', methods=['GET'],endpoint='get_blocked_users_admin')
@jwt_required()
def get_blocked_users_admin():
    if not check_if_admin():
        return jsonify({"error": "You are not an admin"}), 403
    return get_blocked_users()

@admin_bp.route('/unblock/<int:user_id>', methods=['PUT'],endpoint='unblock_this_user')
@jwt_required()
def unblock_this_user(user_id):
    if not check_if_admin():
        return jsonify({"error": "You are not an admin"}), 403
    return unblock(user_id)
