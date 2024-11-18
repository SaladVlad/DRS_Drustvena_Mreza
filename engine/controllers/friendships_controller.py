from flask import Blueprint, request, jsonify
from DAO.friendships_DAO import *

def send_request(user_id, friend_id):
    try:
        send_friend_request(user_id, friend_id)
        return jsonify({"message": "Friendship request sent successfully."}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred."}), 500
    

def respond_to_request(friendship_id, status):
    try:
        if status not in ['accepted', 'rejected']:
            return jsonify({"error": "Invalid status provided."}), 400
        
        respond_to_friend_request(friendship_id, status)
        return jsonify({"message": f"Friendship request {status}."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def get_friends_list(user_id):
    try:
        friends = get_friends(user_id)
        friends_data = [{"friend_id": friend.friend_id, "status": friend.status} for friend in friends]
        return jsonify({"friends": friends_data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def get_pending_friend_requests(user_id):
    try:
        pending_requests = get_pending_requests(user_id)
        requests_data = [{"requester_id": request.user_id, "status": request.status} for request in pending_requests]
        return jsonify({"pending_requests": requests_data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def get_mutual_friends_list(user_id, other_user_id):
    try:
        mutual_friend_ids = get_mutual_friends(user_id, other_user_id)
        return jsonify({"mutual_friends": mutual_friend_ids}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def remove_friend(friendship_id):
    try:
        delete_friendship(friendship_id)
        return jsonify({"message": "Friendship removed."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def remove_all_user_friendships(user_id):
    try:
        delete_all_friendships(user_id)
        return jsonify({"message": "All friendships removed."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
