import React, { useState } from 'react'

const UserCreationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    address: '',
    city: '',
    country: '',
    phoneNumber: '',
    email: '',
    password: '',
    username: ''
  })

  const handleChange = e => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = e => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: '400px', margin: '0 auto' }}
    >
      {[
        'name',
        'surname',
        'address',
        'city',
        'country',
        'phoneNumber',
        'email',
        'password',
        'username'
      ].map(field => (
        <div
          key={field}
          className='form-group'
          style={{ marginBottom: '10px' }}
        >
          <label
            htmlFor={field}
            style={{ marginRight: '10px', textTransform: 'capitalize' }}
          >
            {field.replace(/([A-Z])/g, ' $1')}:
          </label>
          <input
            id={field}
            type={field === 'password' ? 'password' : 'text'}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            placeholder={`Enter your ${field
              .replace(/([A-Z])/g, ' $1')
              .toLowerCase()}`}
            className='form-control'
          />
        </div>
      ))}
      <div style={{ textAlign: 'center' }}>
        <button type='submit' className='btn btn-primary'>
          Submit
        </button>
      </div>
    </form>
  )
}

export default UserCreationForm
