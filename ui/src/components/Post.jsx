import React, { useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const Post = ({ post, onDelete, onEdit, showDeleteButton, showEditButton }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [newImage, setNewImage] = useState(null);
  const [tempImageURL, setTempImageURL] = useState(null);
  const [deleteImage, setDeleteImage] = useState(false);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setEditedContent(post.content);
    setNewImage(null);
    setTempImageURL(null);
    setDeleteImage(false); // Reset the delete image flag
  };

  const handleEditSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('post_id', post.post_id);
      formData.append('content', editedContent);
  
      if (newImage) {
        formData.append('new_image', newImage); // Add the new image only if it's selected
      } else if (deleteImage) {
        formData.append('delete_image', true); // Add delete_image flag only if no new image is selected
      }
  
      await axios.put('http://localhost:5000/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      setIsEditing(false);
      if (onEdit) {
        onEdit({ ...post, content: editedContent }); // Notify parent with updated post
      }
    } catch (error) {
      console.error('Error updating post:', error.message);
    }
  };
  const handleDelete = async () => {
    try {
      await axios.delete('http://localhost:5000/api/posts', {
        data: { post_id: post.post_id },
      });
      // Assuming `onDelete` is used to remove the post from the parent component's state
      if (onDelete) onDelete(post.post_id); // Notify parent to update the UI
    } catch (error) {
      console.error('Error deleting post:', error.message);
    }
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setTempImageURL(URL.createObjectURL(file));
      setDeleteImage(false); // Reset delete flag if a new image is chosen
    }
  };
  
  const handleDeleteImage = () => {
    setNewImage(null);
    setTempImageURL(null);
    setDeleteImage(true); // Enable delete flag when deleting image
  };
  const imageURL =
    tempImageURL || (!deleteImage && post.image_data ? `data:${post.image_type};base64,${post.image_data}` : null);

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
              {imageURL && (
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
                  />
                </div>
              )}
              <div className="mt-3">
                <Button
                  variant="danger"
                  onClick={handleDeleteImage}
                  className="me-2"
                  style={{
                    borderRadius: '20px',
                    background: 'linear-gradient(315deg, #ff5c8d 0%, #f0599b 74%)',
                    border: 'none',
                    fontWeight: 'bold',
                  }}
                >
                  Delete Image
                </Button>
                <label className="btn btn-primary" style={{ borderRadius: '20px' }}>
                  Choose Image
                  <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                </label>
              </div>
              <div className="d-flex justify-content-between mt-2">
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
              <Card.Title className="font-weight-bold">
                {post.user_id ? `Post by ${post.username}` : 'Anonymous Post'}
              </Card.Title>
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
                />
              )}
              <div className="d-flex justify-content-end mt-3">
                {showDeleteButton && (
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(post.post_id)} 
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