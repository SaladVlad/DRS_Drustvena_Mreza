import React from 'react'
//import { UseState, useEffect } from 'react'
import NavBar from '../components/NavBar'
import ProfileInfo from '../components/ProfileInfo'
import ProfilePosts from '../components/ProfilePosts'

const Profile = () => {
  return (
    <div className='profile-page'>
      <NavBar />
      <div className='content'>
        <ProfileInfo /> {/* The ProfileInfo component will display user data */}
        <ProfilePosts/>
      </div>
    </div>
  )
}

export default Profile
