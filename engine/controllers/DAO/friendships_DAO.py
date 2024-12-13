from sqlalchemy import Column, Integer, Enum , ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy import or_
from db import Base, Session
from datetime import datetime
import pytz
from .users_DAO import User

class Friendship(Base):
    __tablename__ = 'friendship'
    
    user_id = Column(Integer, ForeignKey('user.user_id'), primary_key=True, nullable=False)  # Primary key part 1
    friend_id = Column(Integer, ForeignKey('user.user_id'), primary_key=True, nullable=False)  # Primary key part 2
    initiator_id = Column(Integer, ForeignKey('user.user_id'), nullable=False)  # ID of the request initiator
    status = Column(Enum('pending', 'accepted', 'rejected'), default='pending', nullable=False)  # Friendship status
    created_at = Column(TIMESTAMP, default=datetime.now(pytz.utc), nullable=False)  # Timestamp of creation

    # Relationships
    requester = relationship("User", foreign_keys=[initiator_id])
    user = relationship("User", foreign_keys=[user_id])
    friend = relationship("User", foreign_keys=[friend_id])


def get_friends(user_id, include_status=False):
    session = Session()
    try:
        user_id = int(user_id)

        # Query to get all friendships involving the user
        friendships = session.query(Friendship).filter(
            ((Friendship.user_id == user_id) | (Friendship.friend_id == user_id))
        ).all()

        if not friendships:
            print(f"No friendships found for user {user_id}.")
            return set()

        friends = []

        for friendship in friendships:
            if friendship.status == 'accepted':
                # Add the friend with details if include_status=True
                if friendship.user_id == user_id:
                    friends.append({'friend_id': friendship.friend_id, 'status': friendship.status})
                elif friendship.friend_id == user_id:
                    friends.append({'friend_id': friendship.user_id, 'status': friendship.status})
            elif include_status and friendship.status == 'pending':
                # Include pending requests only if include_status=True
                if friendship.user_id == user_id:
                    friends.append({'friend_id': friendship.friend_id, 'status': friendship.status})
                elif friendship.friend_id == user_id:
                    friends.append({'friend_id': friendship.user_id, 'status': friendship.status})

        # If include_status=False, return only the accepted friend IDs
        if not include_status:
            return {friend['friend_id'] for friend in friends if friend['status'] == 'accepted'}

        return friends  # Return detailed information with status if include_status=True

    except Exception as e:
        print(f"Error: {e}")
        return set()
    finally:
        session.close()

def send_friend_request(user_id, friend_id):
    session = Session()
    try:
        initiator_id = user_id
        # Ensure user_id is always the smaller ID
        if user_id > friend_id:
            user_id, friend_id = friend_id, user_id

        existing_request = session.query(Friendship).filter(
            (Friendship.user_id == user_id) & (Friendship.friend_id == friend_id)
        ).first()

        if existing_request:
            raise ValueError("Friendship request already exists")

        new_request = Friendship(user_id=user_id, friend_id=friend_id, initiator_id=initiator_id, status='pending')
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
            (Friendship.status == 'pending') & 
            (Friendship.initiator_id != user_id) & 
            or_(
                Friendship.user_id == user_id,
                Friendship.friend_id == user_id
            )
        ).all()
        
        requesters = [{
            'user_id': friendship.user_id,
            'friend_id': friendship.friend_id,
            'initiator_id': friendship.initiator_id,
            'receiver_id': friendship.friend_id if friendship.initiator_id == friendship.user_id else friendship.user_id
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