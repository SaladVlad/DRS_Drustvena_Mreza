import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import { fetchUsers } from '../services/users'

const Dashboard = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetchUsers().then(data => setUsers(data))
  }, [])

  return (
    <div>
      <NavBar
        items={[
          { name: 'Home', to: '/home' },
          { name: 'Login', to: '/login' },
          { name: 'Register', to: '/register' }
        ]}
      />
      <h2>LIST OF ALL APP USERS</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
    </div>
  )
}

export default Dashboard
