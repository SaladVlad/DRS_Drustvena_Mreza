import React, { useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const Post = ({ post, onDelete, onEdit, showDeleteButton, showEditButton }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleEditSubmit = async () => {
    try {
      // Make the API call to update the post
       await axios.put('http://localhost:5000/api/posts', {
        post_id: post.post_id,
        content: editedContent,
      });

      // After a successful update, hide the editing state and notify parent of the change
      setIsEditing(false);
      if (onEdit) {
        onEdit({ ...post, content: editedContent }); // Pass updated post back to parent
      }
    } catch (error) {
      console.error('Error updating post:', error.message);
    }
  };

  const imageURL = post.image_data
    ? `data:${post.image_type};base64,${post.image_data}`
    : null;

  return (
    <Card className="mb-3">
      <Card.Body>
        {isEditing ? (
          <Form>
            <Form.Group>
              <Form.Label>Edit Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />
            </Form.Group>
            <Button variant="success" onClick={handleEditSubmit}>
              Save
            </Button>{' '}
            <Button variant="secondary" onClick={handleEditToggle}>
              Cancel
            </Button>
          </Form>
        ) : (
          <>
            <Card.Title>Post by User with ID: {post.user_id}</Card.Title>
            <Card.Text>{post.content}</Card.Text>
            {imageURL && (
              <Card.Img
                variant="bottom"
                src={imageURL}
                alt="Post Image"
                style={{
                  maxWidth: '100%',
                  maxHeight: '300px',
                  objectFit: 'contain',
                  margin: 'auto',
                  display: 'block',
                }}
                loading="lazy"
              />
            )}
            <Card.Text>
              <small>Posted on: {new Date(post.created_at).toLocaleString()}</small>
            </Card.Text>
            <Card.Text>Status: {post.status}</Card.Text>
            {showDeleteButton && (
              <Button variant="danger" onClick={() => onDelete(post.post_id)}>
                Delete
              </Button>
            )}{' '}
            {showEditButton && (
              <Button variant="primary" onClick={handleEditToggle}>
                Edit
              </Button>
            )}
          </>
        )}
      </Card.Body>

    </Card>
  );
};

export default Post;
