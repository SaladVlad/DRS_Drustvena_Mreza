import axios from 'axios'

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

export const createPost = async post => {
  try {
    const response = await axios.post('http://localhost:5000/api/posts', post)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

// i need to get all posts from users friends
