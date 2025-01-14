import './App.css'
import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import LoginPage from './pages/login'
import RegisterPage from './pages/register'
import FriendsPage from './pages/friends'
import ProfilePage from './pages/profile'
import Dashboard from './pages/dashboard'
import PostRequestsAdminPage from './pages/postrequests'

function App () {
  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      {/*Routes for the different pages. If it can be reached,
     enter the route to it here*/}
      <Routes>
        <Route exact path='/' element={<LoginPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/postrequests' element={<PostRequestsAdminPage />} />  {/*stranica za pracenje zahteva */}
        <Route path='/home' element={<Dashboard />} />
        <Route path='/friends' element={<FriendsPage />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='*' element={<div>Page not found</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
