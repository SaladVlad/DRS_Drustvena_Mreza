import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

const token = sessionStorage.getItem('token')

axios.defaults.headers.common = { Authorization: `Bearer ${token}` }

const getUserIdFromToken = async () => {
  if (!token) return null

  try {
    const decodedToken = jwtDecode(token)
    return Number(decodedToken.sub)
  } catch (error) {
    console.error('Invalid token:', error)
    return null
  }
}

export const fetchUsers = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/admin/allusers')
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const register = async user => {
  try {
    console.log('user', user)
    const existingUser = await fetchUserByUsernameOrEmail(
      user.username,
      user.email
    )
    console.log(existingUser)
    if (existingUser) {
      console.error('User with username and email already registered')
      return
    }
    const response = await axios.post('http://localhost:5000/api/users', user, {
      headers: {
        'Content-Type': 'application/json' // Only necessary header for JSON payload
      }
    })
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
        params: { username, email }, // Use query parameters
        headers: {
          'Content-Type': 'application/json' // This is sufficient for most cases
        }
      }
    )
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const fetchBlockedUsers = async () => {
  try {
    const response = await axios.get(
      'http://localhost:5000/api/admin/blockedusers'
    )
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
    return response.data
  } catch (error) {
    console.error(error)
  }
}
