import React, { useState, useEffect } from 'react'
import '../services/users'
import { removeFriend } from '../services/friends'
import { fetchUserById, getUserIdFromToken } from '../services/users'

const FriendComponent = ({ friendId }) => {
  const [friend, setFriend] = useState(null)
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await getUserIdFromToken()
      if (userId) {
        setUserId(userId)
      }
    }
    const fetchFriend = async () => {
      const fetchedFriend = await fetchUserById(friendId)
      if (fetchedFriend) {
        setFriend(fetchedFriend)
        console.log(friend)
      }
    }
    fetchUserId()
    fetchFriend()
  }, [friendId])

  const handleRemoveFriend = async () => {
    const result = await removeFriend(userId, friendId)
    if (result) {
      setFriend(null)
    }
  }

  return (
    <div>
      {friend ? (
        <>
          <p>Username: {friend.username}</p>
          <p>Email: {friend.email}</p>
          <button onClick={handleRemoveFriend}>Remove Friend</button>
        </>
      ) : (
        <p>Friend doesn't exist.</p>
      )}
    </div>
  )
}

export default FriendComponent
