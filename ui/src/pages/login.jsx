import React from 'react'
import LoginForm from '../components/LoginForm'

const LoginPage = () => {
  return (
    <div
      className='d-flex justify-content-center align-items-center vh-100'
      style={{ background: 'grey' }}
    >
      <div className='w-25 bg-white rounded p-3 m-auto'>
        <h1 className='text-center'>Login</h1>
        <LoginForm />
      </div>
    </div>
  )
}

export default LoginPage
