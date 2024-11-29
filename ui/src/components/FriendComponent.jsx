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
    <Card>
      <Card.Body>
        {loading ? (
          <div className='d-flex justify-content-center'>
            <Spinner animation='border' />
          </div>
        ) : (
          <>
            <Card.Title>Username: {friend.username}</Card.Title>
            <Card.Text>Email: {friend.email}</Card.Text>
            {status === 'accepted' ? (
              <Button
                onClick={handleRemoveFriend}
                className='mb-3 btn-danger'
                size='sm'
              >
                Remove Friend
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleAcceptFriend}
                  className='mb-3 btn-success'
                  size='sm'
                >
                  Accept
                </Button>
                <Button
                  onClick={handleRejectFriend}
                  className='mb-3 btn-danger'
                  size='sm'
                >
                  Reject
                </Button>
              </>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  )
}

export default FriendComponent
