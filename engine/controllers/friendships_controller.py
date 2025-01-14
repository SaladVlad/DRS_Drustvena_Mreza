from flask import Blueprint, request, jsonify
from .DAO.friendships_DAO import *
from .logging import create_log

def get_friends_list(user_id, include_status=False):
    try:
        friends = get_friends(user_id, include_status=include_status)

        if include_status:
            # Return detailed data with status
            create_log(f"Retrieved friends list ","GET_FRIENDS")
            return jsonify({"friends": friends}), 200
        else:
            # Return only the list of friend IDs
            friends_data = [friend['friend_id'] for friend in friends] if isinstance(friends, list) else list(friends)
            create_log(f"Retrieved friends list with status","GET_FRIENDS")
            return jsonify({"friends": friends_data}), 200
    except Exception as e:
        create_log(f"Failed to retrieve friends list ","SERVER_ERROR_FRIENDS")
        return jsonify({"error": str(e)}), 500
    
def send_request(user_id, friend_id):
    try:
        send_friend_request(user_id, friend_id)
        create_log(f"Sent friend request ","POST_FRIENDS")
        return jsonify({"message": "Friendship request sent successfully."}), 200
    except ValueError as e:
        create_log(f"Failed to send request ","BAD_REQ_FRIENDS")
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        create_log(f"Failed to send request ","SERVER_ERROR_FRIENDS")
        return jsonify({"error": "An unexpected error occurred."}), 500
    

def respond_to_request(user_id, friend_id, status):
    try:
        if status not in ['accepted', 'rejected']:
            create_log(f"Invalid status provided ","BAD_REQ_FRIENDS")
            return jsonify({"error": "Invalid status provided."}), 400
        
        respond_to_friend_request(user_id, friend_id, status)
        create_log(f"Responded to friend request with status {status}","POST_FRIENDS")
        return jsonify({"message": f"Friendship request {status}."}), 200
    except Exception as e:
        create_log(f"Failed to respond to request ","SERVER_ERROR_FRIENDS")
        return jsonify({"error": str(e)}), 500
    
def get_pending_friend_requests(user_id):
    try:
        pending_requests = get_pending_requests(user_id)
        create_log(f"Retrieved pending friend requests ","GET_FRIENDS")
        return jsonify(pending_requests), 200
    except Exception as e:
        create_log(f"Failed to retrieve pending friend requests ","SERVER_ERROR_FRIENDS")
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
        create_log(f"Removed friend ","DELETE_FRIENDS")
        return jsonify({"message": "Friendship removed."}), 200
    except Exception as e:
        create_log(f"Failed to remove friend ","SERVER_ERROR_FRIENDS")
        return jsonify({"error": str(e)}), 500
    
#FRIENDSHIP DONE