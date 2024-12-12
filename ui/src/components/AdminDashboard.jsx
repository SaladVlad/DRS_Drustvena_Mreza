import React, { useEffect, useState, useRef } from 'react'
import { fetchUsers, fetchBlockedUsers, unblockUser } from '../services/users'
import { createPopper } from '@popperjs/core'

const AdminDashboard = () => {
  const [users, setUsers] = useState([])
  const [blockedUsers, setBlockedUsers] = useState([])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const buttonRef = useRef(null)
  const listRef = useRef(null)

  useEffect(() => {
    const fetchAllUsers = async () => {
      const fetchedUsers = await fetchUsers()
      if (fetchedUsers) {
        setUsers(fetchedUsers)
      }
    }

    const fetchAllBlockedUsers = async () => {
      const blockedUsers = await fetchBlockedUsers()
      if (blockedUsers) {
        setBlockedUsers(blockedUsers)
      }
    }

    fetchAllUsers()
    fetchAllBlockedUsers()
  }, [])

  useEffect(() => {
    if (buttonRef.current && listRef.current) {
      const popper = createPopper(buttonRef.current, listRef.current, {
        placement: 'bottom',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 8]
            }
          }
        ]
      })

      return () => {
        popper.destroy()
      }
    }
  }, [dropdownOpen])

  const onUnblock = async userId => {
    await unblockUser(userId)
    setBlockedUsers(prev => prev.filter(user => user.user_id !== userId))
  }

  return (
    <div className='container mt-5'>
      <h2 className='text-center'>ADMIN PANEL</h2>

      <div className='my-4'>
        <h3>ALL APP USERS</h3>
        <ul className='list-group'>
          {users.map(user => (
            <li key={user.user_id} className='list-group-item'>
              ID: {user.user_id}, Username: {user.username}
            </li>
          ))}
        </ul>
      </div>

      <div className='my-4'>
        <button
          className='btn btn-secondary'
          ref={buttonRef}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          Toggle Blocked Users
        </button>
        <ul
          ref={listRef}
          className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}
          style={{ display: dropdownOpen ? 'block' : 'none' }}
        >
          {blockedUsers.map(user => (
            <li key={user.user_id} className='dropdown-item'>
              ID: {user.user_id}, Username: {user.username}
              <button
                className='btn btn-link'
                onClick={() => onUnblock(user.user_id)}
              >
                Unblock
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default AdminDashboard
