import React from 'react';
import { Card, Button } from 'react-bootstrap';

const Post = ({ post, onDelete, showDeleteButton }) => {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      onDelete(post.post_id);
    }
  };

  const imageURL = post.image_data
    ? `data:${post.image_type};base64,${post.image_data}`
    : null;

  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>Post by User with ID: {post.user_id}</Card.Title>
        <Card.Text>{post.content}</Card.Text>
        <Card.Text>
          <small>Posted on: {new Date(post.created_at).toLocaleString()}</small>
        </Card.Text>
        {showDeleteButton && (
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        )}
      </Card.Body>
      {imageURL && <Card.Img variant="bottom" src={imageURL} alt="Post Image" />}
    </Card>
  );
};

export default Post;
