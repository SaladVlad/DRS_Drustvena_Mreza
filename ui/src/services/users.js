import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

const token = sessionStorage.getItem('token')

axios.defaults.headers.common = { Authorization: `Bearer ${token}` }

export const getUserIdFromToken = async () => {
  if (!token) return null

  try {
    const decodedToken = jwtDecode(token)
    //console.log('Decoded token:', decodedToken)
    return Number(decodedToken.sub)
  } catch (error) {
    console.error('Invalid token:', error)
    return null
  }
}

export const fetchUsers = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/admin/allusers')
    //console.log('Fetched users:', response.data)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const register = async user => {
  try {
    console.log('Registering user:', user)
    const existingUser = await fetchUserByUsernameOrEmail(
      user.username,
      user.email
    )
    console.log('Existing user:', existingUser)
    if (existingUser) {
      console.error('User with username and email already registered')
      return
    }
    const response = await axios.post('http://localhost:5000/api/users', user, {
      headers: {
        'Content-Type': 'application/json' // Only necessary header for JSON payload
      }
    })
    console.log('Registered user:', response.data)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const fetchUserById = async (user_id = null) => {
  if (!user_id) {
    user_id = await getUserIdFromToken() // Extract the user ID
  }

  if (!user_id) {
    console.error('User ID not found in token')
    return null // Handle missing or invalid user ID
  }

  try {
    const response = await axios.get(
      `http://localhost:5000/api/users/${user_id}` // API call to fetch user details
    )
    //console.log('Fetched user by ID:', response.data)
    return response.data // Return the response data
  } catch (error) {
    console.error('Error fetching user by ID:', error) // Handle errors from the API call
    throw error // Re-throw the error for upstream handling
  }
}

export const fetchUserByUsernameOrEmail = async (
  username = null,
  email = null
) => {
  try {
    const response = await axios.get(
      'http://localhost:5000/api/users/findbyusernameandemail',
      {
        params: { username, email },
        headers: {
          'Content-Type': 'application/json' // This is sufficient for most cases
        }
      }
    )
    console.log('Fetched user by username and email:', response.data)
    return response.data
  } catch (error) {
    // Check for a 404 error and suppress logging for not found errors
    if (error.response && error.response.status === 404) {
      console.log('User not found, 404 response')
      return null // Return null when user is not found
    } else {
      console.error('Error fetching user by username and email:', error)
    }
  }
}

export const fetchBlockedUsers = async () => {
  try {
    const response = await axios.get(
      'http://localhost:5000/api/admin/blockedusers'
    )
    console.log('Fetched blocked users:', response.data)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const unblockUser = async userId => {
  try {
    const response = await axios.post(
      `http://localhost:5000/api/admin/unblock/${userId}`
    )
    console.log('Unblocked user:', response.data)
    return response.data
  } catch (error) {
    console.error(error)
  }
}
export const updateUser = async (userId, updatedData) => {
  try {
    const response = await axios.put(
      `http://localhost:5000/api/users/${userId}`,
      updatedData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    console.log('User updated:', response.data)
    return response.data
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}
