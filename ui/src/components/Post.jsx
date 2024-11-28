import React from 'react'
import { Card } from 'react-bootstrap'

const Post = props => {
  const { post, imageURL } = props
  return (
    <Card className='mb-3'>
      <Card.Body>
        <Card.Title>Post by User with ID: {post.user_id}</Card.Title>
        <Card.Text>{post.content}</Card.Text>
      </Card.Body>
      {post.image && <Card.Img variant='bottom' src={imageURL} />}
    </Card>
  )
}

export default Post
