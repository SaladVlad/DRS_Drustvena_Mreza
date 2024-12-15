import React from 'react'
import LoginForm from '../components/LoginForm'

const LoginPage = () => {
  return (
    <div
      className='d-flex justify-content-center align-items-center vh-100'
      style={{         backgroundColor: '#1fd1f9', 
        backgroundImage: 'linear-gradient(315deg, #1fd1f9 0%, #b621fe 74%)'  }}
    >
      <div className='w-25 bg-white rounded p-3 m-auto'>
        <LoginForm />
      </div>
    </div>
  )
}

export default LoginPage
