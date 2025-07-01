import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { getUserIdFromToken } from '../services/users' // Import the helper function

import dotenv from 'dotenv'
dotenv.config()

const token = sessionStorage.getItem('token')
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

const UserSearch = ({ onSelectUser }) => {
  const [query, setQuery] = useState('')
  const [address, setAddress] = useState('')
  const [results, setResults] = useState([])
  const [error, setError] = useState(null)
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [cities, setCities] = useState([])
  const [states, setStates] = useState([])
  const [friendIds, setFriendIds] = useState([]) // IDs of accepted friends
  const [pendingIds, setPendingIds] = useState([]) // IDs of pending requests
  const [currentUserId, setCurrentUserId] = useState(null) // State to hold current user ID

  // Fetch the current user's friends and pending requests
  const fetchFriendsAndPending = async userId => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_ENGINE_URL}/api/friends/user_id=${userId}`,
        {
          params: { include_status: true },
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      const friends = response.data.friends || []

      // Separate accepted friends and pending requests
      const acceptedFriends = friends
        .filter(f => f.status === 'accepted')
        .map(f => f.friend_id)
      const pendingRequests = friends
        .filter(f => f.status === 'pending')
        .map(f => f.friend_id)

      setFriendIds(acceptedFriends) // Set accepted friends
      setPendingIds(pendingRequests) // Set pending requests
    } catch (error) {
      console.error('Error fetching friends or pending requests:', error)
    }
  }

  // Handle user search
  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_ENGINE_URL}/api/users/search`,
        {
          params: { query, address, city, state, currentUserId },
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      setResults(response.data.users || [])
      setError(null)

      // Refresh friends and pending requests
      if (currentUserId) {
        await fetchFriendsAndPending(currentUserId)
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'An error occurred during search.'
      )
      setResults([])
    }
  }

  // Add friend logic
  const handleAddFriend = async friendId => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_ENGINE_URL}/api/friends/user_id=${currentUserId}&friend_id=${friendId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      console.log('Friend request sent:', response.data)

      // Add to pending requests
      setPendingIds(prev => [...prev, friendId])
    } catch (error) {
      console.error('Error sending friend request:', error)
    }
  }

  useEffect(() => {
    const initializeUser = async () => {
      const userId = await getUserIdFromToken() // Get the current user ID from the token
      if (userId) {
        setCurrentUserId(userId)
        await fetchFriendsAndPending(userId) // Fetch friends and pending requests with statuses
      } else {
        console.error('Failed to retrieve current user ID')
      }
    }

    initializeUser()
  }, [])

  useEffect(() => {
    const fetchCitiesAndStates = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_ENGINE_URL}/api/users/locations`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
        setCities(response.data.cities || [])
        setStates(response.data.states || [])
      } catch (error) {
        console.error('Error fetching locations:', error)
      }
    }
    fetchCitiesAndStates()
  }, [])

  return (
    <div className='mb-4'>
      <div className='input-group mb-3'>
        <input
          type='text'
          className='form-control'
          placeholder='Search by username, email, etc.'
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>
      <div className='input-group mb-3'>
        <input
          type='text'
          className='form-control'
          placeholder='Search by address'
          value={address}
          onChange={e => setAddress(e.target.value)}
        />
      </div>
      <div className='input-group mb-3'>
        <select
          className='form-select'
          value={city}
          onChange={e => setCity(e.target.value)}
        >
          <option value=''>All Cities</option>
          {cities.map(city => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>
      <div className='input-group mb-3'>
        <select
          className='form-select'
          value={state}
          onChange={e => setState(e.target.value)}
        >
          <option value=''>All States</option>
          {states.map(state => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>
      <button
        className='btn'
        style={{
          borderRadius: '20px',
          background: 'linear-gradient(315deg, #ffcc70 0%, #ff8177 74%)',
          border: 'none',
          color: '#fff',
          fontWeight: 'bold'
        }}
        onClick={handleSearch}
      >
        Search
      </button>

      {error && <p className='text-danger'>{error}</p>}
      <ul className='list-group'>
        {results.map(user => (
          <li
            key={user.user_id}
            className='list-group-item d-flex justify-content-between align-items-center'
          >
            <span>
              <strong>{user.username}</strong> - {user.email} -{' '}
              {user.first_name} - {user.last_name} - {user.city}
            </span>
            {friendIds.includes(user.user_id) ? (
              <button className='btn btn-sm btn-success' disabled>
                Friends
              </button>
            ) : pendingIds.includes(user.user_id) ? (
              <button className='btn btn-sm btn-warning' disabled>
                Pending
              </button>
            ) : (
              <button
                className='btn btn-sm btn-primary'
                onClick={() => handleAddFriend(user.user_id)}
              >
                Add Friend
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UserSearch
