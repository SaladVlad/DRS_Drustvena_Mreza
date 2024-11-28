import React from 'react'

const AdminDashboard = ({ users, blockedUsers, onUnblock }) => {
  return (
    <div>
      <h2>ADMIN PANEL</h2>
      <h2>ALL APP USERS</h2>
      <ul>
        {users &&
          users.map((user) => (
            <li key={user.id}>
              ID: {user.id}, Username: {user.username}
            </li>
          ))}
      </ul>

      <h2>ALL BLOCKED USERS</h2>
      <ul>
        {blockedUsers &&
          blockedUsers.map((user) => (
            <li key={user.id}>
              ID: {user.id}, Username: {user.username}
              <button onClick={() => onUnblock(user.id)}>Unblock</button>
            </li>
          ))}
      </ul>
    </div>
  )
}

export default AdminDashboard