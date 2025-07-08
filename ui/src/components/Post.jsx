import React, { useState } from 'react';
import { Card, Button, Form, Dropdown, Image } from 'react-bootstrap';
import { PencilFill, TrashFill, ThreeDotsVertical, Image as ImageIcon, CheckLg, XLg } from 'react-bootstrap-icons';
import axios from 'axios';

// A simple helper function to format the timestamp
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return `${Math.floor(interval)}y`;
  interval = seconds / 2592000;
  if (interval > 1) return `${Math.floor(interval)}mo`;
  interval = seconds / 86400;
  if (interval > 1) return `${Math.floor(interval)}d`;
  interval = seconds / 3600;
  if (interval > 1) return `${Math.floor(interval)}h`;
  interval = seconds / 60;
  if (interval > 1) return `${Math.floor(interval)}m`;
  return `${Math.floor(seconds)}s`;
};

// Custom Dropdown Toggle for the "three-dots" icon
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <Button
    variant="link"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    className="text-secondary p-0"
  >
    <ThreeDotsVertical size={20} />
    {children}
  </Button>
));

const Post = ({ post, onDelete, onEdit, showDeleteButton, showEditButton }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [newImage, setNewImage] = useState(null);
  const [tempImageURL, setTempImageURL] = useState(null);
  const [deleteImage, setDeleteImage] = useState(false);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    // Reset state on toggle
    setEditedContent(post.content);
    setNewImage(null);
    setTempImageURL(null);
    setDeleteImage(false);
  };

  const handleEditSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('post_id', post.post_id);
      formData.append('content', editedContent);

      if (newImage) {
        formData.append('new_image', newImage);
      } else if (deleteImage) {
        formData.append('delete_image', 'true');
      }

      const response = await axios.put('http://localhost:5000/api/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setIsEditing(false);
      // *** IMPORTANT BUG FIX: Use the complete, updated post from the server response ***
      if (onEdit && response.data.post) {
        onEdit(response.data.post);
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
      // The parent component's `onDelete` will refetch all posts, so we just call it.
      if (onDelete) onDelete();
    } catch (error) {
      console.error('Error deleting post:', error.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setTempImageURL(URL.createObjectURL(file));
      setDeleteImage(false);
    }
  };

  const handleRemoveImage = () => {
    setNewImage(null);
    setTempImageURL(null);
    setDeleteImage(true);
  };

  const currentImage = tempImageURL || (!deleteImage && post.image_data ? `data:${post.image_type};base64,${post.image_data}` : null);

  return (
    <Card className="mb-4 shadow-sm">
      {/* Post Header */}
      <Card.Header className="d-flex align-items-center bg-white border-bottom-0">
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#e9ecef',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          marginRight: '12px'
        }}>
          {post.username ? post.username.charAt(0).toUpperCase() : 'A'}
        </div>
        <div className="flex-grow-1">
          <div className="font-weight-bold">{post.username || 'Anonymous'}</div>
          <small className="text-muted">{formatTimestamp(post.created_at)} ago</small>
        </div>
        {(showEditButton || showDeleteButton) && (
          <Dropdown align="end">
            <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components" />
            <Dropdown.Menu>
              {showEditButton && <Dropdown.Item onClick={handleEditToggle}><PencilFill className="me-2" /> Edit</Dropdown.Item>}
              {showDeleteButton && <Dropdown.Item onClick={handleDelete} className="text-danger"><TrashFill className="me-2" /> Delete</Dropdown.Item>}
            </Dropdown.Menu>
          </Dropdown>
        )}
      </Card.Header>

      {/* Post Body */}
      <Card.Body className="pt-0">
        {isEditing ? (
          <Form>
            {/* Text Area for Editing */}
            <Form.Group>
              <Form.Control
                as="textarea"
                rows={4}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="mb-3"
              />
            </Form.Group>
            
            {/* Image Preview and Actions */}
            {currentImage && (
              <div className="mb-3">
                <Image src={currentImage} fluid rounded />
              </div>
            )}
            
            <div className="d-flex justify-content-between">
                <div>
                    <Form.Label htmlFor={`image-upload-${post.post_id}`} className="btn btn-sm btn-outline-secondary me-2">
                        <ImageIcon className="me-1" /> {currentImage ? 'Change' : 'Add'} Image
                    </Form.Label>
                    <Form.Control id={`image-upload-${post.post_id}`} type="file" hidden onChange={handleImageChange} />
                    {currentImage && <Button size="sm" variant="outline-danger" onClick={handleRemoveImage}>Remove Image</Button>}
                </div>

                <div>
                    <Button variant="secondary" onClick={handleEditToggle} className="me-2">
                        <XLg /> Cancel
                    </Button>
                    <Button variant="primary" onClick={handleEditSubmit}>
                        <CheckLg /> Save
                    </Button>
                </div>
            </div>
          </Form>
        ) : (
          <>
            {/* Display Content and Image */}
            <Card.Text style={{ whiteSpace: 'pre-wrap' }}>{post.content}</Card.Text>
            {currentImage && (
              <Card.Img
                variant="bottom"
                src={currentImage}
                alt="Post Image"
                style={{ borderRadius: '15px' }}
              />
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default Post;