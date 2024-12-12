import React, { useState, useEffect } from 'react'
import { login } from '../services/auth'
import { useNavigate } from 'react-router-dom'

const LoginForm = props => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (sessionStorage.getItem('token')) {
      navigate('/home')
    }
  }, [navigate])

  const validateInputs = () => {
    if (username.trim() === '') {
      return 'Username is required';
    }
    if (password === '') {
      return 'Password is required';
    }
    if (username.trim().length < 4) {
      return 'Username must be at least 4 characters long';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    if (!/\d/.test(password)) {
      return 'Password must contain at least one number';
    }
    return null; // No validation errors
  };

  const handleLogin = async event => {
    event.preventDefault()
    setError('')

        // Validate inputs
        const validationError = validateInputs();
        if (validationError) {
          setError(validationError);
          return;
        }

    try {
      const response = await login(username, password)
      if (response.status === 'OK') {
        console.log('Login successful, navigating to /home...')
        navigate('/home')
      } else {
        setError('User not found! Please check your credentials')
      }
    } catch (error) {
      setError('An error occurred while logging in')
      console.log(error)
    }
  }

  return (
    <form
      onSubmit={handleLogin}
      style={{ margin: '0 auto', maxWidth: '300px' }}
    >
      <div className='form-group' style={{ marginBottom: '10px' }}>
        <label htmlFor='username' style={{ marginRight: '10px' }}>
          Username:
        </label>
        <input
          id='username'
          type='text'
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder='Enter your username'
          className='form-control'
        />
      </div>
      <div className='form-group' style={{ marginBottom: '10px' }}>
        <label htmlFor='password' style={{ marginRight: '10px' }}>
          Password:
        </label>
        <input
          id='password'
          type='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder='Enter your password'
          className='form-control'
        />
      </div>
      {error && <div className='alert alert-danger'>{error}</div>}
      <div style={{ textAlign: 'center' }}>
        <button type='submit' className='btn btn-primary'>
          Login
        </button>
      </div>
    </form>
  )
}

export default LoginForm
