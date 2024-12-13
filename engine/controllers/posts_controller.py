# Controller: posts_controller.py
from flask import jsonify, request
from .DAO.posts_DAO import *
from .DAO.friendships_DAO import *
from flask_socketio import emit
from configuration.config import socketio

def handle_response(data, error, success_status=200, failure_status=400):
    if error:
        return jsonify({"error": error}), failure_status
    if isinstance(data, list):
        print(data)
        return jsonify([item for item in data]), success_status
    return jsonify(data), success_status

def get_all_posts_controller():
    posts, error = get_posts()
    return handle_response(posts, error)

def get_posts_by_user_controller(user_id):
    posts, error = get_posts_by_user(user_id)
    return handle_response(posts, error)

def get_pending_posts_controller():
    posts, error = get_pending_posts()
    print("Postovi sa statusom pending izvuceni iz baze: ", posts)
    return handle_response(posts, error)

def get_posts_from_friends_controller(user_id, status=None):
    friend_ids = get_friends(user_id)
    posts, error = get_posts_from_friends(friend_ids, status=status)
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
        print("Post bez filtera: ", post)

        filtered_post_dict = {
            "post_id": post["post"].get("post_id"),
            "user_id": post["post"].get("user_id"),
            "content": post["post"].get("content"),
            "status": post["post"].get("status"),
        }

        if error:
            return jsonify({"error": error}), 400
        
        # Emit the post data through socket after the post is created
        print("ovako izgleda post: ", filtered_post_dict)

        try:
            print("Pokušavam da pošaljem podatke kroz socket")
            socketio.emit('new_post_pending', filtered_post_dict)
            print("Uspešno poslat kroz socket")
        except ConnectionError as e:
            print(f"Greška u konekciji: {str(e)}")
        except TimeoutError as e:
            print(f"Isteklo vreme pri pokušaju slanja: {str(e)}")
        except Exception as e:
            print(f"Nepoznata greška pri slanju kroz socket: {str(e)}")

        return handle_response(post, error, success_status=201)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def update_post_controller():
    try:
        data = request.form.to_dict()
        post_id = data.pop("post_id", None)
        post, error = update_post(post_id=post_id, **data)
        return handle_response(post, error)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def delete_post_controller():
    try:
        post_id = request.json.get("post_id")
        post, error = delete_post(post_id)
        return handle_response(post, error)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

