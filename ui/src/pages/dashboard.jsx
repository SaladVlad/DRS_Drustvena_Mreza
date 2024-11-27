import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import { fetchUsers, fetchBlockedUsers, unblockUser } from '../services/users'
import { checkAdminStatus } from '../services/auth'
import PostCreationForm from './../components/PostCreationForm'

const Dashboard = () => {
  const [users, setUsers] = useState([])
  const [blockedUsers, setBlockedUsers] = useState([])

  useEffect(() => {
    fetchUsers().then(data => setUsers(data))
    fetchBlockedUsers().then(data => setBlockedUsers(data))
  }, [])

  const handleUnblock = async userId => {
    const response = await unblockUser(userId)
    if (response?.success) {
      // Update the blockedUsers list by filtering out the unblocked user
      setBlockedUsers(prevBlockedUsers =>
        prevBlockedUsers.filter(user => user.id !== userId)
      )
    } else {
      console.error('Failed to unblock the user')
    }
  }

  return (
    <div>
      <NavBar />
      {checkAdminStatus() ? (
        <div>
          <h2>ADMIN PANEL</h2>
          <h2>ALL APP USERS</h2>
          <ul>
            {users &&
              users.map(user => (
                <li key={user.id}>
                  ID: {user.id}, Username: {user.username}
                </li>
              ))}
          </ul>

          <h2>ALL BLOCKED USERS</h2>
          <ul>
            {blockedUsers &&
              blockedUsers.map(user => (
                <li key={user.id}>
                  ID: {user.id}, Username: {user.username}
                  <button onClick={() => handleUnblock(user.id)}>
                    Unblock
                  </button>
                </li>
              ))}
          </ul>
        </div>
      ) : (
        <div>
          <PostCreationForm />
          <h2>Feed</h2>
          <ul>
            {users &&
              users.map(user => (
                <li key={user.id}>
                  ID: {user.id}, Username: {user.username}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Dashboard
