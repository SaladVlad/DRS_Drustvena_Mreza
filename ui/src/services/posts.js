import axios from 'axios'
import { getUserIdFromToken } from './users.js'
import dotenv from 'dotenv'

dotenv.config()

const token = sessionStorage.getItem('token')
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

export const fetchAllPosts = async () => {
  try {
    const response = await axios.get(`${process.env.ENGINE_URL}/api/posts`)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const createPost = async formData => {
  try {
    const response = await axios.post(
      `${process.env.ENGINE_URL}/api/posts`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data' // Required for file uploads
        }
      }
    )
    return response.data
  } catch (error) {
    throw new Error('Error creating post: ' + error.message)
  }
}

export const fetchUserFeed = async () => {
  try {
    const user_id = await getUserIdFromToken()
    const response = await axios.get(
      `${process.env.ENGINE_URL}/api/posts/friends?user_id=${user_id}`
    )
    return response.data.posts
  } catch (error) {
    console.error(error)
  }
}

export const fetchUserPosts = async () => {
  try {
    const user_id = await getUserIdFromToken()
    const response = await axios.get(`${process.env.ENGINE_URL}/api/posts?user_id=${user_id}`)
    return response.data.posts
  } catch (error) {
    console.error(error)
  }
}

