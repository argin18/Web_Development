import React from 'react'
import {  Route, Routes } from 'react-router-dom'
import SignUp from './SingUp'
import Login from './Login'

const StartPage = () => {
  return (
    <div>
     <Routes>
  <Route path="signup" element={<SignUp />} />
  <Route path="login" element={<Login  />} />
</Routes>

      
    </div>
  )
}

export default StartPage