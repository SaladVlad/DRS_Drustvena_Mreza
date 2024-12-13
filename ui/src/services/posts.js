import axios from 'axios'
import { getUserIdFromToken } from './users.js'
import { checkAdminStatus } from './auth.js'
const token = sessionStorage.getItem('token')
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

export const fetchAllPosts = async () => {
  if (!token) {
    console.log('No token found. Redirecting to login...')
    window.location.href = '/login'
    return
  }
  try {
    const response = await axios.get('http://localhost:5000/api/posts')
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export const createPost = async formData => {
  if (!token) {
    console.log('No token found. Redirecting to login...')
    window.location.href = '/login'
    return
  }
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
export const fetchUserFeed = async (status = null) => {
  if (!token) {
    console.log('No token found. Redirecting to login...')
    window.location.href = '/login'
    return
  }
  try {
    const user_id = await getUserIdFromToken();
    const queryParams = new URLSearchParams({ user_id, ...(status && { status }) });
    const response = await axios.get(`http://localhost:5000/api/posts/friends?${queryParams}`);
    return response.data.posts;
  } catch (error) {
    console.error(error);
  }
}

export const fetchUserPosts = async () => {
  if (!token) {
    console.log('No token found. Redirecting to login...')
    window.location.href = '/login'
    return
  }
  try {
    const user_id = await getUserIdFromToken()
    const response = await axios.get(
      `http://localhost:5000/api/posts?user_id=${user_id}`
    )
    return response.data.posts
  } catch (error) {
    console.error(error)
  }
}
export const deletePost = async (postId) => {
  if (!token) {
    console.log('No token found. Redirecting to login...')
    window.location.href = '/login'
    return
  }
  try {
    const response = await axios.delete('http://localhost:5000/api/posts', {
      data: { post_id: postId }, // Only pass the post_id
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};
