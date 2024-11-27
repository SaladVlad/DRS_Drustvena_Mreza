import axios from 'axios'

const token = sessionStorage.getItem('token')

axios.defaults.headers.common = { Authorization: `Bearer ${token}` }

export const fetchUsers = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/admin/allusers')
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const fetchUserById = async userId => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/users/${userId}`
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

