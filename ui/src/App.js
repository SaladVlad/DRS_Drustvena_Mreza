import './App.css'
import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import LoginPage from './pages/login'
import RegisterPage from './pages/register'
import FriendsPage from './pages/friends'
import ProfilePage from './pages/profile'
import Dashboard from './pages/dashboard'

function App () {
  return (
    <BrowserRouter future={{ v7_startTransition: true }}>
      {/*Routes for the different pages. If it can be reached,
     enter the route to it here*/}
      <Routes>
        <Route exact path='/' element={<LoginPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/home' element={<Dashboard />} />
        <Route path='/friends' element={<FriendsPage />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='*' element={<div>Page not found</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
