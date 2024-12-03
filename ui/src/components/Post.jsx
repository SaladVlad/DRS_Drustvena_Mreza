import React from 'react'
import { Card } from 'react-bootstrap'

const Post = props => {
  const { post } = props

  // Check if there is an image and prepare the image URL using base64 data
  const imageURL = post.image_data
    ? `data:${post.image_type};base64,${post.image_data}`
    : null

  return (
    <Card className='mb-3'>
      <Card.Body>
        <Card.Title>Post by User with ID: {post.user_id}</Card.Title>
        <Card.Text>{post.content}</Card.Text>
        <Card.Text><small>Posted on: {new Date(post.created_at).toLocaleString()}</small></Card.Text>
        <Card.Text>Status: {post.status}</Card.Text>
      </Card.Body>
      {/* Conditionally render the image if available */}
      {imageURL && <Card.Img variant='bottom' src={imageURL} alt={post.image_name} />}
    </Card>
  )
}

export default Post
