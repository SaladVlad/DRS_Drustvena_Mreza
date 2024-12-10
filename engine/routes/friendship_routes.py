from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt

from controllers.friendships_controller import *


friends_bp = Blueprint('friends', __name__, url_prefix='/api/friends')

@friends_bp.route('/user_id=<int:user_id>', methods=['GET'])
#@jwt_required()
def get_friends(user_id):
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    include_status = request.args.get('include_status', 'false').lower() == 'true'
    return get_friends_list(user_id, include_status=include_status)

@friends_bp.route('/user_id=<int:user_id>&friend_id=<int:friend_id>', methods=['POST'])
#@jwt_required()
def send_friend_request(user_id, friend_id):
    if not user_id or not friend_id:
        return jsonify({"error": "User ID and friend ID are both required"}), 400
    return send_request(user_id, friend_id)

@friends_bp.route('/user_id=<int:user_id>&friend_id=<int:friend_id>&status=<string:status>', methods=['POST'])
#@jwt_required()
def respond_to_friend_request(user_id, friend_id, status):
    if not user_id or not friend_id or not status:
        return jsonify({"error": "User ID, friend ID, and status are all required"}), 400
    return respond_to_request(user_id, friend_id, status)


@friends_bp.route('/pending/user_id=<int:user_id>', methods=['GET'])
#@jwt_required()
def get_pending_requests(user_id):
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400
    return get_pending_friend_requests(user_id)

@friends_bp.route('/user_id=<int:user_id>&friend_id=<int:friend_id>', methods=['DELETE'])
#@jwt_required()
def delete_friendship(user_id, friend_id):
    if not user_id or not friend_id:
        return jsonify({"error": "User ID and friend ID are both required"}), 400
    return remove_friend(user_id, friend_id)

#FRIENDSHIP DONE







