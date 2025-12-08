import React from "react";
import { useForm } from "react-hook-form";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({ mode: "onChange" });
  const password = watch("password");
  const onSubmit = (data) => {
    console.log("Form submitted successFully..!", data);
    reset();
  };
  return (
    <div className="form">
      <h1>SignUp</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Fullname */}
        <div className="fullname">
          <label htmlFor="">Full Name:</label>
          <input type="text" placeholder="e.g: Sumit bhujel" {...register('fullname',{
            required:'Full Name is required..',
            minLength:{
              value : 7,
              message:'Full name must be at least 7 charecters long..'
            }
          })} />{errors.fullname &&(
            <span>{errors.fullname.message}</span>
          )}
        </div>
        {/* username  */}
        <div className="username">
          <label htmlFor="">Username:</label>
          <input
            type="text"
            placeholder="e.g: argin18"
            {...register("username", {
              required: "Username is required",
              minLength: {
                value: 5,
                message: "Username must be at least 5 charecters long..",
              },
            })}
          />
          {errors.username && <span>{errors.username.message}</span>}
        </div>
        {/* email */}
        <div className="email">
          <label htmlFor="">Email:</label>
          <input
            type="email"
            placeholder="e.g: abc@gmail.com"
            {...register("email", {
              required: "Email is required..",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Email is invalid...",
              },
            })}
          />
          {errors.email && <span>{errors.email.message}</span>}
        </div>
        {/* password */}
        <div className="password">
          <label htmlFor="">Password:</label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required..",
              minLength: {
                value: 8,
                message: " Password must be at least 8 charecters long... ",
              },
            })}
          />
          {errors.password && <span>{errors.password.message}</span>}
        </div>
        {/* conform password */}
        <div className="cpassword">
          <label htmlFor="">Conform Password:</label>
          <input
            type="password"
            {...register("cPassword", {
              required: "Confirm password is required..",
              validate: (value) =>
                value === password || "Password do not match..",
            })}
          />
          {errors.cPassword && <span>{errors.cPassword.message}</span>}
        </div>
        {/* submit button */}
        <button className="button" type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
