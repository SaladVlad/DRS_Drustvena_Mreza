import React, { useState, useEffect } from 'react'
import { Card, Button } from 'react-bootstrap'
import { removeFriend } from '../services/friends'
import { fetchUserById, getUserIdFromToken } from '../services/users'
import { createPopper } from '@popperjs/core'

const FriendComponent = ({ friendId }) => {
  const [friend, setFriend] = useState(null)
  const [userId, setUserId] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const buttonRef = React.useRef(null)
  const listRef = React.useRef(null)

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await getUserIdFromToken()
      if (userId) {
        setUserId(userId)
      }
    }
    const fetchFriend = async () => {
      const fetchedFriend = await fetchUserById(friendId)
      if (fetchedFriend) {
        setFriend(prevState => {
          //console.log(fetchedFriend) // Log the updated friend
          return fetchedFriend
        })
      }
    }
    fetchUserId()
    fetchFriend()
  }, [friendId])

  useEffect(() => {
    if (buttonRef.current && listRef.current) {
      const popper = createPopper(buttonRef.current, listRef.current, {
        placement: 'bottom',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 8]
            }
          }
        ]
      })

      return () => {
        popper.destroy()
      }
    }
  }, [dropdownOpen])

  const handleRemoveFriend = async () => {
    const result = await removeFriend(friendId)
    if (result) {
      setFriend(null)
    }
  }

  const toggleDropdown = () => setDropdownOpen(prev => !prev)

  return (
    <Card>
      <Card.Body>
        {friend ? (
          <>
            <Card.Title>Username: {friend.username}</Card.Title>
            <Card.Text>Email: {friend.email}</Card.Text>
            <Button
              onClick={handleRemoveFriend}
              className='mb-3 btn-danger'
              size='sm'
            >
              Remove Friend
            </Button>
          </>
        ) : (
          <p>Friend doesn't exist.</p>
        )}
      </Card.Body>
    </Card>
  )
}

export default FriendComponent
