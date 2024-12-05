import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

export const setToken = async token => {
  try {
    sessionStorage.setItem('token', token)
  } catch (error) {
    console.error('Error setting token:', error)
  }
}

export const getToken = async () => {
  const token = sessionStorage.getItem('token')

  if (!token) {
    console.error('No token found. Redirecting to login...')
    window.location.href = '/login'
    return null
  }
  return token
}

export const login = async (username, password) => {
  try {
    console.log('Engine URL:', process.env.ENGINE_URL)
    const response = await axios.post(
      `${process.env.ENGINE_URL}/api/auth/login`,
      {
        username,
        password
      }
    )
    if (response.status !== 200) {
      console.error('error while logging in')
      return { status: 'ERROR', error: 'Unexpected response status' }
    } else {
      await setToken(response.data.token)
      return { status: 'OK', token: response.data.token }
    }
  } catch (error) {
    console.error('Login error:', error)
    return { status: 'ERROR', error: error.message || 'Login failed' }
  }
}

export const checkAdminStatus = async () => {
  const token = sessionStorage.getItem('token')

  if (!token) {
    console.log('No token present, redirecting to login...')
    window.location.href = '/login' // Redirect to login page
    return false
  }

  try {
    const response = await axios.get(
      `${process.env.ENGINE_URL}/api/auth/isadmin`,
      {
        headers: {
          Authorization: `Bearer ${token}` // Include the JWT token in the Authorization header
        }
      }
    )
    console.log('Admin status:', response.data.is_admin)
    return response.data.is_admin
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized: Redirecting to login...')
      sessionStorage.removeItem('token')
      window.location.href = '/login' // Redirect to login if 401 Unauthorized
    } else if (error.request) {
      console.error('No response from server:', error.request)
    } else {
      console.error('Error setting up request:', error.message)
    }
    return false
  }
}
