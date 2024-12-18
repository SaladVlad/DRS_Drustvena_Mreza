import React, { useState, useEffect } from 'react';
import Post from './Post';
import { fetchUserPosts } from '../services/posts';

const ProfilePosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchAllUserPosts = async () => {
      const fetchedPosts = await fetchUserPosts();
      if (fetchedPosts) {
        setPosts(fetchedPosts);
      }
    };
    fetchAllUserPosts();
  }, []);

  const handlePostDelete = (postId) => {
    setPosts(posts.filter(post => post.post_id !== postId));
  };

  const handlePostEdit = (updatedPost) => {
    setPosts(posts.map(post => post.post_id === updatedPost.post_id ? updatedPost : post));
  };

  return (
    <div className="profile-posts-container mt-4">
      <h2
        className="text-center mb-4"
        style={{ color: '#343a40', fontWeight: 'bold' }}
      >
        Profile Posts
      </h2>
      <div
        className="posts-list"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        {posts.length > 0 ? (
          posts.map(post => (
            <Post
              key={post.post_id}
              post={post}
              onDelete={handlePostDelete}
              onEdit={handlePostEdit}
              showDeleteButton={true}
              showEditButton={true}
            />
          ))
        ) : (
          <div
            className="alert alert-info"
            style={{ textAlign: 'center', marginTop: '30px' }}
          >
            No posts available.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePosts;
