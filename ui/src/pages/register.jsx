import React from 'react'
import RegisterForm from '../components/RegisterForm'
import NavBar from '../components/NavBar'

const RegisterPage = () => {
  return (
    <div>
      {/* Navbar */}
      <NavBar />

      {/* Main Content */}
      <div
        className='d-flex justify-content-center align-items-center vh-100'
        style={{
          backgroundColor: '#1fd1f9',
          backgroundImage: 'linear-gradient(315deg, #1fd1f9 0%, #b621fe 74%)'
        }}
      >
        <div
          className='w-25 bg-white rounded p-4'
          style={{
            boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)',
            borderRadius: '10px',
            maxWidth: '400px'
          }}
        >
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
