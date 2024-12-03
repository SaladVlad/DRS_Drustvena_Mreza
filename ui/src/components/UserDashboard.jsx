/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from 'react'
import PostCreationForm from '../components/PostCreationForm'
import { fetchAllPosts, fetchUserFeed } from '../services/posts'
import Post from './Post'

const UserDashboard = () => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchAllPosts = async () => {
      const fetchedPosts = await fetchUserFeed()
      if (fetchedPosts) {
        console.log(fetchedPosts)
        setPosts(fetchedPosts)
      }
    }

    fetchAllPosts()
  }, [])

  return (
    <div>
      <PostCreationForm onPostsChange={fetchAllPosts} />
      <h2>Feed</h2>
      <ul>
        {posts && posts.map(post => <Post key={post.post_id} post={post} />)}
      </ul>
    </div>
  )
}

export default UserDashboard
