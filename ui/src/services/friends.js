import { getUserIdFromToken } from './auth'
import axios from 'axios'

export const getFriendsFromCurrentUser = async () => {
  try {
    const user_id = await getUserIdFromToken()
    if (!user_id) {
      console.error('User ID not found in token')
      return null // Handle missing or invalid user ID
    }
    const response = await axios.get(
      `http://localhost:5000/api/users/${user_id}/friends`
    )
    console.log('Fetched friends:', response.data)
    return response.data
  } catch (error) {
    console.error(error)
    return null
  }
}

export const addFriend = async friend_id => {
  try {
    const user_id = await getUserIdFromToken()
    if (!user_id) {
      console.error('User ID not found in token')
      return null // Handle missing or invalid user ID
    }
    const response = await axios.post(
      `http://localhost:5000/api/users/${user_id}/friends`,
      { friend_id }
    )
    console.log('Added friend:', response.data)
    return response.data
  } catch (error) {
    console.error(error)
    return null
  }
}

export const removeFriend = async friend_id => {
  try {
    const user_id = await getUserIdFromToken()
    if (!user_id) {
      console.error('User ID not found in token')
      return null // Handle missing or invalid user ID
    }
    const response = await axios.delete(
      `http://localhost:5000/api/users/${user_id}/friends/${friend_id}`
    )
    console.log('Removed friend:', response.data)
    return response.data
  } catch (error) {
    console.error(error)
    return null
  }
}


