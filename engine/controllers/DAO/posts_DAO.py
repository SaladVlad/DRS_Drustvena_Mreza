from sqlalchemy import create_engine, Column, Integer, String, Text, Enum, TIMESTAMP, LargeBinary
from db import Base, Session, engine
from datetime import datetime
from flask import jsonify
from sqlalchemy import exc
import base64
from .friendships_DAO import *
import pytz

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


def create_post(**kwargs):
    session = Session()

    try:
        new_post = Post(**kwargs)
        print(new_post)
        session.add(new_post)
        session.commit()

        new_post.image_data = convert_to_base64(new_post.image_data)
        post_dict = {c.name: getattr(new_post, c.name) for c in new_post.__table__.columns}
        #convert the raw image_data in new_post to base64
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
        posts = session.query(Post).all()
        for post in posts:
            post.image_data = convert_to_base64(post.image_data)
        return {"posts": [{c.name: getattr(post, c.name) for c in post.__table__.columns} for post in posts]}, None
    except Exception as e:
        session.rollback()
        return None, str(e)

def get_posts_by_user(user_id):
    session = Session()
    try:
        post = session.query(Post).filter_by(user_id=user_id).all()
        post.image_data = convert_to_base64(post.image_data)
        return {"posts": [{c.name: getattr(post, c.name) for c in post.__table__.columns} for post in post]}, None
    except Exception as e:
        session.rollback()
        return None, str(e)

def get_pending_posts():
    session = Session()
    try:
        posts = session.query(Post).filter_by(status='pending').all()
        for post in posts:
            post.image_data = convert_to_base64(post.image_data)
        return {"posts": [{c.name: getattr(post, c.name) for c in post.__table__.columns} for post in posts]}, None
    except Exception as e:
        session.rollback()
        return None, str(e)

def get_post_by_id(post_id):
    session = Session()
    try:
        post = session.query(Post).filter_by(post_id=post_id).first()
        post.image_data = convert_to_base64(post.image_data)
        return {"post": {c.name: getattr(post, c.name) for c in post.__table__.columns}}, None
    except Exception as e:
        session.rollback()
        return None, str(e)

def get_posts_from_friends(friend_ids):
    session = Session()
    try:
        posts = session.query(Post).filter(Post.user_id.in_(friend_ids)).order_by(Post.created_at.desc()).all()
        
        for post in posts:
            post.image_data = convert_to_base64(post.image_data)
        return {"posts": [{c.name: getattr(post, c.name) for c in post.__table__.columns} for post in posts]}, None
    except Exception as e:
        session.rollback()
        return None, str(e)

def update_post( post_id, **kwargs):
    session = Session()
    try:
        post = session.query(Post).filter_by(post_id=post_id).first()
        if not post:
            return None, "Post not found"
        for key, value in kwargs.items():
            if hasattr(post, key):
                setattr(post, key, value)
        session.commit()
        post.image_data = convert_to_base64(post.image_data)
        return {"post": {c.name: getattr(post, c.name) for c in post.__table__.columns}}, None
    except Exception as e:
        session.rollback()
        return None, str(e)

def delete_post(post_id):
    session = Session()
    try:
        post = session.query(Post).filter_by(post_id=post_id).first()
        if not post:
            return None, "Post not found"
        session.delete(post)
        session.commit()
        post.image_data = convert_to_base64(post.image_data)
        return {"post": {c.name: getattr(post, c.name) for c in post.__table__.columns}}, None
    except Exception as e:
        session.rollback()
        return None, str(e)
