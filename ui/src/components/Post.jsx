import React, { useState } from 'react'; 
import { Card, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const Post = ({ post, onDelete, onEdit, showDeleteButton, showEditButton }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [imageDeleted, setImageDeleted] = useState(false);
  const [currentImageData, setCurrentImageData] = useState(post.image_data); // State for image preview
  const [originalImageData] = useState(post.image_data); // Store the original image data

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset changes when canceling edit mode
      setImageDeleted(false);
      setCurrentImageData(originalImageData); // Reset the image preview
    }
    setIsEditing(!isEditing);
  };

  const handleEditSubmit = async () => {
    try {
      // Make the API call to update the post
      await axios.put('http://localhost:5000/api/posts', {
        post_id: post.post_id,
        content: editedContent,
        delete_image: imageDeleted, // Indicate whether to delete the image
      });

      // Notify parent component about the update
      if (onEdit) {
        onEdit({
          ...post,
          content: editedContent,
          image_data: imageDeleted ? null : originalImageData,
        });
      }

      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error('Error updating post:', error.message);
    }
  };

  const handleDeleteImage = () => {
    setImageDeleted(true);
    setCurrentImageData(null); // Remove the image preview immediately
  };

  const imageURL = currentImageData
    ? `data:${post.image_type};base64,${currentImageData}`
    : null;

  return (
    <Card className="mb-4 shadow-sm rounded-lg">
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
                style={{ borderRadius: '10px' }}
              />
            </Form.Group>
            {imageURL ? (
              <div className="mt-3">
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
                    borderRadius: '8px',
                  }}
                  loading="lazy"
                />
                <Button
                  variant="danger"
                  onClick={handleDeleteImage}
                  className="mt-2"
                  style={{
                    borderRadius: '20px',
                    background: 'linear-gradient(315deg, #ff5c8d 0%, #f0599b 74%)',
                    border: 'none',
                    fontWeight: 'bold',
                  }}
                >
                  Delete Image
                </Button>
              </div>
            ) : (
              <p className="text-muted mt-3">Image has been deleted.</p>
            )}
            <div className="d-flex justify-content-between mt-3">
              <Button
                variant="success"
                onClick={handleEditSubmit}
                style={{
                  borderRadius: '20px',
                  background: 'linear-gradient(315deg, #6e7dff 0%, #6172f3 74%)',
                  border: 'none',
                  fontWeight: 'bold',
                }}
              >
                Save
              </Button>
              <Button
                variant="secondary"
                onClick={handleEditToggle}
                style={{
                  borderRadius: '20px',
                  background: 'linear-gradient(315deg, #d3d3d3 0%, #a2a2a2 74%)',
                  border: 'none',
                  fontWeight: 'bold',
                }}
              >
                Cancel
              </Button>
            </div>
          </Form>
        ) : (
          <>
            <Card.Title className="font-weight-bold">{post.user_id ? `Post by User ${post.user_id}` : 'Anonymous Post'}</Card.Title>
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
                  borderRadius: '8px',
                }}
                loading="lazy"
              />
            )}
            <Card.Text className="text-muted">
              <small>Posted on: {new Date(post.created_at).toLocaleString()}</small>
            </Card.Text>
            <Card.Text>Status: {post.status}</Card.Text>
            <div className="d-flex justify-content-end">
              {showDeleteButton && (
                <Button
                  variant="danger"
                  onClick={() => onDelete(post.post_id)}
                  className="me-2"
                  style={{
                    borderRadius: '20px',
                    background: 'linear-gradient(315deg, #ff5c8d 0%, #f0599b 74%)',
                    border: 'none',
                    fontWeight: 'bold',
                  }}
                >
                  Delete
                </Button>
              )}
              {showEditButton && (
                <Button
                  variant="primary"
                  onClick={handleEditToggle}
                  style={{
                    borderRadius: '20px',
                    background: 'linear-gradient(315deg, #4e73df 0%, #2e59d9 74%)',
                    border: 'none',
                    fontWeight: 'bold',
                  }}
                >
                  Edit
                </Button>
              )}
            </div>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default Post;
