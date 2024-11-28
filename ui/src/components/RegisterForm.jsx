import React, { useState } from 'react'
import { register } from '../services/users'

const RegisterForm = () => {
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    register({
      name,
      surname,
      address,
      city,
      country,
      phoneNumber,
      email,
      password,
      username
    }).then(data => {
      console.log(data)
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ margin: '0 auto', maxWidth: '300px' }}
    >
      <div className='form-group' style={{ marginBottom: '10px' }}>
        <label htmlFor='name' style={{ marginRight: '10px' }}>
          Name:
        </label>
        <input
          id='name'
          type='text'
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder='Enter your name'
          className='form-control'
        />
      </div>
      <div className='form-group' style={{ marginBottom: '10px' }}>
        <label htmlFor='surname' style={{ marginRight: '10px' }}>
          Surname:
        </label>
        <input
          id='surname'
          type='text'
          value={surname}
          onChange={e => setSurname(e.target.value)}
          placeholder='Enter your surname'
          className='form-control'
        />
      </div>
      <div className='form-group' style={{ marginBottom: '10px' }}>
        <label htmlFor='address' style={{ marginRight: '10px' }}>
          Address:
        </label>
        <input
          id='address'
          type='text'
          value={address}
          onChange={e => setAddress(e.target.value)}
          placeholder='Enter your address'
          className='form-control'
        />
      </div>
      <div className='form-group' style={{ marginBottom: '10px' }}>
        <label htmlFor='city' style={{ marginRight: '10px' }}>
          City:
        </label>
        <input
          id='city'
          type='text'
          value={city}
          onChange={e => setCity(e.target.value)}
          placeholder='Enter your city'
          className='form-control'
        />
      </div>
      <div className='form-group' style={{ marginBottom: '10px' }}>
        <label htmlFor='country' style={{ marginRight: '10px' }}>
          Country:
        </label>
        <input
          id='country'
          type='text'
          value={country}
          onChange={e => setCountry(e.target.value)}
          placeholder='Enter your country'
          className='form-control'
        />
      </div>
      <div className='form-group' style={{ marginBottom: '10px' }}>
        <label htmlFor='phoneNumber' style={{ marginRight: '10px' }}>
          Phone number:
        </label>
        <input
          id='phoneNumber'
          type='text'
          value={phoneNumber}
          onChange={e => setPhoneNumber(e.target.value)}
          placeholder='Enter your phone number'
          className='form-control'
        />
      </div>
      <div className='form-group' style={{ marginBottom: '10px' }}>
        <label htmlFor='email' style={{ marginRight: '10px' }}>
          Email:
        </label>
        <input
          id='email'
          type='email'
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder='Enter your email'
          className='form-control'
        />
      </div>
      <div className='form-group' style={{ marginBottom: '10px' }}>
        <label htmlFor='password' style={{ marginRight: '10px' }}>
          Password:
        </label>
        <input
          id='password'
          type='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder='Enter your password'
          className='form-control'
        />
      </div>
      <div className='form-group' style={{ marginBottom: '10px' }}>
        <label htmlFor='username' style={{ marginRight: '10px' }}>
          Username:
        </label>
        <input
          id='username'
          type='text'
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder='Enter your username'
          className='form-control'
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <button type='submit' className='btn btn-primary'>
          Register
        </button>
      </div>
    </form>
  )
}

export default RegisterForm
