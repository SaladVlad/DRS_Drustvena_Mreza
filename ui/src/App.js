import React, { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import UsersComponentAdmin from './adminComponents/UsersComponentAdmin';

function App () {
  const [message, setMessage] = useState('')



  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route index element={<UsersComponentAdmin />} />
          <Route path='*' element={<div>Page not found</div>} />
        </Routes> 
      </BrowserRouter>
    </div>
  )
}

export default App
