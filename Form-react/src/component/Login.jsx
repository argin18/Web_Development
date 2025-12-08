import React from 'react'

const Login = () => {
  return (
    <div className='form'>
      <h1>Sign In</h1>
      <form action="">
        <div className="username">
          <label htmlFor="">Username:</label>
          <input type="text" placeholder='e.g: argin18' />
        </div>
        <div className="password">
          <label htmlFor="">Password:</label>
          <input type="password" />
        </div>
        <button className='button' type='submit' >Log in</button>
      </form>
    </div>
  )
}

export default Login
