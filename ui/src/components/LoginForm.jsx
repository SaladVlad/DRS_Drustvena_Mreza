import React, { useState, useEffect } from 'react';
import { login } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/logo.png'; // Import your logo image

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem('token')) {  
      navigate('/home');
    }
  }, [navigate]);

  const validateInputs = () => {
    if (username.trim() === '') return 'Username is required';
    if (password === '') return 'Password is required';
    return null;
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');

    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const response = await login(username, password);
      if (response.status === 'OK') {
        navigate('/home');
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      setError('An error occurred while logging in');
    }
  };

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '0 auto',
        padding: '30px 20px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
      }}
    >
      {/* Circle Logo */}
      <div
  style={{
    width: '80px',
    height: '80px',
    margin: '0 auto 20px',
    borderRadius: '50%',
    background: 'linear-gradient(315deg, #1fd1f9 0%, #b621fe 74%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  }}
>
  <img
    src={logo}
    alt="Logo"
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',  // Change to 'cover' for better fit
    }}
  />
</div>


      {/* Login Label */}
      <h2
        style={{
          marginBottom: '20px',
          fontWeight: '700',
          fontSize: '1.8rem',
          color: '#333',
        }}
      >
        Login
      </h2>

      {/* Login Form */}
      <form onSubmit={handleLogin}>
        {/* Username Field */}
        <div style={{ marginBottom: '20px', position: 'relative' }}>
          <FontAwesomeIcon
            icon={faUser}
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#888',
            }}
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 10px 10px 35px',
              border: 'none',
              borderBottom: '2px solid #ddd',
              outline: 'none',
              fontSize: '16px',
            }}
          />
        </div>

        {/* Password Field */}
        <div style={{ marginBottom: '20px', position: 'relative' }}>
          <FontAwesomeIcon
            icon={faLock}
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#888',
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 10px 10px 35px',
              border: 'none',
              borderBottom: '2px solid #ddd',
              outline: 'none',
              fontSize: '16px',
            }}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div style={{ marginBottom: '15px', color: 'red', fontSize: '14px' }}>
            {error}
          </div>
        )}

        {/* Login Button */}
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px 0',
            borderRadius: '25px',
            background: 'linear-gradient(315deg, #1fd1f9 0%, #b621fe 74%)',
            border: 'none',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'transform 0.2s',
          }}
          onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
          onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
        >
          LOGIN
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
