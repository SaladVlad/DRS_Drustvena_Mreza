import React, { useState } from 'react'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    console.log(`Username: ${username}, Password: ${password}`)
  }

  return (
    <form onSubmit={handleSubmit} style={{ margin: '0 auto', maxWidth: '300px' }}>
      <div className='form-group' style={{ marginBottom: '10px' }}>
        <label htmlFor='username' style={{ marginRight: '10px' }}>Username:</label>
        <input
          id='username'
          type='text'
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder='Enter your username'
          className='form-control'
        />
      </div>
      <div className='form-group' style={{ marginBottom: '10px' }}>
        <label htmlFor='password' style={{ marginRight: '10px' }}>Password:</label>
        <input
          id='password'
          type='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder='Enter your password'
          className='form-control'
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <button type='submit' className='btn btn-primary'>
          Login
        </button>
      </div>
    </form>
  )
}

export default LoginForm

