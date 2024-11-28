import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { popper } from '@popperjs/core'
import NavBar from '../components/NavBar'
import FriendComponent from './../components/FriendComponent'
import { getFriendsFromCurrentUser } from '../services/friends'

const Friends = () => {
  const [friends, setFriends] = useState([])

  useEffect(() => {
    const fetchFriends = async () => {
      const friendsData = await getFriendsFromCurrentUser()
      if (Array.isArray(friendsData)) {
        setFriends(friendsData) // Set the array of friend IDs
      }
    }
    fetchFriends()
  }, [])

  return (
    <div className='container'>
      <NavBar />
      <h2 className='text-center'>My Friends</h2>
      <div className='row'>
        {friends.length === 0 ? (
          <div className='col-md-12 text-center'>
            <p>No friends found</p>
          </div>
        ) : (
          friends.map(friendId => (
            <div className='col-md-4' key={friendId}>
              <FriendComponent friendId={friendId} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Friends
