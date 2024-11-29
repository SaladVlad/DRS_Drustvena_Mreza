import React, { useState, useEffect } from 'react'
import { fetchUserById, updateUser } from '../services/users'
import 'bootstrap/dist/css/bootstrap.min.css'

const ProfileInfo = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(false) // Track if in edit mode
  const [formData, setFormData] = useState({}) // Form state for edited data

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await fetchUserById()
        if (userData) {
          setUser(userData)
          setFormData(userData) // Initialize form with current user data
        } else {
          setError('User not found')
        }
      } catch (error) {
        setError('Failed to fetch user data')
      } finally {
        setLoading(false)
      }
    }

    getUserData()
  }, [])

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSaveChanges = async () => {
    // Exclude read-only fields from the payload
    const { created_at, user_id, ...editableData } = formData

    try {
      await updateUser(user.user_id, editableData).then(response =>
        setUser(response)
      )
      setEditing(false) // Exit edit mode
    } catch (err) {
      setError('Failed to update user information.')
    }
  }

  if (loading) {
    return (
      <div className='d-flex justify-content-center mt-5'>
        <div className='spinner-border' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='alert alert-danger text-center mt-3' role='alert'>
        {error}
      </div>
    )
  }

  if (!user) {
    return (
      <div className='alert alert-warning text-center mt-3' role='alert'>
        No user found.
      </div>
    )
  }

  return (
    <div className='container mt-5'>
      <div className='card shadow-lg'>
        <div className='card-header bg-primary text-white text-center'>
          <h2>Profile Information</h2>
        </div>
        <div className='card-body'>
          <div className='row mb-3'>
            <div className='col-md-6'>
              <strong>Username:</strong>
            </div>
            <div className='col-md-6'>
              {editing ? (
                <input
                  type='text'
                  className='form-control'
                  name='username'
                  value={formData.username || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{user.username || 'N/A'}</p>
              )}
            </div>
          </div>
          <div className='row mb-3'>
            <div className='col-md-6'>
              <strong>Email:</strong>
            </div>
            <div className='col-md-6'>
              {editing ? (
                <input
                  type='email'
                  className='form-control'
                  name='email'
                  value={formData.email || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{user.email || 'N/A'}</p>
              )}
            </div>
          </div>
          <div className='row mb-3'>
            <div className='col-md-6'>
              <strong>First Name:</strong>
            </div>
            <div className='col-md-6'>
              {editing ? (
                <input
                  type='text'
                  className='form-control'
                  name='first_name'
                  value={formData.first_name || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{user.first_name || 'N/A'}</p>
              )}
            </div>
          </div>
          <div className='row mb-3'>
            <div className='col-md-6'>
              <strong>Last Name:</strong>
            </div>
            <div className='col-md-6'>
              {editing ? (
                <input
                  type='text'
                  className='form-control'
                  name='last_name'
                  value={formData.last_name || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{user.last_name || 'N/A'}</p>
              )}
            </div>
          </div>
          <div className='row mb-3'>
            <div className='col-md-6'>
              <strong>Phone:</strong>
            </div>
            <div className='col-md-6'>
              {editing ? (
                <input
                  type='text'
                  className='form-control'
                  name='phone_number'
                  value={formData.phone_number || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{user.phone_number || 'N/A'}</p>
              )}
            </div>
          </div>
          <div className='row mb-3'>
            <div className='col-md-6'>
              <strong>Address:</strong>
            </div>
            <div className='col-md-6'>
              {editing ? (
                <textarea
                  className='form-control'
                  name='address'
                  value={formData.address || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{user.address || 'N/A'}</p>
              )}
            </div>
          </div>
          <div className='row mb-3'>
            <div className='col-md-6'>
              <strong>Created At:</strong>
            </div>
            <div className='col-md-6'>
              <p>{new Date(user.created_at).toLocaleString() || 'N/A'}</p>
            </div>
          </div>
        </div>
        <div className='card-footer text-center'>
          {editing ? (
            <>
              <button
                className='btn btn-success me-2'
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
              <button
                className='btn btn-secondary'
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              className='btn btn-primary'
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfileInfo
