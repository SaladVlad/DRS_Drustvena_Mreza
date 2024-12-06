from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from controllers.admin_controller import *
from controllers.auth_controller import check_if_admin
from controllers.posts_controller import get_pending_posts_controller

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

@admin_bp.route('/pendingposts', methods=['GET'],endpoint='get_pending_posts_admin')
@jwt_required()
def get_pending_posts_admin():
    if not check_if_admin():
        return jsonify({"error": "You are not an admin"}), 403
    print("idem u kontroler po postove")
    return get_pending_posts_controller()

@admin_bp.route('/approvepost/<int:post_id>', methods=['PUT'],endpoint='approve_post_admin')
@jwt_required()
def approve_post_admin(post_id):
    if not check_if_admin():
        return jsonify({"error": "You are not an admin"}), 403
    return update_post_status_admin(post_id, status="approved")

@admin_bp.route('/rejectpost/<int:post_id>', methods=['PUT'],endpoint='reject_post_admin')
@jwt_required()
def reject_post_admin(post_id):
    if not check_if_admin():
        return jsonify({"error": "You are not an admin"}), 403
    return update_post_status_admin(post_id, status="rejected")
