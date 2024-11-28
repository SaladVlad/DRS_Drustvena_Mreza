import React, { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import NavBar from '../components/NavBar'
import { checkAdminStatus } from '../services/auth'
import UserDashboard from '../components/UserDashboard'
import AdminDashboard from '../components/AdminDashboard' // Add the admin dashboard component

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(null) // Track admin status

  useEffect(() => {
    // Simulate checking admin status
    const initializeDashboard = async () => {
      // Assuming `checkAdminStatus` is a function that fetches the admin status
      const status = await checkAdminStatus() // This should return true/false
      setIsAdmin(status)
      setLoading(false)
    }

    initializeDashboard()
  }, []) // Empty dependency array means this runs once when component mounts

  // Show loading spinner until admin status is fetched
  if (loading) {
    return (
      <div
        className='d-flex justify-content-center align-items-center'
        style={{ minHeight: '100vh' }}
      >
        <Spinner animation='border' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </Spinner>
      </div>
    )
  }

  return (
    <div>
      <NavBar /> {/* Always show NavBar */}
      {/* Conditionally render the correct dashboard based on the admin status */}
      {isAdmin ? (
        <AdminDashboard /> // Show Admin Dashboard for admin users
      ) : (
        <UserDashboard /> // Show User Dashboard for non-admin users
      )}
    </div>
  )
}

export default Dashboard
