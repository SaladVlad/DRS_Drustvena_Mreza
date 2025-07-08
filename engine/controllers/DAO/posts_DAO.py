from sqlalchemy import create_engine, Column, Integer, String, Text, Enum, TIMESTAMP, LargeBinary, ForeignKey
from db import Base, Session, engine

from datetime import datetime
from flask import jsonify
from sqlalchemy import exc
import base64
from .friendships_DAO import *
import pytz
from .users_DAO import User, read_user, update_times_rejected 
from controllers.mail_sending import send_mail_when_new_post
from controllers.mail_sending import send_mail_when_post_approved
from controllers.mail_sending import send_mail_when_post_rejected

class Post(Base):
    __tablename__ = 'post'
    
    post_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('user.user_id'), nullable=False)  # Add ForeignKey to reference user table
    content = Column(Text, nullable=False)
    image_name = Column(String(50), nullable=True)  # Stores the name of the image
    image_type = Column(String(50), nullable=True)  # Stores the MIME type of the image
    image_data = Column(LargeBinary, nullable=True)  # Stores the binary data of the image
    status = Column(Enum('pending', 'approved', 'rejected', name='post_status_enum'), default='pending', nullable=False)
    created_at = Column(TIMESTAMP, nullable=False, default=lambda: datetime.now(pytz.utc))
# Create all tables in the engine
Base.metadata.create_all(engine)

# Create a session to the database

def convert_to_base64(image_data):
    if image_data is None:
        return None
    return base64.b64encode(image_data).decode() 

#  Add a helper function for consistent formatting 
def _format_post_response(post, username):
    """Formats a post object and adds the username."""
    post_dict = {c.name: getattr(post, c.name) for c in post.__table__.columns}
    post_dict['image_data'] = convert_to_base64(post.image_data)
    post_dict['username'] = username
    return post_dict



def create_post(**kwargs):
    session = Session()
    try:
        new_post = Post(**kwargs)
        
        # Get user details for email and response
        user = read_user(new_post.user_id)
        if not user:
            return None, "User not found for the post."

        session.add(new_post)
        session.commit()
        
        send_mail_when_new_post(user["username"], user["user_id"])

        # Use the helper function to format the response
        post_dict = _format_post_response(new_post, user['username'])

        return {"post": post_dict}, None
    except exc.IntegrityError:
        session.rollback()
        return None, "Integrity error: Unable to create post."
    except Exception as e:
        session.rollback()
        return None, str(e)

def get_posts():
    session = Session()
    try:
        # Join Post with User and select both the Post object and the username
        results = session.query(Post, User.username).join(User, Post.user_id == User.user_id).all()
        
        # Format each result using the helper function
        posts_list = [_format_post_response(post, username) for post, username in results]
        
        return {"posts": posts_list}, None
    except Exception as e:
        session.rollback()
        return None, str(e)

def get_posts_by_user(user_id):
    session = Session()
    try:
        results = session.query(Post, User.username).join(User, Post.user_id == User.user_id).filter(Post.user_id == user_id).all()
        posts_list = [_format_post_response(post, username) for post, username in results]
        return {"posts": posts_list}, None
    except Exception as e:
        session.rollback()
        return None, str(e)

def get_pending_posts():
    session = Session()
    try:
        results = session.query(Post, User.username).join(User, Post.user_id == User.user_id).filter(Post.status == 'pending').all()
        posts_list = [_format_post_response(post, username) for post, username in results]
        return {"posts": posts_list}, None
    except Exception as e:
        session.rollback()
        return None, str(e)

def get_post_by_id(post_id):
    session = Session()
    try:
        result = session.query(Post, User.username).join(User, Post.user_id == User.user_id).filter(Post.post_id == post_id).first()
        if not result:
            return None, "Post not found"
        
        post, username = result
        return {"post": _format_post_response(post, username)}, None
    except Exception as e:
        session.rollback()
        return None, str(e)

def get_posts_from_friends(friend_ids, status=None):
    session = Session()
    try:
        query = session.query(Post, User.username).join(User, Post.user_id == User.user_id).filter(Post.user_id.in_(friend_ids))
        
        if status:
            query = query.filter(Post.status == status)
        
        results = query.order_by(Post.created_at.desc()).all()
        
        posts_list = [_format_post_response(post, username) for post, username in results]
        
        return {"posts": posts_list}, None
    except Exception as e:
        session.rollback()
        return None, str(e)

def update_post(post_id, **kwargs):
    session = Session()
    try:
        post = session.query(Post).filter_by(post_id=post_id).first()
        if not post:
            return None, "Post not found"

        # Handle delete_image flag
        if kwargs.get("delete_image"):
            post.image_data = None
            post.image_type = None

        # Handle new image upload
        if "new_image_data" in kwargs and kwargs["new_image_data"]:
            post.image_data = kwargs["new_image_data"]  # Update the image data
            post.image_type = kwargs.get("new_image_type", post.image_type)  # Update the image type if provided

        # Update other post fields
        for key, value in kwargs.items():
            if hasattr(post, key) and key not in ["new_image_data", "delete_image", "new_image_name", "new_image_type"]:
                setattr(post, key, value)

        post.status = 'pending'  # Mark post as pending if updated
        session.commit()

        # Fetch the username to include in the response
        user = read_user(post.user_id)
        if not user:
            return None, "User not found for the post."

        return {"post": _format_post_response(post, user['username'])}, None
    except Exception as e:
        session.rollback()
        return None, str(e)

def update_post_status( post_id, **kwargs):
    session = Session()
    try:
        post = session.query(Post).filter_by(post_id=post_id).first()
        if not post:
            return None, "Post not found"

        for key, value in kwargs.items():
            if hasattr(post, key):
                setattr(post, key, value)
        session.commit()

        user = read_user(post.user_id)
        if not user:
            return None, "User not found"

        if post.status == 'approved':
            send_mail_when_post_approved(user["username"], post.content,user["email"])
        elif post.status == 'rejected':
            send_mail_when_post_rejected(user["username"], post.content,user["email"])
            update_times_rejected(user["user_id"])

        return post, None
    except Exception as e:
        print("DAO ispisivanje errora: ", e)
        session.rollback()
        return None, str(e)

def delete_post(post_id):
    session = Session()
    try:
        post = session.query(Post).filter_by(post_id=post_id).first()
        if not post:
            return None, "Post not found"
        
        # Get username before deleting
        user = read_user(post.user_id)
        username = user['username'] if user else 'Unknown'
        
        session.delete(post)
        session.commit()
        
        return {"post": _format_post_response(post, username)}, None
    except Exception as e:
        session.rollback()
        return None, str(e)