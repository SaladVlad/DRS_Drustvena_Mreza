from sqlalchemy import Column, Integer, Enum , ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from db import Base, Session
from sqlalchemy.dialects.postgresql import ENUM
from datetime import datetime
import pytz
from .users_DAO import User

friendship_status_enum = ENUM('pending', 'accepted', 'rejected', name='friendship_status_enum', create_type=True,metadata=Base.metadata)

class Friendship(Base):
    __tablename__ = 'friendship'
    
    user_id = Column(Integer, ForeignKey('user.user_id'), primary_key=True, nullable=False)  # Primary key part 1
    friend_id = Column(Integer, ForeignKey('user.user_id'), primary_key=True, nullable=False)  # Primary key part 2
    initiator_id = Column(Integer, ForeignKey('user.user_id'), nullable=False)  # ID of the request initiator
    status = Column(friendship_status_enum, default='pending', nullable=False)  # Friendship status
    created_at = Column(TIMESTAMP, nullable=False, default=lambda: datetime.now(pytz.utc))
    # Relationships
    requester = relationship("User", foreign_keys=[initiator_id])
    user = relationship("User", foreign_keys=[user_id])
    friend = relationship("User", foreign_keys=[friend_id])


def get_friends(user_id):
    session = Session()
    try:

        user_id = int(user_id)

        # Query to get all accepted friendships involving the user
        friendships = session.query(Friendship).filter(
            ((Friendship.user_id == user_id) | (Friendship.friend_id == user_id)) &
            (Friendship.status == 'accepted')
        ).all()

        # Debugging: Print out the friendships to see what is returned
        print(f"Friendships for user {user_id}: {friendships}")

        if not friendships:
            print(f"No friendships found for user {user_id}.")
            return set()

        friend_ids = set()

        for friendship in friendships:
            
            # Ensure we're comparing the correct user_id to add the corresponding friend_id
            if friendship.user_id == user_id:
                print(f"Adding friend_id = {friendship.friend_id} to the set")
                friend_ids.add(friendship.friend_id)  # Add the friend_id if the user is the current user
            elif friendship.friend_id == user_id:
                print(f"Adding user_id = {friendship.user_id} to the set")
                friend_ids.add(friendship.user_id)  # Add the user_id if the friend_id is the current user

        # Print the final set of friend IDs
        print(f"Friend IDs for user {user_id}: {friend_ids}")  # This is the final result
        return friend_ids
    except Exception as e:
        print(f"Error: {e}")
        return set()
    finally:
        session.close()

def send_friend_request(user_id, friend_id):
    session = Session()
    try:
        # Ensure user_id is always the smaller ID
        if user_id > friend_id:
            user_id, friend_id = friend_id, user_id

        existing_request = session.query(Friendship).filter(
            (Friendship.user_id == user_id) & (Friendship.friend_id == friend_id)
        ).first()

        if existing_request:
            raise ValueError("Friendship request already exists")
        
        new_request = Friendship(user_id=user_id, friend_id=friend_id, initiator_id=user_id, status='pending')
        session.add(new_request)
        session.commit()
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()


def respond_to_friend_request(user_id, friend_id, status):  # Accept or reject a request
    session = Session()
    try:
        # Ensure user_id is always the smaller ID
        if user_id > friend_id:
            user_id, friend_id = friend_id, user_id

        friendship = session.query(Friendship).filter_by(user_id=user_id, friend_id=friend_id).first()
        if friendship:

            if friendship.status == 'rejected':
                session.delete(friendship) #remove the friendship if rejected
                session.commit()
                return
            else:
                friendship.status = status
                session.commit()
    except Exception as e:
        session.rollback()
        print(e)
        raise e
    finally:
        session.close()


def get_pending_requests(user_id):
    session = Session()
    try:
        pending_requests = session.query(Friendship).filter(
            (Friendship.user_id == user_id) & (Friendship.status == 'pending')
        ).all()
        
        requesters = [{
            'user_id': friendship.user_id,
            'friend_id': friendship.friend_id,
            'initiator_id': friendship.initiator_id
        } for friendship in pending_requests]
        
        return requesters
    except Exception as e:
        print(e)
        return []
    finally:
        session.close()

def delete_friendship(user_id, friend_id):
    session = Session()
    try:
        # Ensure user_id is always the smaller ID
        if user_id > friend_id:
            user_id, friend_id = friend_id, user_id

        friendship = session.query(Friendship).filter_by(user_id=user_id, friend_id=friend_id).first()
        if friendship:
            session.delete(friendship)
            session.commit()
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()

#FRIENDSHIP DAO DONE?