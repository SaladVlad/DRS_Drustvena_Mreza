# Controller: posts_controller.py
from flask import jsonify, request
from .DAO.posts_DAO import *
from .DAO.friendships_DAO import *
from flask_socketio import emit
from configuration.config import socketio

from .logging import create_log

def handle_response(data, error, success_status=200, failure_status=400):
    if error:
        return jsonify({"error": error}), failure_status
    if isinstance(data, list):
        print(data)
        return jsonify([item for item in data]), success_status
    return jsonify(data), success_status

def get_all_posts_controller():
    posts, error = get_posts()
    if not error: create_log(f"Retrieved all posts ","GET_POSTS")
    return handle_response(posts, error)

def get_posts_by_user_controller(user_id):
    posts, error = get_posts_by_user(user_id)
    if not error: create_log(f"Retrieved posts by user {user_id}","GET_POSTS_BY_USER")
    return handle_response(posts, error)

def get_pending_posts_controller():
    posts, error = get_pending_posts()
    print("Postovi sa statusom pending izvuceni iz baze: ", posts)
    if not error: create_log(f"Retrieved pending posts","GET_PENDING_POSTS")
    return handle_response(posts, error)

def get_posts_from_friends_controller(user_id, status=None):
    friend_ids = get_friends(user_id)
    posts, error = get_posts_from_friends(friend_ids, status=status)
    if not error: create_log(f"Retrieved posts from friends of user {user_id}","GET_POSTS_FROM_FRIENDS")
    return handle_response(posts, error)

def create_post_controller():
    try:
        data = request.form.to_dict()
        image_file = request.files.get("image")
        if image_file:
            data.update({
                "image_name": image_file.filename,
                "image_type": image_file.mimetype,
                "image_data": image_file.read()
            })
        post, error = create_post(**data)
        if not error: create_log(f"Created post with ID:{post['post'].get('post_id')}","CREATE_POST")

        print("Post bez filtera: ", post)

        filtered_post_dict = {
            "post_id": post["post"].get("post_id"),
            "user_id": post["post"].get("user_id"),
            "content": post["post"].get("content"),
            "status": post["post"].get("status"),
        }

        if error:
            create_log(f"Failed to create post: {error}","BAD_REQUEST_CREATE_POST")
            return jsonify({"error": error}), 400
        
        # Emit the post data through socket after the post is created
        print("ovako izgleda post: ", filtered_post_dict)

        try:
            print("Pokušavam da pošaljem podatke kroz socket")
            socketio.emit('new_post_pending', filtered_post_dict)
            print("Uspešno poslat kroz socket")
            create_log(f"Sent post with ID:{post['post'].get('post_id')} through socket","CREATE_POST")
        except ConnectionError as e:
            create_log(f"Connection error occured: {str(e)}","CONN_ERROR_CREATE_POST")
            print(f"Greška u konekciji: {str(e)}")
        except TimeoutError as e:
            create_log(f"Timeout error occured while sending through socket: {str(e)}","TIMEOUT_ERROR_CREATE_POST")
            print(f"Isteklo vreme pri pokušaju slanja: {str(e)}")
        except Exception as e:
            create_log(f"Unknown error occured while sending through socket: {str(e)}","UNKNOWN_ERROR_CREATE_POST")
            print(f"Nepoznata greška pri slanju kroz socket: {str(e)}")

        return handle_response(post, error, success_status=201)
    except Exception as e:
        create_log(f"Error in create_post_controller: {str(e)}","SERVER_ERROR_CREATE_POST")
        return jsonify({"error": str(e)}), 500

def update_post_controller(): 
    try:
        data = request.json  # Use request.json for JSON payloads
        post_id = data.pop("post_id", None)  # Remove post_id from data and store it separately
        delete_image = data.pop("delete_image", False)  # Remove delete_image flag if present
        
        if not post_id:
            create_log("post_id is required","ERROR_UPDATE_POST")
            return jsonify({"error": "post_id is required"}), 400
        
        post, error = update_post(post_id=post_id, delete_image=delete_image, **data)  # Pass delete_image as argument
        if not error: 
            create_log(f"Updated post with ID: {post_id}", "UPDATE_POST")
        
        return handle_response(post, error)
    except Exception as e:
        print(f"Error in update_post_controller: {str(e)}")  # Log the error
        return jsonify({"error": str(e)}), 500


def delete_post_controller():
    try:
        post_id = request.json.get("post_id")
        post, error = delete_post(post_id)
        if not error: create_log(f"Deleted post with ID:{post_id}","DELETE_POST")
        return handle_response(post, error)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

