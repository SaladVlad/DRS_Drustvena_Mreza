import React, { useState } from 'react'

const Feed = props => {
  const [posts, setPosts] = useState([])

  setPosts(props.posts)

  return (
    <div>
      <h1>Feed</h1>
      <ul>
        {posts.map(post => (
          <li>
            <div>
              <p>User id:{post.user_id}</p>
              <p>{post.title}</p>
              <p>{post.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Feed
