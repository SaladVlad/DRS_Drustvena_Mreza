import axios from 'axios'
import { io } from 'socket.io-client'
const token = sessionStorage.getItem('token') // retrieve token from storage
axios.defaults.headers.common = { Authorization: `Bearer ${token}` }

// Funkcija za dohvatanje svih objava sa statusom 'pending'
export const fetchPendingPosts = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_ENGINE_URL}/api/admin/pendingposts`
    )
    return response.data
  } catch (error) {
    console.error('Error fetching pending posts:', error)
    throw error
  }
}

export const approvePost = async postId => {
  try {
    const response = await axios.put(
      `${process.env.REACT_APP_ENGINE_URL}/api/admin/approvepost/${postId}`
    )
    return response.data
  } catch (error) {
    console.error(error)
    return null
  }
}

export const rejectPost = async postId => {
  try {
    const response = await axios.put(
      `${process.env.REACT_APP_ENGINE_URL}/api/admin/rejectpost/${postId}`
    )
    return response.data
  } catch (error) {
    console.error(error)
    return null
  }
}

// Funkcija za povezivanje na WebSocket
export const connectSocket = () => {
  const socket = io(`${process.env.REACT_APP_ENGINE_URL}`, {
    transports: ['websocket', 'polling'], // Podrška za različite transportne protokole
    withCredentials: true // Omogućava slanje kolačića ako su potrebni
  })
  return socket
}
