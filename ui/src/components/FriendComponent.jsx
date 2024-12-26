import React, { useState, useEffect } from 'react'
import { Card, Button, Spinner } from 'react-bootstrap'
import { removeFriend, respondToFriendRequest } from '../services/friends'
import { fetchUserById } from '../services/users'

const FriendComponent = ({ friendId, status, onFriendsChange }) => {
  const [friend, setFriend] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFriend = async () => {
      setLoading(true)
      const fetchedFriend = await fetchUserById(friendId)
      if (fetchedFriend) {
        setFriend(prevState => {
          //console.log(fetchedFriend) // Log the updated friend
          return fetchedFriend
        })
        setLoading(false)
      }
    }
    fetchFriend()
  }, [friendId])

  const handleRemoveFriend = async () => {
    const result = await removeFriend(friendId)
    if (result) {
      onFriendsChange()
    }
  }

  const handleAcceptFriend = async () => {
    const result = await respondToFriendRequest(friendId, 'accepted')
    if (result) {
      onFriendsChange()
    }
  }

  const handleRejectFriend = async () => {
    const result = await respondToFriendRequest(friendId, 'rejected')
    if (result) {
      onFriendsChange()
    }
  }

  return (
    <Card
      style={{
        background: 'linear-gradient(315deg, #1fd1f9 0%, #b621fe 74%)',
        border: 'none',
        borderRadius: '15px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
        color: '#fff',
      }}
    >
      <Card.Body>
        {loading ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" style={{ color: '#fff' }} />
          </div>
        ) : (
          <>
            <Card.Title
              style={{
                fontWeight: 'bold',
                textTransform: 'uppercase',
                fontSize: '18px',
              }}
            >
              Username: {friend.username}
            </Card.Title>
            <Card.Text
              style={{
                fontSize: '16px',
                marginBottom: '1rem',
              }}
            >
              Email: {friend.email}
            </Card.Text>
            {status === 'accepted' ? (
              <Button
                onClick={handleRemoveFriend}
                style={{
                  background: 'linear-gradient(315deg, #ff8177 0%, #ffcc70 74%)',
                  border: 'none',
                  borderRadius: '20px',
                  color: '#fff',
                  fontWeight: 'bold',
                  padding: '8px 16px',
                  transition: 'transform 0.2s',
                }}
                onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
                onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
                size="sm"
              >
                Remove Friend
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleAcceptFriend}
                  style={{
                    background: 'linear-gradient(315deg, #1fd1f9 0%, #b621fe 74%)',
                    border: 'none',
                    borderRadius: '20px',
                    color: '#fff',
                    fontWeight: 'bold',
                    padding: '8px 16px',
                    marginRight: '10px',
                    transition: 'transform 0.2s',
                  }}
                  onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
                  onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
                  size="sm"
                >
                  Accept
                </Button>
                <Button
                  onClick={handleRejectFriend}
                  style={{
                    background: 'linear-gradient(315deg, #ff8177 0%, #ffcc70 74%)',
                    border: 'none',
                    borderRadius: '20px',
                    color: '#fff',
                    fontWeight: 'bold',
                    padding: '8px 16px',
                    transition: 'transform 0.2s',
                  }}
                  onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
                  onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
                  size="sm"
                >
                  Reject
                </Button>
              </>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default FriendComponent
