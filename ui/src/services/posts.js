import axios from 'axios'
import { getUserIdFromToken } from './users.js'
import { checkIfBlocked } from './auth.js'
import dotenv from 'dotenv'

dotenv.config()

const token = sessionStorage.getItem('token')
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

export const fetchAllPosts = async () => {
  checkIfBlocked()
  if (!token) {
    console.log('No token found. Redirecting to login...')
    window.location.href = '/login'
    return
  }
  try {
    const response = await axios.get(`${process.env.REACT_APP_ENGINE_URL}/api/posts`)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const createPost = async formData => {
  await checkIfBlocked()
  if (!token) {
    console.log('No token found. Redirecting to login...')
    window.location.href = '/login'
    return
  }
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_ENGINE_URL}/api/posts`,
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

// i need to get all posts from users friends
export const fetchUserFeed = async (status = null) => {
  await checkIfBlocked()
  if (!token) {
    console.log('No token found. Redirecting to login...')
    window.location.href = '/login'
    return
  }
  try {
    const user_id = await getUserIdFromToken()
    const queryParams = new URLSearchParams({
      user_id,
      ...(status && { status })
    })
    const response = await axios.get(
      `${process.env.REACT_APP_ENGINE_URL}/api/posts/friends?user_id=${user_id}`
    )
    return response.data.posts
  } catch (error) {
    console.error(error)
  }
}

export const fetchUserPosts = async () => {
  await checkIfBlocked()
  if (!token) {
    console.log('No token found. Redirecting to login...')
    window.location.href = '/login'
    return
  }
  try {
    const user_id = await getUserIdFromToken()
    const response = await axios.get(`${process.env.REACT_APP_ENGINE_URL}/api/posts?user_id=${user_id}`)
    return response.data.posts
  } catch (error) {
    console.error(error)
  }
}

export const updatePost = async formData => {
  await checkIfBlocked()
  if (!token) {
    console.log('No token found. Redirecting to login...')
    window.location.href = '/login'
    return
  }
  try {
    const response = await axios.put(`${process.env.REACT_APP_ENGINE_URL}/api/posts`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    console.error('Error updating post:', error)
    throw error
  }
}

export const deletePost = async postId => {
  await checkIfBlocked()
  if (!token) {
    console.log('No token found. Redirecting to login...')
    window.location.href = '/login'
    return
  }
  try {
    const response = await axios.delete(`${process.env.REACT_APP_ENGINE_URL}/api/posts`, {
      data: { post_id: postId } // Only pass the post_id
    })
    return response.data
  } catch (error) {
    console.error('Error deleting post:', error)
    throw error
  }
}

