import React, { useState } from 'react'
import { createPost } from '../services/posts' // assuming this function exists in your services

const PostCreationForm = ({ onPostsChange }) => {
  const [formData, setFormData] = useState({
    user_id: '',
    content: '',
    image: null
  })

  const handleChange = e => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleFileChange = e => {
    setFormData({
      ...formData,
      image: e.target.files[0]
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()

    const formDataToSend = new FormData()
    formDataToSend.append('user_id', formData.user_id)
    formDataToSend.append('content', formData.content)

    // If an image is selected, append it to FormData
    if (formData.image) {
      formDataToSend.append('image', formData.image) // Use 'image' key to match backend
    }

    // Debug: Log the FormData before sending
    console.log([...formDataToSend])

    try {
      // Send the form data to the backend
      await createPost(formDataToSend).then(() => onPostsChange())
      console.log('Post created successfully')
      // Reset form or redirect as needed
      setFormData({
        user_id: '',
        content: '',
        image: null
      })
    } catch (error) {
      console.error('Error creating post:', error)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='user_id'>User ID</label>
          <input
            type='text'
            id='user_id'
            name='user_id'
            value={formData.user_id}
            onChange={handleChange}
            placeholder='Enter User ID'
            className='form-control'
          />
        </div>
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
            className='form-control'
          />
        </div>
        <button type='submit' className='btn btn-primary'>
          Submit
        </button>
      </form>
    </div>
  )
}

export default PostCreationForm
