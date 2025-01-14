import React, { useState, useEffect } from 'react';
import { fetchUserById, updateUser, changePassword } from '../services/users'; 
import 'bootstrap/dist/css/bootstrap.min.css';

const ProfileInfo = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await fetchUserById();
        if (userData) {
          setUser(userData);
          setFormData(userData);
        } else {
          setError('User not found');
        }
      } catch (error) {
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleSaveChanges = async () => {
    const { created_at, user_id, ...editableData } = formData;

    try {
      const updatedUser = await updateUser(user.user_id, editableData);
      setUser(updatedUser);
      setEditing(false);
    } catch (err) {
      setError('Failed to update user information.');
    }
  };

  const handleChangePassword = async () => {
    setPasswordError('');
    setPasswordSuccess('');
    try {
      await changePassword(user.user_id, passwordData.oldPassword, passwordData.newPassword);
      setPasswordSuccess('Password changed successfully.');
      setPasswordData({ oldPassword: '', newPassword: '' });
    } catch (err) {
      setPasswordError(err.response?.data?.error || 'Failed to change password.');
    }
  };

  if (loading) {
    return (
      <div className='d-flex justify-content-center mt-5'>
        <div className='spinner-border' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='alert alert-danger text-center mt-3' role='alert'>
        {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className='alert alert-warning text-center mt-3' role='alert'>
        No user found.
      </div>
    );
  }

  return (
    <div className='container mt-5'>
      <div className='card shadow-lg rounded-lg'>
        <div className='card-header text-center'
                  style={{
            background: "linear-gradient(315deg, #1fd1f9 0%, #b621fe 74%)",
            color: "#fff",
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
          }}>
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
              <strong>City:</strong>
            </div>
            <div className='col-md-6'>
              {editing ? (
                <input
                  type='text'
                  className='form-control'
                  name='city'
                  value={formData.city || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{user.city || 'N/A'}</p>
              )}
            </div>
          </div>
          <div className='row mb-3'>
            <div className='col-md-6'>
              <strong>State:</strong>
            </div>
            <div className='col-md-6'>
              {editing ? (
                <input
                  type='text'
                  className='form-control'
                  name='state'
                  value={formData.state || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{user.state || 'N/A'}</p>
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
  className="btn me-2"
  style={{
    borderRadius: "20px",
    background: "linear-gradient(315deg, #42e695 0%, #3bb2b8 74%)",
    border: "none",
    color: "#fff",
    fontWeight: "bold",
  }}
  onClick={handleSaveChanges}
>
  Save Changes
</button>
<button
  className="btn"
  style={{
    borderRadius: "20px",
    background: "linear-gradient(315deg, #d7d2cc 0%, #304352 74%)",
    border: "none",
    color: "#fff",
    fontWeight: "bold",
  }}
  onClick={() => setEditing(false)}
>
  Cancel
</button>
            </>
          ) : (
            <button
              className='btn btn-primary'
              style={{
                borderRadius: "20px",
                background: "linear-gradient(315deg, #ffcc70 0%, #ff8177 74%)",
                border: "none",
                color: "#fff",
                fontWeight: "bold",
              }}
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
      <div className="card shadow-lg rounded-lg mt-4">
  <div
    className="card-header text-center"
    style={{
      background: "linear-gradient(315deg, #1fd1f9 0%, #b621fe 74%)",
      color: "#fff",
      borderTopLeftRadius: "10px",
      borderTopRightRadius: "10px",
    }}
  >
    <h2>Change Password</h2>
  </div>
  <div className="card-body">
    {passwordError && (
      <div className="alert alert-danger">{passwordError}</div>
    )}
    {passwordSuccess && (
      <div className="alert alert-success">{passwordSuccess}</div>
    )}
    <div className="mb-3">
      <label className="form-label fw-bold" style={{ color: "#6c757d" }}>
        Old Password
      </label>
      <input
        type="password"
        className="form-control shadow-sm"
        name="oldPassword"
        value={passwordData.oldPassword}
        onChange={handlePasswordChange}
        style={{
          borderRadius: "10px",
          border: "1px solid #ced4da",
        }}
      />
    </div>
    <div className="mb-3">
      <label className="form-label fw-bold" style={{ color: "#6c757d" }}>
        New Password
      </label>
      <input
        type="password"
        className="form-control shadow-sm"
        name="newPassword"
        value={passwordData.newPassword}
        onChange={handlePasswordChange}
        style={{
          borderRadius: "10px",
          border: "1px solid #ced4da",
        }}
      />
    </div>
    <button
      className="btn"
      style={{
        borderRadius: "20px",
        background: "linear-gradient(315deg, #ffcc70 0%, #ff8177 74%)",
        border: "none",
        color: "#fff",
        fontWeight: "bold",
      }}
      onClick={handleChangePassword}
    >
      Change Password
    </button>
  </div>
</div>
</div>
  )
}

export default ProfileInfo
