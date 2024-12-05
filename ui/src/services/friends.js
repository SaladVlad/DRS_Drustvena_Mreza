import { getUserIdFromToken } from './users'
import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

process.env.ENGINE_URL = process.env.ENGINE_URL || 'http://localhost:5000'

export const getFriendsFromCurrentUser = async () => {
  try {
    const user_id = await getUserIdFromToken()
    if (!user_id) {
      console.error('User ID not found in token')
      return null
    }
    const response = await axios.get(
      `${process.env.ENGINE_URL}/api/friends/user_id=${user_id}`
    )
    console.log('Fetched friends:', response.data.friends)
    return response.data.friends
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
      return null
    }
    const response = await axios.post(
      `${process.env.ENGINE_URL}/api/friends/user_id=${user_id}&friend_id=${friend_id}`
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
      return null
    }
    const response = await axios.delete(
      `${process.env.ENGINE_URL}/api/friends/user_id=${user_id}&friend_id=${friend_id}`
    )
    console.log('Removed friend:', response.data)
    return response.data
  } catch (error) {
    console.error(error)
    return null
  }
}

export const respondToFriendRequest = async (friend_id, status) => {
  try {
    const user_id = await getUserIdFromToken()
    if (!user_id || !friend_id || !status) {
      console.error('User ID, friend ID, and status are all required')
      return null
    }
    const response = await axios.post(
      `${process.env.ENGINE_URL}/api/friends/user_id=${user_id}&friend_id=${friend_id}&status=${status}`
    )
    console.log('Responded to friend request:', response.data)
    return response.data
  } catch (error) {
    console.error(error)
    return null
  }
}


export const getPendingRequests = async () => {
  try {
    const user_id = await getUserIdFromToken()
    if (!user_id) {
      console.error('User ID not found in token')
      return null
    }
    const response = await axios.get(
      `${process.env.ENGINE_URL}/api/friends/pending/user_id=${user_id}`
    )
    console.log('Fetched pending requests:', response.data)
    return response.data
  } catch (error) {
    console.error(error)
    return null
  }
}

