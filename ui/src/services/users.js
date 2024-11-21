import axios from 'axios'

export const fetchUsers = async () => {
  try {
    const response = await axios.get('http://localhost:5000/admin')
    return response.data
  } catch (error) {
    console.error(error)
  }
}
