import React, { useState, useEffect } from 'react'
import { Form, Button, Card, Image, Alert } from 'react-bootstrap'
import { createPost } from '../services/posts'
import { getUserIdFromToken } from '../services/users'

const PostCreationForm = ({ onPostsChange }) => {
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
  const [userId, setUserId] = useState('')

  // State for UI feedback
  const [previewURL, setPreviewURL] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch the user ID from the token when the component mounts
  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserIdFromToken()
      if (id) {
        setUserId(id)
      } else {
        console.error('Unable to fetch user ID from token')
        setError('Could not authenticate user. Please log in again.')
      }
    }
    fetchUserId()
  }, [])

  const resetForm = () => {
    setContent('')
    setImage(null)
    setPreviewURL('')
    setError('')
    // Do not clear success, so the user can see the message
  }

  const handleFileChange = e => {
    const file = e.target.files[0]
    // Clear previous errors
    setError('')
    setSuccess('')

    if (file) {
      const validFormats = ['image/jpeg', 'image/jpg', 'image/png']
      if (validFormats.includes(file.type)) {
        setImage(file)
        setPreviewURL(URL.createObjectURL(file))
      } else {
        setError('Invalid format. Please use .jpg, .jpeg, or .png.')
        setImage(null)
        setPreviewURL('')
      }
    }
  }

  const handleRemoveImage = () => {
    setImage(null)
    setPreviewURL('')
    // Also reset the file input field so the same file can be re-selected
    document.getElementById('image-upload').value = null
  }

  const handleSubmit = async e => {
    e.preventDefault()
    // Clear previous messages
    setError('')
    setSuccess('')

    if (!content.trim() && !image) {
      setError('A post must have either text content or an image.')
      return
    }

    setIsSubmitting(true)

    const formDataToSend = new FormData()
    formDataToSend.append('user_id', userId)
    formDataToSend.append('content', content)
    if (image) {
      formDataToSend.append('image', image)
    }

    try {
      await createPost(formDataToSend)
      setSuccess('Post created successfully and is pending approval!')
      resetForm()
      onPostsChange() // Refresh the post list in the parent dashboard
    } catch (err) {
      console.error('Error creating post:', err)
      setError('Failed to create post. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className='shadow-sm mb-4'>
      <Card.Header as='h5' className='font-weight-bold'>
        Create a New Post
      </Card.Header>
      <Card.Body>
        {error && <Alert variant='danger'>{error}</Alert>}
        {success && <Alert variant='success'>{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId='postContent'>
            <Form.Control
              as='textarea'
              rows={3}
              placeholder={`What's on your mind?`}
              value={content}
              onChange={e => setContent(e.target.value)}
              style={{ borderRadius: '10px' }}
            />
          </Form.Group>

          {/* Image Preview Section */}
          {previewURL && (
            <div className='mt-3 text-center'>
              <Image
                src={previewURL}
                thumbnail
                style={{ maxHeight: '250px', width: 'auto' }}
              />
              <Button
                variant='link'
                className='text-danger d-block mx-auto'
                onClick={handleRemoveImage}
              >
                Remove Image
              </Button>
            </div>
          )}

          <div className='d-flex justify-content-between align-items-center mt-3'>
            {/* Custom File Upload Button */}
            <Form.Label
              htmlFor='image-upload'
              className='btn btn-secondary m-0'
              style={{ borderRadius: '20px' }}
            >
              📷 {image ? 'Change Image' : 'Add Image'}
            </Form.Label>
            <Form.Control
              id='image-upload'
              type='file'
              accept='image/jpeg,image/png'
              onChange={handleFileChange}
              hidden
            />

            {/* Submit Button */}
            <Button
              type='submit'
              disabled={isSubmitting || !userId}
              style={{
                borderRadius: '20px',
                background: 'linear-gradient(315deg, #4e73df 0%, #2e59d9 74%)',
                border: 'none',
                fontWeight: 'bold',
                padding: '10px 25px'
              }}
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default PostCreationForm
