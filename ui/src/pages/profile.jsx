import React from 'react';
import NavBar from '../components/NavBar';
import ProfileInfo from '../components/ProfileInfo';
import ProfilePosts from '../components/ProfilePosts';

const Profile = () => {
  return (
    <div
      className="profile-page"
      style={{
        background: 'linear-gradient(180deg, #f3f4f7, #ffffff)',
        minHeight: '100vh',
        padding: '0 15px',
      }}
    >
      {/* Navigation Bar */}
      <NavBar />

      {/* Main Content */}
      <div
        className="content container mt-4"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Profile Information */}
        <div className="profile-info w-100 mb-4">
          <ProfileInfo />
        </div>

        {/* User's Posts Section */}
        <div className="profile-posts w-100">
          <ProfilePosts />
        </div>
      </div>
    </div>
  );
};

export default Profile;
