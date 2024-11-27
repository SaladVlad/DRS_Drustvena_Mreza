import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { checkAdminStatus } from '../services/auth'

const NavBar = () => {
  const navigate = useNavigate()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const fetchAdminStatus = async () => {
      const status = await checkAdminStatus()
      setIsAdmin(status)
    }
    fetchAdminStatus()
  }, [])

  const logOut = () => {
    sessionStorage.removeItem('token')
    console.log('removed token from sessionStorage')
    navigate('/login')
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
          <li>
            <button onClick={logOut}>Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default NavBar
