import axios from 'axios'

export const fetchUsers = async () => {
  try {
    const response = await axios.get('http://localhost:5000/admin/allusers')
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const fetchBlockedUsers = async () => {
  try {
    const response = await axios.get('http://localhost:5000/admin/blockedusers')
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const unblockUser = async (userId) => {
  try {
    const response = await axios.post(`http://localhost:5000/admin/unblock/${userId}`)
    return response.data
  } catch (error) {
    console.error(error)
  }
}