import React, { useState, useEffect } from 'react'
import { getFriendsFromCurrentUser, removeFriend } from '../services/friends.js'

const FriendComponent = () => {
  const [friends, setFriends] = useState([])

  useEffect(() => {
    const fetchFriends = async () => {
      const fetchedFriends = await getFriendsFromCurrentUser()
      if (fetchedFriends) {
        setFriends(fetchedFriends)
      }
    }
    fetchFriends()
  }, [])

  const handleRemoveFriend = async friendId => {
    const result = await removeFriend(friendId)
    if (result) {
      setFriends(prevFriends =>
        prevFriends.filter(friend => friend.id !== friendId)
      )
    }
  }

  return (
    <div>
      <h1>Friend Component</h1>
      {/*if friends is empty, say the friends is empty */}
      {friends.length === 0 ? (
        <p>You don't have any friends.</p>
      ) : (
        friends.map(friend => (
          <div key={friend.id}>
            <p>Username: {friend.username}</p>
            <p>Email: {friend.email}</p>
            <button onClick={() => handleRemoveFriend(friend.id)}>
              Remove Friend
            </button>
          </div>
        ))
      )}
    </div>
  )
}

export default FriendComponent

