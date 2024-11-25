import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css'

import LoginPage from './pages/login'
import RegisterPage from './pages/register'
import Dashboard from './pages/dashboard'

function App () {
  //const [message, setMessage] = useState('')

  return (
    <BrowserRouter>
      {/*Routes for the different pages. If it can be reached,
     enter the route to it here*/}
      <Routes>
        <Route exact path='/' element={<LoginPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/home' element={<Dashboard />} />
        <Route path='*' element={<div>Page not found</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
