from .DAO.posts_DAO import *

def get_all_posts():
    read_posts()

def get_posts_by_user(user_id):
    read_posts(user_id)

def get_post_by_id(post_id):
    read_post(post_id)

def create(user_id, content, image_url=None):
    create_post(user_id, content, image_url)

def update(post_id, user_id, content, image_url=None):
    update_post_kwargs = {
        "user_id": user_id,
        "content": content,
    }
    if image_url:
        update_post_kwargs["image_url"] = image_url
    update_post(post_id, update_post_kwargs)

def delete(post_id):
    delete_post(post_id)
