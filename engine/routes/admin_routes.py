from flask import Blueprint, jsonify, request
from controllers.admin_controller import *

#Blueprint 
admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/admin/allusers', methods=['GET'])
def get_users():
    return get_all_users()

@admin_bp.route('/admin/blockedusers', methods=['GET'])
def get_blocked_users_admin():
    return get_blocked_users()

@admin_bp.route('/admin/unblock/<int:user_id>', methods=['PUT'])
def unblock_this_user(user_id):
    return unblock(user_id)