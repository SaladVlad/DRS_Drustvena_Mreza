import axios from 'axios'
export const fetchAllPosts = async () => {
  const token = sessionStorage.getItem('token') // Token is stored in sessionStorage
  try {
    const response = await axios.get('http://localhost:5000/api/posts', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  } catch (error) {
    console.error(error)
  }
}

// i need to get all posts from users friends