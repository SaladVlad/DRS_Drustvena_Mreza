import axios from 'axios';
import { io } from 'socket.io-client';
const token = sessionStorage.getItem('token'); // retrieve token from storage
const API_BASE_URL = 'http://localhost:5000'; // Backend URL
axios.defaults.headers.common = { Authorization: `Bearer ${token}` }

// Funkcija za dohvatanje svih objava sa statusom 'pending'
export const fetchPendingPosts = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/admin/pendingposts');
        return response.data;
    } catch (error) {
        console.error("Error fetching pending posts:", error);
        throw error;
    }
};


export const approvePost = async (postId) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/admin/approvepost/${postId}`);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  
export const rejectPost = async (postId) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/admin/rejectpost/${postId}`);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

// Funkcija za povezivanje na WebSocket
export const connectSocket = () => {
  const socket = io(API_BASE_URL, {
    transports: ['websocket', 'polling'], // Podrška za različite transportne protokole
    withCredentials: true,               // Omogućava slanje kolačića ako su potrebni
  });
  return socket;
};