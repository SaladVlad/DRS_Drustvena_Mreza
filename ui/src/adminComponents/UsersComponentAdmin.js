import React from 'react'
import AdminHeader from './AdminHeader'
import axios from 'axios'
import { useState, useEffect } from 'react'

const UsersComponentAdmin = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const response = await axios.get('http://localhost:5000/admin');
          setUsers(response.data);
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchUsers();
    }, []);

    return(
        <div>
            <AdminHeader />
            <h2>LIST OF ALL APP USERS</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.username}</li>
                ))}
            </ul>
        </div>
    )
};

export default UsersComponentAdmin;