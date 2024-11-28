import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import { fetchUsers, fetchBlockedUsers, unblockUser } from '../services/users'
import { checkAdminStatus } from '../services/auth'
import AdminDashboard from '../components/AdminDashboard'
import UserDashboard from '../components/UserDashboard'

const Dashboard = () => {
  const [users, setUsers] = useState([])
  const [blockedUsers, setBlockedUsers] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Check admin status and fetch data
    const initializeDashboard = async () => {
      const adminStatus = await checkAdminStatus()
      setIsAdmin(adminStatus)

      const fetchedUsers = await fetchUsers()
      setUsers(fetchedUsers)

      if (adminStatus) {
        const fetchedBlockedUsers = await fetchBlockedUsers()
        setBlockedUsers(fetchedBlockedUsers)
      }
    }

    initializeDashboard()
  }, [])

  const handleUnblock = async (userId) => {
    const response = await unblockUser(userId)
    if (response?.success) {
      // Update the blockedUsers list by filtering out the unblocked user
      setBlockedUsers((prevBlockedUsers) =>
        prevBlockedUsers.filter((user) => user.id !== userId)
      )
    } else {
      console.error('Failed to unblock the user')
    }
  }

  return (
    <div>
      <NavBar />
      {isAdmin ? (
        <AdminDashboard
          users={users}
          blockedUsers={blockedUsers}
          onUnblock={handleUnblock}
        />
      ) : (
        <UserDashboard users={users} />
      )}
    </div>
  )
}

export default Dashboard