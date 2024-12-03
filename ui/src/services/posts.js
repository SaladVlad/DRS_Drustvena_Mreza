import axios from 'axios'
import { getUserIdFromToken } from './users.js'
const token = sessionStorage.getItem('token')
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

export const fetchAllPosts = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/posts')
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const createPost = async formData => {
  try {
    const response = await axios.post(
      'http://localhost:5000/api/posts',
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
export const fetchUserFeed = async () => {
  try {
    const user_id = await getUserIdFromToken()
    const response = await axios.get(
      `http://localhost:5000/api/posts/friends?user_id=${user_id}`
    )
    return response.data.posts
  } catch (error) {
    console.error(error)
  }
}

export const fetchUserPosts = async () => {
  try {
    //const user_id = await getUserIdFromToken()
    const response = await axios.get(`http://localhost:5000/api/posts/`)
    return response.data
  } catch (error) {
    console.error(error)
  }
}
