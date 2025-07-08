import React, { useEffect, useState } from 'react'
import { fetchUsers, fetchBlockedUsers, unblockUser } from '../services/users'

const AdminDashboard = () => {
  const [users, setUsers] = useState([])
  const [blockedUsers, setBlockedUsers] = useState([])

  useEffect(() => {
    const fetchAllUsers = async () => {
      const fetchedUsers = await fetchUsers()
      if (fetchedUsers) {
        setUsers(fetchedUsers)
      }
    }

    const fetchAllBlockedUsers = async () => {
      const fetchedBlockedUsers = await fetchBlockedUsers()
      if (fetchedBlockedUsers) {
        setBlockedUsers(fetchedBlockedUsers)
      }
    }

    fetchAllUsers()
    fetchAllBlockedUsers()
  }, [])

  const onUnblock = async userId => {
    await unblockUser(userId)
    setBlockedUsers(prev => prev.filter(user => user.user_id !== userId))
  }

  return (
    <div className='container mt-5'>
      <h2 className='text-center'>ADMIN PANEL</h2>

      <div className='my-4'>
        <h3>All App Users</h3>
        <ul className='list-group'>
          {users.map(user => (
            <li key={user.user_id} className='list-group-item'>
              ID: {user.user_id}, Username: {user.username}
            </li>
          ))}
        </ul>
      </div>

      <div className='my-4'>
        <h3>Blocked Users</h3>
        {blockedUsers.length === 0 ? (
          <p className='text-muted'>
            There are no blocked users at the moment.
          </p>
        ) : (
          <ul className='list-group'>
            {blockedUsers.map(user => (
              <li
                key={user.user_id}
                className='list-group-item d-flex justify-content-between align-items-center bg-danger bg-opacity-10'
              >
                <span>
                  ID: {user.user_id}, Username: {user.username}
                </span>
                <button
                  className='btn btn-outline-primary btn-sm'
                  onClick={() => onUnblock(user.user_id)}
                  style={{ borderRadius: '20px', fontWeight: 'bold' }}
                >
                  Unblock
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
