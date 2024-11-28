import React, { useState } from 'react'
import { createPost } from '../services/posts' // assuming this function exists in your services

const PostCreationForm = () => {
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
    try {
      await createPost({
        user_id: formData.user_id,
        content: formData.content,
        image: formData.image,
        status: 'pending'
      })
      console.log('Post created successfully')
      // Reset form or redirect as needed
    } catch (error) {
      console.error('Error creating post:', error)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='title'>Title</label>
          <input
            type='text'
            id='title'
            name='title'
            value={formData.user_id}
            onChange={handleChange}
            placeholder='Enter title'
            className='form-control'
          />
        </div>
        <div className='form-group'>
          <label htmlFor='body'>Body</label>
          <textarea
            id='body'
            name='body'
            value={formData.text}
            onChange={handleChange}
            placeholder='Enter body text'
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
