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
    setPosts(posts.filter(post => post.post_id !== postId)); // Remove the deleted post
  };

  return (
    <div>
      <h1>Profile Posts</h1>
      <ul>
        {posts.map(post => (
          <Post
            key={post.post_id}
            post={post}
            onDelete={handlePostDelete}
            showDeleteButton={true} // Ensure delete button is shown here
          />
        ))}
      </ul>
    </div>
  );
};

export default ProfilePosts;
