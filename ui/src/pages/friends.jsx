import React from 'react'
import { useState, useEffect } from 'react'
import NavBar from '../components/NavBar'
import FriendComponent from './../components/FriendComponent'
import { getFriendsFromCurrentUser } from '../services/friends'

const Friends = () => {
  const [friends, setFriends] = useState([])

  useEffect(() => {
    const fetchFriends = async () => {
      const friendsData = await getFriendsFromCurrentUser()
      if (Array.isArray(friendsData)) {
        setFriends(friendsData)
      }
    }
    fetchFriends()
  }, [])

  return (
    <div>
      <NavBar />
      {console.log(friends)}
      {friends.map(friend => (
        <FriendComponent key={friend.user_id} friendId={friend.user_id} />
      ))}
    </div>
  )
}

export default Friends
