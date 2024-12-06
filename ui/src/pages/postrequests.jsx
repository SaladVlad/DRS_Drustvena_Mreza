import React, { useEffect, useState, useRef } from 'react';
import { fetchPendingPosts, connectSocket, approvePost, rejectPost } from '../services/adminposts';
import { createPopper } from '@popperjs/core';
import NavBar from '../components/NavBar'

const PostRequestsAdminPage = () => {
  const [pendingPosts, setPendingPosts] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const buttonRef = useRef(null);
  const listRef = useRef(null);

  // useEffect za fetch podataka sa backend-a
  useEffect(() => {
    const fetchAllPendingPosts = async () => {
      const fetchedPendingPosts = await fetchPendingPosts();
      if (fetchedPendingPosts.posts) {
        console.log('Fetched pending posts here:', fetchedPendingPosts.posts);
        setPendingPosts(fetchedPendingPosts.posts);

        // Nakon što su podaci učitani, uspostavi WebSocket vezu
        const socket = connectSocket();
        console.log('Socket connected');

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
            // Proverite da li već postoji post sa istim post_id
            if (prevPosts.some(post => post.post_id === newPost.post_id)) {
              return prevPosts; // Ako postoji, ne dodajemo ga ponovo
            }
            return [...prevPosts, newPost]; // Ako ne postoji, dodajemo ga
          });
        });
        

        // Čišćenje socket konekcije pri unmount-u
        return () => {
          socket.disconnect();
          console.log('Socket disconnected');
        };
      }
    };

    fetchAllPendingPosts();
  }, []); // Ovaj useEffect se pokreće samo pri mount-u komponente

  useEffect(() => {
    if (buttonRef.current && listRef.current) {
      const popper = createPopper(buttonRef.current, listRef.current, {
        placement: 'bottom',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 8]
            }
          }
        ]
      });

      return () => {
        popper.destroy();
      };
    }
  }, [dropdownOpen]);

  const onApprove = async (postId) => {
    await approvePost(postId);
    setPendingPosts((prevPosts) => prevPosts.filter((post) => post.post_id !== postId));
  };

  const onReject = async (postId) => {
    await rejectPost(postId);
    setPendingPosts((prevPosts) => prevPosts.filter((post) => post.post_id !== postId));
  };

  return (
    <div className='container'>
      <NavBar />
      <h2 className='text-center'>PENDING POSTS</h2>

      <div className='my-4'>
        <button
          className='btn btn-secondary'
          ref={buttonRef}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          Toggle Pending Posts
        </button>
        <ul
          ref={listRef}
          className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}
          style={{ display: dropdownOpen ? 'block' : 'none' }}
        >
          {pendingPosts.map((post) => (
            <li key={post.post_id} className='dropdown-item'>
              ID: {post.post_id}, Content: {post.content}, User ID: {post.user_id}
              <button
                className='btn btn-success btn-sm'
                onClick={() => onApprove(post.post_id)}
              >
                Approve
              </button>
              <button
                className='btn btn-danger btn-sm'
                onClick={() => onReject(post.post_id)}
              >
                Reject
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PostRequestsAdminPage;
