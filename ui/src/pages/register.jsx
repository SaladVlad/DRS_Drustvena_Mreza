import React from 'react'
import RegisterForm from '../components/RegisterForm'
const RegisterPage = () => {
  return (
    <div
      className='d-flex justify-content-center align-items-center vh-100'
      style={{ background: 'grey' }}
    >
      <div className='w-25 bg-white rounded p-3 m-auto'>
        <h1 className='text-center'>Register</h1>
        <RegisterForm />
      </div>
    </div>
  )
}

export default RegisterPage
