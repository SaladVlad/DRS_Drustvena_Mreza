from sqlalchemy import create_engine, Column, Integer, String, Text, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from Configuration.config import app

# Create a engine to the database
engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'])

# Create a configured "Session" class
Session = sessionmaker(bind=engine)

# Create a base class for declarative class definitions
Base = declarative_base()

class Post(Base):
    __tablename__ = 'post'
    post_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, nullable=False)
    content = Column(Text, nullable=False)
    image_url = Column(String(255), nullable=True)
    status = Column(Enum('pending', 'approved', 'rejected'), default='pending')
    created_at = Column(String(255), nullable=False)

# Create all tables in the engine
Base.metadata.create_all(engine)

# Create a session to the database
session = Session()

# CRUD operations
def create_post(user_id, content, image_url=None):
    new_post = Post(user_id=user_id, content=content, image_url=image_url)
    session.add(new_post)
    session.commit()

#get all posts and get posts from a specific user
def read_posts(user_id=None):
    if user_id:
        return session.query(Post).filter_by(user_id=user_id).all()
    return session.query(Post).all()

def read_post(post_id):
    
    return session.query(Post).filter_by(post_id=post_id).first()

def update_post(post_id, user_id, content, image_url=None):
    post = read_post(post_id)
    if post:
        post.user_id = user_id
        post.content = content
        post.image_url = image_url
        session.commit()

def delete_post(post_id):
    post = read_post(post_id)
    if post:
        session.delete(post)
        session.commit()