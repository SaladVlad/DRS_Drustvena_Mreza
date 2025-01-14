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

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(315deg, #1fd1f9 0%, #b621fe 74%)',
        }}
      >
        <Spinner animation="border" role="status" style={{ color: '#fff' }}>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(315deg, #1fd1f9 0%, #b621fe 74%)',
        color: '#333',
      }}
    >
      <NavBar /> {/* Always show NavBar */}
      <div
        style={{
          padding: '20px',
          maxWidth: '1200px',
          margin: '0 auto',
          boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#fff',
          borderRadius: '15px',
        }}
      >
        {/* Conditionally render the correct dashboard based on the admin status */}
        {isAdmin ? (
          <AdminDashboard /> // Show Admin Dashboard for admin users
        ) : (
          <UserDashboard /> // Show User Dashboard for non-admin users
        )}
      </div>
    </div>
  );
};

export default Dashboard;
