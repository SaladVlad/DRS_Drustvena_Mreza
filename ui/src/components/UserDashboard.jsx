/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from 'react'
import PostCreationForm from '../components/PostCreationForm'
import { fetchUserFeed } from '../services/posts'
import Post from './Post'

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
        {posts && posts.map(post => <Post key={post.user_id} post={post} />)}
      </ul>
    </div>
  )
}

export default UserDashboard
