import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { checkAdminStatus } from '../services/auth';
import { createPopper } from '@popperjs/core';
import { Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const NavBar = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const buttonRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    const fetchAdminStatus = async () => {
      const status = await checkAdminStatus();
      setIsAdmin(status);
    };
    fetchAdminStatus();
  }, []);

  useEffect(() => {
    if (buttonRef.current && listRef.current) {
      const popper = createPopper(buttonRef.current, listRef.current, {
        placement: 'bottom',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 8],
            },
          },
        ],
      });

      return () => {
        popper.destroy();
      };
    }
  }, []);

  const logOut = () => {
    sessionStorage.removeItem('token');
    console.log('removed token from sessionStorage');
    navigate('/login');
  };

  if (isAdmin === null) {
    return (
      <div style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000 }}>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <Link to="/" className="navbar-brand">
            <img
              src={require('../assets/logo.png')}
              alt="Logo"
              style={{
                height: '40px',
                width: 'auto',
                marginLeft: '10px',
              }}
            />
          </Link>
          <div className="navbar-nav">
            <span className="nav-item">
              <Spinner animation="border" size="sm" />
            </span>
          </div>
        </nav>
      </div>
    );
  }

  const items = isAdmin
    ? [
        { name: 'Dashboard', to: '/home' },
        { name: 'Register new user', to: '/register' },
        { name: 'Requests for posting', to: '/postrequests' },
      ]
    : [
        { name: 'Dashboard', to: '/home' },
        { name: 'Friends', to: '/friends' },
        { name: 'Profile', to: '/profile' },
      ];

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'linear-gradient(315deg, #1fd1f9 0%, #b621fe 74%)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        padding: '0.8rem 1rem',
      }}
    >
      <Link to="/" className="navbar-brand">
        <img
          src={require('../assets/logo.png')}
          alt="Logo"
          style={{
            height: '40px',
            width: 'auto',
          }}
        />
      </Link>
      <button
        ref={buttonRef}
        className="navbar-toggler"
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-controls="navbarNav"
        aria-expanded={dropdownOpen ? 'true' : 'false'}
        aria-label="Toggle navigation"
        data-bs-toggle="dropdown"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div
        ref={listRef}
        className={`collapse navbar-collapse ${dropdownOpen ? 'show' : ''}`}
        id="navbarNav"
      >
        <ul className="navbar-nav ml-auto">
          {items.map((navbarItem) => (
            <li className="nav-item" key={navbarItem.to}>
              <Link
                to={navbarItem.to}
                className="nav-link"
                style={{
                  color: '#fff', // White text for links
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                }}
              >
                {navbarItem.name}
              </Link>
            </li>
          ))}
          <li className="nav-item">
            <button
              className="btn"
              onClick={logOut}
              style={{
                borderRadius: '25px',
                background: 'linear-gradient(315deg, #1fd1f9 0%, #b621fe 74%)',
                border: 'none',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 'bold',
                padding: '8px 20px',
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
              onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
              onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
