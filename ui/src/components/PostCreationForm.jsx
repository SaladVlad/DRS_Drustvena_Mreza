import React, { useState, useEffect } from 'react'
import { createPost } from '../services/posts' // assuming this function exists in your services
import { getUserIdFromToken } from '../services/users' // Import the function to get user_id from token

const PostCreationForm = ({ onPostsChange }) => {
  const [formData, setFormData] = useState({
    user_id: '', 
    content: '',
    image: null
  })
  const [imageError, setImageError] = useState('') // State to handle image errors
  const [formError, setFormError] = useState('') // State to handle form-level errors
  const [postStatus, setPostStatus] = useState('') // State to handle post status messages

  // Fetch the user ID from the token when the component mounts
  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await getUserIdFromToken()
      if (userId) {
        setFormData((prevData) => ({
          ...prevData,
          user_id: userId
        }))
      } else {
        console.error('Unable to fetch user ID from token')
      }
    }
    fetchUserId()
  }, [])

  const handleChange = e => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    setFormError('') // Clear form error when the user types
  }

  const handleFileChange = e => {
    const file = e.target.files[0]
    if (file) {
      const validFormats = ['image/jpeg', 'image/jpg', 'image/png']
      if (validFormats.includes(file.type)) {
        setFormData({
          ...formData,
          image: file
        })
        setImageError('') // Clear any previous error
        setFormError('') // Clear form-level error if an image is added
      } else {
        setImageError('Invalid image format. Only .jpg, .jpeg, and .png are allowed.')
        setFormData({
          ...formData,
          image: null
        })
      }
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()

    // Check if the post has at least content or an image
    if (!formData.content.trim() && !formData.image) {
      setFormError('Post cannot be empty. Please provide content or an image.')
      return
    }

    // Prevent submission if there's an image error
    if (imageError) {
      return
    }

    const formDataToSend = new FormData()
    formDataToSend.append('user_id', formData.user_id) 
    formDataToSend.append('content', formData.content)

    // If an image is selected, append it to FormData
    if (formData.image) {
      formDataToSend.append('image', formData.image) // Use 'image' key to match backend
    }

    try {
      // Send the form data to the backend
      await createPost(formDataToSend).then(() => onPostsChange())
      console.log('Post created successfully')

      // Set success message
      setPostStatus('Post created successfully!')
      
      // Reset form to initial state
      setFormData({
        user_id: formData.user_id, // Retain user_id after reset
        content: '',
        image: null
      })
      setImageError('') // Clear any image errors
      setFormError('') // Clear any form-level errors
    } catch (error) {
      console.error('Error creating post:', error)

            // Set error message
      setPostStatus('An error occurred while creating the post. Please try again.')
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='content'>Content</label>
          <textarea
            id='content'
            name='content'
            value={formData.content}
            onChange={handleChange}
            placeholder='Enter content'
            className='form-control'
          />
        </div>
        <div className='form-group'>
          <label htmlFor='image'>Image</label>
          <input
            type='file'
            id='image'
            name='image'
            onChange={handleFileChange}
            className={`form-control ${imageError ? 'is-invalid' : ''}`}
          />
          {imageError && <div className='invalid-feedback'>{imageError}</div>}
        </div>
        {formError && <div className='alert alert-danger'>{formError}</div>}
        <button
          type='submit'
          className='btn btn-primary'
          disabled={!!imageError} // Disable submit if there's an image error
        >
          Submit
        </button>
      </form>

      {/* Display status message */}
      {postStatus && (
        <div
          className={`alert ${postStatus.includes('successfully') ? 'alert-success' : 'alert-danger'}`}
          style={{ marginTop: '20px' }}
        >
          {postStatus}
        </div>
      )}
    </div>
  )
}

export default PostCreationForm
