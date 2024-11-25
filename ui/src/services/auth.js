import axios from 'axios'

export const login = async (username, password) => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      username,
      password
    })
    if (response.status !== 200) {
      console.error('error while logging in')
      return false
    } else {
      sessionStorage.setItem('token', response.data.token)
      return true
    }
  } catch (error) {
    console.error(error)
    return false
  }
}

export const checkAdminStatus = async () => {
  const token = sessionStorage.getItem('token') // Replace with sessionStorage if applicable

  try {
    const response = await axios.get('http://localhost:3000/api/auth/isadmin', {
      headers: {
        Authorization: `Bearer ${token}` // Include the JWT token in the Authorization header
      }
    })

    if (response.data.isAdmin) {
      console.log('User is an admin')
    } else {
      console.log('User is not an admin')
    }
  } catch (error) {
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error('Error status:', error.response.status)
      console.error('Error message:', error.response.data.message)
    } else if (error.request) {
      // No response received
      console.error('No response from server:', error.request)
    } else {
      // Error setting up the request
      console.error('Error setting up request:', error.message)
    }
  }
}
