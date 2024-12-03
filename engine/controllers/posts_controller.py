# Controller: posts_controller.py
from flask import jsonify, request
from .DAO.posts_DAO import *

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
    return handle_response(posts, error)

def create_post_controller():
    try:
        data = request.form.to_dict()
        image_file = request.files.get("image_data")
        if image_file:
            data.update({
                "image_name": image_file.filename,
                "image_type": image_file.mimetype,
                "image_data": image_file.read()
            })
        post, error = create_post(**data)
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

