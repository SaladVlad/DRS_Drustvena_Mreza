import React, { useEffect, useState } from 'react';
import PostCreationForm from '../components/PostCreationForm';
import { fetchUserFeed } from '../services/posts';
import Post from './Post';

const UserDashboard = () => {
  const [posts, setPosts] = useState([]);

  const fetchAllPosts = async () => {
    const approvedPosts = await fetchUserFeed('approved');
    if (approvedPosts) {
      setPosts(approvedPosts);
    }
  };

  useEffect(() => {
    fetchAllPosts(); // Call fetchAllPosts when the component mounts
  }, []); // Empty dependency array ensures it runs only once on mount

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto' }}>
      <PostCreationForm onPostsChange={fetchAllPosts} />
      <h2 className="text-center mt-4 mb-3">User Feed</h2>
      <div>
        {posts.length > 0 ? (
          posts.map(post => (
            <Post
              key={post.post_id}
              post={post}
              onDelete={fetchAllPosts}
              onEdit={(updatedPost) => setPosts(posts.map(p => p.post_id === updatedPost.post_id ? updatedPost : p))}
            />
          ))
        ) : (
          <p className="text-center">No posts available.</p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
