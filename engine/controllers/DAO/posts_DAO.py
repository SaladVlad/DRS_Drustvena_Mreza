from sqlalchemy import create_engine, Column, Integer, String, Text, Enum, TIMESTAMP
from db import Base, Session, engine
from datetime import datetime
from sqlalchemy import exc
class Post(Base):
    __tablename__ = 'post'
    post_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    image_url = Column(String(255), nullable=True)
    status = Column(Enum('pending', 'approved', 'rejected'), default='pending')
    created_at = Column(TIMESTAMP, nullable=False, default=datetime.utcnow)

# Create all tables in the engine
Base.metadata.create_all(engine)

# Create a session to the database
session = Session()

def create(**kwargs):
    try:
        new_post = Post(**kwargs)
        session.add(new_post)
        session.commit()
        return new_post, None
    except exc.IntegrityError as e:
        session.rollback()
        return None, "Duplicate key error: post with ID {} already exists".format(kwargs['post_id'])
    except Exception as e:
        session.rollback()
        return None, str(e)

def read_posts():
    try:
        return session.query(Post).all()
    except Exception as e:
        return None

def read_pending_posts():
    try:
        return session.query(Post).filter_by(status='pending').all()
    except Exception as e:
        return None

def read_post(post_id):
    try:
        return session.query(Post).filter_by(post_id=post_id).first()
    except Exception as e:
        return None

def read_posts_by_user(user_id):
    try:
        return session.query(Post).filter_by(user_id=user_id).all()
    except Exception as e:
        return None

def update_post(**kwargs):
    try:
        post_id = kwargs['post_id']
        post = read_post(post_id)
        if post is None:
            return None, "Post not found"
        for key, value in kwargs.items():
            if key != 'post_id':
                setattr(post, key, value)
        session.commit()
        return post, None
    except Exception as e:
        session.rollback()
        return None, str(e)

def update_post_status(**kwargs):
    try:
        post_id = kwargs['post_id']
        post = read_post(post_id)
        if post is None:
            return None, "Post not found"
        for key, value in kwargs.items():
            if key != 'post_id':
                setattr(post, key, value)
        session.commit()
        return post, None
    except Exception as e:
        session.rollback()
        return None, str(e)

def delete_post(**kwargs):
    try:
        post_id = kwargs['post_id']
        post = read_post(post_id)
        if post is None:
            return None, "Post not found"
        session.delete(post)
        session.commit()
        return post, None
    except Exception as e:
        session.rollback()
        return None, str(e)