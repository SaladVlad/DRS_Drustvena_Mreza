from sqlalchemy import Column, Integer, String, Text, Enum, TIMESTAMP, LargeBinary
from db import Base, Session

from datetime import datetime
from sqlalchemy import exc
import base64
from sqlalchemy.dialects.postgresql import ENUM
from .friendships_DAO import *
import pytz
from .users_DAO import read_user, update_times_rejected
from controllers.mail_sending import send_mail_when_new_post
from controllers.mail_sending import send_mail_when_post_approved
from controllers.mail_sending import send_mail_when_post_rejected


post_status_enum = ENUM('pending', 'approved', 'rejected', name='post_status_enum', create_type=True,metadata=Base.metadata)

class Post(Base):
    __tablename__ = 'post'
    
    post_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('user.user_id'), nullable=False)  # Add ForeignKey to reference user table
    content = Column(Text, nullable=False)
    image_name = Column(String(50), nullable=True)  # Stores the name of the image
    image_type = Column(String(50), nullable=True)  # Stores the MIME type of the image
    image_data = Column(LargeBinary, nullable=True)  # Stores the binary data of the image
    status = Column(post_status_enum, default='pending', nullable=False)
    created_at = Column(TIMESTAMP, nullable=False, default=lambda: datetime.now(pytz.utc))


def convert_to_base64(image_data):
    if image_data is None:
        return None
    return base64.b64encode(image_data).decode() 


def create_post(**kwargs):
    session = Session()

    try:
        new_post = Post(**kwargs)
        print(new_post)
        print("User id novog posta: ", new_post.user_id)

        user = read_user(new_post.user_id) #nadji usera pod tim id-em i izvuci mu username
        print(f"Users username: {user["username"]}")

        session.add(new_post)
        session.commit()
        print("Dodat u bazu")

        send_mail_when_new_post(user["username"])

        new_post.image_data = convert_to_base64(new_post.image_data)
        post_dict = {c.name: getattr(new_post, c.name) for c in new_post.__table__.columns}

        #convert the raw image_data in new_post to base64
        """
        post_socket_dict = {
            "post_id": new_post.post_id,
            "user_id": new_post.user_id,
            "content": new_post.content
        }
        # Emit the new post to all connected clients
        
        print("Saljem kroz socket")
        socketio.emit('new_post_pending', post_dict)
        print("Poslao kroz socket")
        """
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
        posts = session.query(Post).filter_by(user_id=user_id).all()
        for post in posts:
            post.image_data = convert_to_base64(post.image_data)
        return {"posts": [{c.name: getattr(post, c.name) for c in post.__table__.columns} for post in posts]}, None
    except Exception as e:
        session.rollback()
        return None, str(e)

def get_pending_posts():
    print("Usao u funkicju za pristup bazi da pokupim postove")
    session = Session()
    try:
        posts = session.query(Post).filter_by(status='pending').all()
        print("postovi pokupljeni")
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

def get_posts_from_friends(friend_ids, status=None):
    session = Session()
    try:
        query = session.query(Post).filter(Post.user_id.in_(friend_ids))
        
        if status:
            query = query.filter(Post.status == status)
        
        posts = query.order_by(Post.created_at.desc()).all()
        
        for post in posts:
            post.image_data = convert_to_base64(post.image_data)
        
        return {"posts": [{c.name: getattr(post, c.name) for c in post.__table__.columns} for post in posts]}, None
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
            if hasattr(post, key) and key not in ["new_image_data", "delete_image"]:
                setattr(post, key, value)

        post.status = 'pending'  # Mark post as pending if updated
        session.commit()

        # Convert image to base64 if it exists
        if post.image_data:
            post.image_data = convert_to_base64(post.image_data)

        return {"post": {c.name: getattr(post, c.name) for c in post.__table__.columns}}, None
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

        user = read_user(post.user_id)  # nadji usera pod tim id-em i izvuci mu username

        if not user:
            print("User not found")
            return None, "User not found"

        print("Users username: ", user["username"])

        if post.status == 'approved':
            print("Post je odobren, ovo je njegov status: ", post.status)
            send_mail_when_post_approved(user["username"], post.content,user["email"])
            print("Poslao mail")
        elif post.status == 'rejected':
            print("Post je odbijen, ovo je njegov status: ", post.status)
            send_mail_when_post_rejected(user["username"], post.content,user["email"])
            print("Poslao mail")
            update_times_rejected(user["user_id"])

        post.image_data = convert_to_base64(post.image_data)
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
        session.delete(post)
        session.commit()
        post.image_data = convert_to_base64(post.image_data)
        return {"post": {c.name: getattr(post, c.name) for c in post.__table__.columns}}, None
    except Exception as e:
        session.rollback()
        return None, str(e)
