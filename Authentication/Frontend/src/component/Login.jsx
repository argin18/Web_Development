import React from 'react'
import { Link} from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from 'axios'

const Login = () => {
  const {register, handleSubmit,formState:{errors}}=useForm()
const onSubmit=async(data)=>{
try{
  const res=await axios.post("http://localhost:3000/api/auth/login",data,{
  withCredentials:true
})

alert("Login successfully")
}catch(error){
  console.error(error.response.data)
  alert("Unable to login")
}


}

  return (
    <div className='form'>
      <h1>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="username" >
          <label htmlFor="">Username or email:</label>
          <input type="text" placeholder='e.g: argin18' {...register('username',{
            required:true
          })} />{errors.username && <span>username is required..</span>}
        </div>
        <div className="password">
          <label htmlFor="">Password:</label>
          <input type="password" {...register('password',{
            required:true
          })} />{errors.password && <span>password is required..</span>}
        </div>
        <button className='button' type='submit' >Login</button>
      </form>
      <p>I don't have any account <Link className='a' to="/signup">Sign Up</Link></p>
    </div>
  )
}

export default Login
