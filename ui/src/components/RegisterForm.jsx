import React, { useState } from 'react'
import { register } from '../services/users'

const RegisterForm = () => {
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
  });

  const [errors, setErrors] = useState({});

  const handleChange = e => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
    setErrors(prevState => ({
      ...prevState,
      [id]: ''
    }));
  };

  const validateInputs = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.surname.trim()) newErrors.surname = 'Surname is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email must be valid (e.g., example@mail.com)';
    }
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 4) {
      newErrors.username = 'Username must be at least 4 characters long';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number';
    }
    return newErrors;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    register({
      first_name: formData.name,
      last_name: formData.surname,
      address: formData.address,
      city: formData.city,
      state: formData.country,
      phone_number: formData.phoneNumber,
      email: formData.email,
      password: formData.password,
      username: formData.username
    })
      .then(data => {
        console.log(data);
        setErrors({});
      })
      .catch(error => {
        setErrors({ form: error.message });
      });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ margin: '0 auto', maxWidth: '600px' }}
    >
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <div className="form-group" style={{ marginBottom: '10px' }}>
              <label htmlFor="name">Name:</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>
            <div className="form-group" style={{ marginBottom: '10px' }}>
              <label htmlFor="surname">Surname:</label>
              <input
                id="surname"
                type="text"
                value={formData.surname}
                onChange={handleChange}
                className={`form-control ${errors.surname ? 'is-invalid' : ''}`}
              />
              {errors.surname && <div className="invalid-feedback">{errors.surname}</div>}
            </div>
            <div className="form-group" style={{ marginBottom: '10px' }}>
              <label htmlFor="address">Address:</label>
              <input
                id="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>
          <div className="col">
            <div className="form-group" style={{ marginBottom: '10px' }}>
              <label htmlFor="city">City:</label>
              <input
                id="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="form-group" style={{ marginBottom: '10px' }}>
              <label htmlFor="country">Country:</label>
              <input
                id="country"
                type="text"
                value={formData.country}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="form-group" style={{ marginBottom: '10px' }}>
              <label htmlFor="phoneNumber">Phone number:</label>
              <input
                id="phoneNumber"
                type="text"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>
        </div>
        <div className="form-group" style={{ marginBottom: '10px' }}>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>
        <div className="form-group" style={{ marginBottom: '10px' }}>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
          />
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>
        <div className="form-group" style={{ marginBottom: '10px' }}>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            className={`form-control ${errors.username ? 'is-invalid' : ''}`}
          />
          {errors.username && <div className="invalid-feedback">{errors.username}</div>}
        </div>
        {errors.form && <div className="alert alert-danger">{errors.form}</div>}
        <div style={{ textAlign: 'center' }}>
          <button type="submit" className="btn btn-primary">
            Register
          </button>
        </div>
      </div>
    </form>
  );
};

export default RegisterForm
