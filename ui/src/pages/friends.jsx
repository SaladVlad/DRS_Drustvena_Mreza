import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Row, Col } from 'react-bootstrap'
import NavBar from '../components/NavBar'
import UserSearch from '../components/UserSearch'
import FriendComponent from './../components/FriendComponent'
import { getFriendsFromCurrentUser } from '../services/friends'
import { getPendingRequests } from '../services/friends'

const Friends = () => {
  const [friends, setFriends] = useState([])
  const [pendingFriends, setPendingFriends] = useState([])
  const handleSelectUser = (user) => {
    console.log('Selected user:', user);
    // Add functionality, e.g., send a friend request
  };
  const fetchFriends = async () => {
    const friendsData = await getFriendsFromCurrentUser()
    if (Array.isArray(friendsData)) {
      setFriends(friendsData) // Set the array of friend IDs
    }
  }

  const fetchPendingRequests = async () => {
    const pendingFriendsData = await getPendingRequests()
    if (Array.isArray(pendingFriendsData)) {
      setPendingFriends(pendingFriendsData) // Set the array of pending friend IDs
    }
  }

  useEffect(() => {
    fetchFriends()
    fetchPendingRequests()
  }, [])

  const onFriendsChange = () => {
    fetchFriends()
    fetchPendingRequests()
  }

  return (
    <div className='container'>
      <NavBar />
      <Row>
      <UserSearch onSelectUser={handleSelectUser} />
      </Row>
      <h2 className='text-center'>My Friends</h2>
      <Row>
        <Col md={8}>
          <Row>
            {friends.length === 0 ? (
              <Col md={12} className='text-center'>
                <p>No friends found</p>
              </Col>
            ) : (
              friends.map(friendId => (
                <Col md={4} key={friendId}>
                  <FriendComponent
                    friendId={friendId}
                    status={'accepted'}
                    onFriendsChange={onFriendsChange}
                  />
                </Col>
              ))
            )}
          </Row>
        </Col>
        <Col md={4} className='p-3'>
          <h3>Pending</h3>
          <ul className='list-group'>
            {pendingFriends.length === 0 ? (
              <li className='list-group-item text-center'>
                No pending friend requests
              </li>
            ) : (
              pendingFriends.map(pendingFriend => (
                <li className='list-group-item' key={pendingFriend.friend_id}>
                  <FriendComponent
                    friendId={pendingFriend.friend_id}
                    status={'pending'}
                    onFriendsChange={onFriendsChange}
                  />
                </li>
              ))
            )}
          </ul>
        </Col>
      </Row>
    </div>
  )
}

export default Friends
