from flask import jsonify
from .DAO.posts_DAO import *

def get_all_posts():
    try:
        posts = read_posts()
        if posts is None:
            return jsonify({"error": "No posts found"}), 404
        return jsonify([{"post_id": post.post_id, "user_id": post.user_id, "content": post.content, "image_url": post.image, "status": post.status, "created_at": post.created_at} for post in posts]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_pending_posts():
    try:
        pending_posts = read_pending_posts()
        if pending_posts is None:
            return jsonify({"error": "No pending posts found"}), 404
        return jsonify([{"post_id": post.post_id, "user_id": post.user_id, "content": post.content, "image_url": post.image, "status": post.status, "created_at": post.created_at} for post in pending_posts])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_post_by_id(post_id):
    try:
        post = read_post(post_id)
        if post is None:
            return jsonify({"error": "Post not found"}), 404
        return jsonify({"post_id": post.post_id, "user_id": post.user_id, "content": post.content, "image_url": post.image_url, "status": post.status, "created_at": post.created_at})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def get_posts_by_user(user_id):
    try:
        posts = read_posts_by_user(user_id)
        if posts is None:
            return jsonify({"error": "No posts found for user"}), 404
        return jsonify([{"post_id": post.post_id, "user_id": post.user_id, "content": post.content, "image_url": post.image_url, "status": post.status, "created_at": post.created_at} for post in posts])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def create_new_post(**kwargs):
    try:
        post, error = create(**kwargs)
        if post is None:
            return jsonify({"error": error}), 400
        return jsonify({"post_id": post.post_id, "user_id": post.user_id, "content": post.content, "image_url": post.image_url, "status": post.status, "created_at": post.created_at})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def update_post_data(**kwargs):
    try:
        post,error = update_post(**kwargs)
        if error is not None:
            return jsonify({"error": error}), 500
        return jsonify({"post_id": post.post_id, "user_id": post.user_id, "content": post.content, "image_url": post.image_url, "status": post.status, "created_at": post.created_at})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def update_post_status(**kwargs):
    try:
        post, error = update_post(**kwargs)
        if post is None:
            return jsonify({"error": error}), 400
        return jsonify({"post_id": post.post_id, "user_id": post.user_id, "content": post.content, "image_url": post.image_url, "status": post.status, "created_at": post.created_at})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def remove_post(**kwargs):
    try:
        result, error = delete_post(**kwargs)
        if error is not None:
            return jsonify({"error": error}), 400
        return jsonify({"message": "Post deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500