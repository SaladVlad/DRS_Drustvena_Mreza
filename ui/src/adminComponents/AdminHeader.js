import React from 'react'
import { Link } from 'react-router-dom'

const AdminHeader = () => {
    return (
        <div>
            <nav>
                <ul>
                    <li><Link to="/usersAdmin">Users</Link></li>
                    <li><Link to="/createNewUserAdmin">Create new user</Link></li>
                    <li><Link to="/postsAdmin">Posts</Link></li>
                    <li><Link to="/friendReqAdmin">Friend</Link></li>
                </ul>
            </nav>
        </div>
    )
};

export default AdminHeader;