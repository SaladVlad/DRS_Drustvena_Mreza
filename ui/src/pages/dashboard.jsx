import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import { checkAdminStatus } from '../services/auth'
import AdminDashboard from '../components/AdminDashboard'
import UserDashboard from '../components/UserDashboard'

const Dashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Check admin status and fetch data
    const initializeDashboard = async () => {
      const adminStatus = await checkAdminStatus()
      setIsAdmin(adminStatus)
    }

    initializeDashboard()
  }, [])

  // const handleUnblock = async userId => {
  //   const response = await unblockUser(userId)
  //   if (response?.success) {
  //     // Update the blockedUsers list by filtering out the unblocked user
  //     setBlockedUsers(prevBlockedUsers =>
  //       prevBlockedUsers.filter(user => user.id !== userId)
  //     )
  //   } else {
  //     console.error('Failed to unblock the user')
  //   }
  // }

  return (
    <div>
      <NavBar />
      {isAdmin ? <AdminDashboard /> : <UserDashboard />}
    </div>
  )
}

export default Dashboard
