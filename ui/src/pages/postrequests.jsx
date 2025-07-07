import React, { useEffect, useState } from 'react';
import { fetchPendingPosts, connectSocket, approvePost, rejectPost } from '../services/adminposts';
import NavBar from '../components/NavBar';

const PostRequestsAdminPage = () => {
  const [pendingPosts, setPendingPosts] = useState([]);

  useEffect(() => {
    let socket;

    const fetchAllPendingPosts = async () => {
      try {
        const fetchedPendingPosts = await fetchPendingPosts();
        if (fetchedPendingPosts.posts) {
          setPendingPosts(fetchedPendingPosts.posts);
        }

        // Pokretanje socket konekcije
        socket = connectSocket();

        socket.on('connect', () => {
          console.log('Socket connected');
        });
        socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
        });
        socket.on('disconnect', () => {
          console.log('Socket disconnected');
        });
        socket.on('error', (error) => {
          console.error('Socket error:', error);
        });

        socket.on('new_post_pending', (newPost) => {
          console.log('Primljen novi post:', newPost);
          setPendingPosts((prevPosts) => {
            if (prevPosts.some(post => post.post_id === newPost.post_id)) {
              return prevPosts;
            }
            return [...prevPosts, newPost];
          });
        });

      } catch (error) {
        console.error('Error loading pending posts:', error);
      }
    };

    fetchAllPendingPosts();

    return () => {
      if (socket) {
        socket.disconnect();
        console.log('Socket disconnected');
      }
    };
  }, []);

  const onApprove = async (postId) => {
    await approvePost(postId);
    setPendingPosts((prevPosts) => prevPosts.filter((post) => post.post_id !== postId));
  };

  const onReject = async (postId) => {
    await rejectPost(postId);
    setPendingPosts((prevPosts) => prevPosts.filter((post) => post.post_id !== postId));
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(315deg, #1fd1f9 0%, #b621fe 74%)',
        color: '#333',
      }}
    >
      <NavBar />
      <div
        style={{
          padding: '20px',
          maxWidth: '1200px',
          margin: '0 auto',
          boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#fff',
          borderRadius: '15px',
          marginTop: '40px',
        }}
      >
        <h2 className="text-center">PENDING POSTS</h2>

        {pendingPosts.length === 0 ? (
          <p className="text-center mt-4">No pending posts at the moment.</p>
        ) : (
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              marginTop: '20px',
            }}
          >
            {pendingPosts.map((post) => (
              <li
                key={post.post_id}
                className="d-flex justify-content-between align-items-center"
                style={{
                  marginBottom: '10px',
                  padding: '15px',
                  background: '#f9f9f9',
                  borderRadius: '10px',
                  border: '1px solid #ddd',
                }}
              >
                <span>
                  <strong>ID:</strong> {post.post_id}, <strong>Content:</strong> {post.content}, <strong>User ID:</strong> {post.user_id}
                </span>
                <span>
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => onApprove(post.post_id)}
                    style={{ borderRadius: '20px', fontWeight: 'bold' }}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onReject(post.post_id)}
                    style={{ borderRadius: '20px', fontWeight: 'bold' }}
                  >
                    Reject
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PostRequestsAdminPage;
