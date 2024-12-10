from flask import Blueprint, request, jsonify
from .DAO.friendships_DAO import *

def get_friends_list(user_id, include_status=False):
    try:
        friends = get_friends(user_id, include_status=include_status)

        if include_status:
            # Return detailed data with status
            return jsonify({"friends": friends}), 200
        else:
            # Return only the list of friend IDs
            friends_data = [friend['friend_id'] for friend in friends] if isinstance(friends, list) else list(friends)
            return jsonify({"friends": friends_data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def send_request(user_id, friend_id):
    try:
        send_friend_request(user_id, friend_id)
        return jsonify({"message": "Friendship request sent successfully."}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred."}), 500
    

def respond_to_request(user_id, friend_id, status):
    try:
        if status not in ['accepted', 'rejected']:
            return jsonify({"error": "Invalid status provided."}), 400
        
        respond_to_friend_request(user_id, friend_id, status)
        return jsonify({"message": f"Friendship request {status}."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def get_pending_friend_requests(user_id):
    try:
        pending_requests = get_pending_requests(user_id)
        
        return jsonify(pending_requests), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

#these two are the same, a request is also a valid friendship entry
# def remove_request(user_id, friend_id):
#     try:
#         delete_friendship(user_id, friend_id)
#         return jsonify({"message": "Friendship request removed."}), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

def remove_friend(user_id, friend_id):
    
    try:
        delete_friendship(user_id, friend_id)
        return jsonify({"message": "Friendship removed."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
#FRIENDSHIP DONE