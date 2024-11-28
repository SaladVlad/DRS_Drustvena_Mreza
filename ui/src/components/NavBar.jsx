import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { checkAdminStatus } from '../services/auth'
import { createPopper } from '@popperjs/core'
import { Spinner } from 'react-bootstrap'

import 'bootstrap/dist/css/bootstrap.min.css'

const NavBar = () => {
  const navigate = useNavigate()
  const [isAdmin, setIsAdmin] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const buttonRef = useRef(null)
  const listRef = useRef(null)

  useEffect(() => {
    const fetchAdminStatus = async () => {
      const status = await checkAdminStatus()
      setIsAdmin(status)
    }
    fetchAdminStatus()
  }, [])

  useEffect(() => {
    if (buttonRef.current && listRef.current) {
      const popper = createPopper(buttonRef.current, listRef.current, {
        placement: 'bottom',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 8]
            }
          }
        ]
      })

      return () => {
        popper.destroy()
      }
    }
  }, [])

  const logOut = () => {
    sessionStorage.removeItem('token')
    console.log('removed token from sessionStorage')
    navigate('/login')
  }

  if (isAdmin === null) {
    return (
      <div style={{ position: 'fixed', top: 0, width: '100%' }}>
        <nav className='navbar navbar-expand-lg navbar-light bg-light'>
          <Link to='/' className='navbar-brand'>
            <i className='fas fa-home'></i>
          </Link>
          <div className='navbar-nav'>
            <span className='nav-item'>
              <Spinner animation='border' size='sm' />
            </span>
          </div>
        </nav>
      </div>
    )
  }

  const items = isAdmin
    ? [
        { name: 'Dashboard', to: '/home' },
        { name: 'Register new user', to: '/register' }
      ]
    : [
        { name: 'Dashboard', to: '/home' },
        { name: 'Friends', to: '/friends' },
        { name: 'Profile', to: '/profile' }
      ]

  return (
    <nav className='navbar navbar-expand-lg navbar-light bg-light'>
      <Link to='/' className='navbar-brand'>
        <i className='fas fa-home'></i>
      </Link>
      <button
        ref={buttonRef}
        className='navbar-toggler'
        type='button'
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-controls='navbarNav'
        aria-expanded={dropdownOpen ? 'true' : 'false'}
        aria-label='Toggle navigation'
        data-bs-toggle='dropdown'
      >
        <span className='navbar-toggler-icon'></span>
      </button>
      <div
        ref={listRef}
        className={`collapse navbar-collapse ${dropdownOpen ? 'show' : ''}`}
        id='navbarNav'
      >
        <ul className='navbar-nav'>
          {items.map(navbarItem => (
            <li className='nav-item' key={navbarItem.to}>
              <Link to={navbarItem.to} className='nav-link'>
                {navbarItem.name}
              </Link>
            </li>
          ))}
          <li className='nav-item'>
            <button className='btn btn-outline-danger' onClick={logOut}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default NavBar

