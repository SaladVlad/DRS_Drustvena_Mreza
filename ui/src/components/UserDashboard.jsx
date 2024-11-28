import React from 'react'
import PostCreationForm from '../components/PostCreationForm'

const UserDashboard = ({ users }) => {
  return (
    <div>
      <PostCreationForm />
      <h2>Feed</h2>
      <ul>
        {users &&
          users.map((user) => (
            <li key={user.id}>
              ID: {user.id}, Username: {user.username}
            </li>
          ))}
      </ul>
    </div>
  )
}

export default UserDashboard 