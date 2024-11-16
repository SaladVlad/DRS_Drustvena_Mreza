from sqlalchemy import create_engine, Column, Integer, String, Text, Enum, TIMESTAMP
from db import Base, Session, engine
from datetime import datetime

class Post(Base):
    __tablename__ = 'post'
    post_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    image_url = Column(String(255), nullable=True)
    status = Column(Enum('pending', 'approved', 'rejected'), default='pending')
    created_at = Column(TIMESTAMP, nullable=False, default= datetime.utcnow)
# Create all tables in the engine
Base.metadata.create_all(engine)

# Create a session to the database
session = Session()

# CRUD operations
def create_post(user_id, content, image_url=None):
    session = Session()
    try:
        new_post = Post(user_id=user_id, content=content, image_url=image_url, status='pending', created_at = datetime.utcnow)
        session.add(new_post)
        session.commit()
    except Exception as e:
        session.rollback()


#get all posts and get posts from a specific user
def read_posts(user_id=None):
    session = Session()
    if user_id:
        return session.query(Post).filter_by(user_id=user_id).all()
    return session.query(Post).all()

def read_pending_posts():
    session = Session()
    try:
        return session.query(Post).filter_by(status = 'pending').all()
    finally:
        session.close()

def read_post(post_id):
    session = Session()
    try:
        return session.query(Post).filter_by(post_id=post_id).first()
    finally:
        session.close()

def update_post(post_id, **kwargs):
    session = Session()
    try:
        post = read_post(post_id)
        if post:
            for key, value in kwargs.items():
                if hasattr(post, key):
                    setattr(post, key, value)
            session.commit()
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()

def update_post_status(post_id, status):
    session = Session()
    try:
        post = read_post(post_id)
        if post and status=='approved':
            post.status = 'approved'
            session.commit()
        elif post and status=='rejected':
            post.status = 'rejected'
            session.commit()
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()

def delete_post(post_id):
    session = Session()
    try:
        post = read_post(post_id)
        if post:
            session.delete(post)
            session.commit()
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()