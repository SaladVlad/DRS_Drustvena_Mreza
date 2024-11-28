/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from 'react'
import PostCreationForm from '../components/PostCreationForm'
import { fetchUserFeed } from '../services/posts'

const UserDashboard = () => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchAllPosts = async () => {
      const fetchedPosts = await fetchUserFeed()
      if (fetchedPosts) {
        setPosts(fetchedPosts)
      }
    }

    fetchAllPosts()
  }, [])

  return (
    <div>
      <PostCreationForm />
      <h2>Feed</h2>
      <ul>
        {posts &&
          posts.map(post => (
            <li key={post.post_id}>
              User ID: {post.user_id}, Text: {post.text}, Image:
              {post.image ? (
                <img
                  src={`data:image/jpeg;base64,${post.image}`}
                  alt='post image'
                />
              ) : null}
            </li>
          ))}
      </ul>
    </div>
  )
}

export default UserDashboard
