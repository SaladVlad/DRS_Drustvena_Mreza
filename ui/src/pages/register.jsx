import React from 'react'
import RegisterForm from '../components/RegisterForm'
import NavBar from '../components/NavBar'
const RegisterPage = () => {
  return (
    <div>
      <div>
        <NavBar />
      </div>
      <div
        className='d-flex justify-content-center align-items-center vh-100'
        style={{ background: 'grey', marginTop: '3rem' }}
      >
        <div className='w-25 bg-white rounded p-3 m-auto'>
          <h1 className='text-center'>Register</h1>
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
