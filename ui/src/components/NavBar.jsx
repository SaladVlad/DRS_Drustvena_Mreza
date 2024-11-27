import React from 'react'
import { Link } from 'react-router-dom'
import { checkAdminStatus } from '../services/auth'

const NavBar = () => {
  const items = checkAdminStatus()
    ? [
        { name: 'Dashboard', to: '/home' },
        { name: 'Register new user', to: '/register' }
      ]
    : [
        { name: 'Dashboard', to: '/home' },
        { name: 'Friends', to: '/friends' },
        { name: 'Profile', to: '/posts' }
      ]
  return (
    <nav className='navbar navbar-expand navbar-light bg-light'>
      <div className='collapse navbar-collapse' id='navbarNav'>
        <ul className='navbar-nav'>
          {items.map(navbarItem => (
            <li className='nav-item' key={navbarItem.to}>
              <Link to={navbarItem.to} className='nav-link'>
                {navbarItem.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export default NavBar
