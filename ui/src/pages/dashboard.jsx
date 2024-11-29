import React, { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import NavBar from '../components/NavBar'
import { checkAdminStatus } from '../services/auth'
import UserDashboard from '../components/UserDashboard'
import AdminDashboard from '../components/AdminDashboard'

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(null) // Track admin status

  useEffect(() => {
    const initializeDashboard = async () => {
      const token = sessionStorage.getItem('token')

      // Redirect to login if no token
      if (!token) {
        console.log('No token found. Redirecting to login...')
        window.location.href = '/login'
        return
      }

      try {
        // Check admin status after confirming the token exists
        const status = await checkAdminStatus()
        setIsAdmin(status)
      } catch (error) {
        console.error('Error during admin check:', error)
      } finally {
        setLoading(false) // Stop loading after the check
      }
    }

    initializeDashboard()
  }, [])

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
