import axios from 'axios'

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
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      username,
      password
    })
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
    const response = await axios.get('http://localhost:5000/api/auth/isadmin', {
      headers: {
        Authorization: `Bearer ${token}` // Include the JWT token in the Authorization header
      }
    })
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

export const setTokenInHeader = async axiosInstance => {
  axiosInstance.defaults.headers.common = {
    Authorization: `Bearer ${await getTokenFromStorage()}`
  }
}

const getTokenFromStorage = async () => {
  return sessionStorage.getItem('token')
}

export const checkIfBlocked = async () => {
  try {
    const token = await getToken()
    const response = await axios.get(
      'http://localhost:5000/api/auth/isblocked',
      {
        headers: {
          Authorization: `Bearer ${token}` // Include the JWT token in the Authorization header
        }
      }
    )
    if (response.data.is_blocked) {
      console.log('User is blocked:', response.data.is_blocked)
      sessionStorage.removeItem('token')
      window.location.href = '/login' // redirect to login if the user is blocked (kick him out)
    }
    return response.data.is_blocked
  } catch (error) {
    console.error('Error checking if blocked:', error)
    return false
  }
}
