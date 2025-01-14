import React, { useState } from 'react';
import { register } from '../services/users';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faPhone, faAddressCard, faCity } from '@fortawesome/free-solid-svg-icons';
import '../styles/registerform.css'; // Import CSS for styling

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
    username: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
    setErrors((prevState) => ({
      ...prevState,
      [id]: '',
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


  const handleSubmit = (e) => {
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
      username: formData.username,
    })
      .then((data) => {
        console.log(data);
        setErrors({});
        setFormData({
          name: '',
          surname: '',
          address: '',
          city: '',
          country: '',
          phoneNumber: '',
          email: '',
          password: '',
          username: '',
        });
      setSuccessMessage('Registration successful!');
      })
      .catch((error) => {
        setErrors({ form: error.message });
      });
  };

  return (
    <div className="register-container">
      {/* Register Label */}
      <h2 className="form-title">Register</h2>
      <form onSubmit={handleSubmit} className="register-form">
        {[
          { id: 'name', placeholder: 'Name', icon: faUser },
          { id: 'surname', placeholder: 'Surname', icon: faUser },
          { id: 'email', placeholder: 'Email', icon: faEnvelope, type: 'email' },
          { id: 'username', placeholder: 'Username', icon: faUser },
          { id: 'password', placeholder: 'Password', icon: faLock, type: 'password' },
          { id: 'phoneNumber', placeholder: 'Phone Number', icon: faPhone },
          { id: 'address', placeholder: 'Address', icon: faAddressCard },
          { id: 'city', placeholder: 'City', icon: faCity },
          { id: 'country', placeholder: 'Country', icon: faCity },
        ].map(({ id, placeholder, icon, type = 'text' }) => (
          <div className="form-group" key={id}>
            <FontAwesomeIcon icon={icon} className="form-icon" />
            <input
              id={id}
              type={type}
              placeholder={placeholder}
              value={formData[id]}
              onChange={handleChange}
              className={`form-input ${errors[id] ? 'is-invalid' : ''}`}
            />
            {errors[id] && <div className="invalid-feedback">{errors[id]}</div>}
          </div>
        ))}
        {errors.form && <div className="alert alert-danger">{errors.form}</div>}
        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}
        <button type="submit" className="submit-button">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
