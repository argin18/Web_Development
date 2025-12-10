import React from 'react'
import { Link} from "react-router-dom";
import { useForm } from "react-hook-form";
const Login = () => {
  const {register, handleSubmit,formState:{errors}}=useForm()
const onSubmit=(data)=>{
console.log("Login data", data);

if(data.username==="argin18" && data.password ==="Sumitbhujel"){
  alert("Login successfully");
}else{
  alert("Invalid email or password");
}

}

  return (
    <div className='form'>
      <h1>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="username" >
          <label htmlFor="">Username:</label>
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
