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
    <div>
      <h1>Profile Posts</h1>
      <ul>
        {posts.map(post => (
          <Post
          key={post.post_id}
          post={post}
          onDelete={handlePostDelete}
          onEdit={handlePostEdit} 
          showDeleteButton={true}
          showEditButton={true}
          />
        ))}
      </ul>
    </div>
  );
};

export default ProfilePosts;
