import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import background from "../assets/background.jpg";
import qs from "qs";

const SignUp = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({ mode: "onChange" });
  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost/copy/api/auth/signUp.php",qs.stringify(data), // converts JSON to URL-encoded
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    
      );

      console.log("Form submitted successFully..!", response.data);

      if (response.data.message) {
        console.log("Registration Successfull");

        reset();
        navigate("/startPage/login");
      } else {
        console.log(response.data.error);
      }
    } catch (e) {
      console.error("Error:", e);
    }
  };
  return (
    <div
      style={{ backgroundImage: `url(${background})` }}
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
    >
      <div className="bg-white/55 p-8 rounded-2xl shadow-lg w-96">
        <h1 className="text-3xl font-bold text-center mb-6">Sign Up</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          {/* role */}
          <div>
            <p className="mb-2 font-semibold">Select your Role:</p>
            <div className="flex gap-6 items-center">
              <label className="flex items-center text-purple-700 font-semibold text-lg gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="admin"
                  {...register("role", { required: true })}
                  className="cursor-pointer "
                />
                Admin
              </label>
              <label className="flex items-center text-amber-700 font-semibold text-lg gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="librarian"
                  {...register("role", { required: true })}
                  className="cursor-pointer"
                />
                Librarian
              </label>
            </div>
            {errors.role && (
              <span className="text-red-500 text-sm">Role is required.</span>
            )}
          </div>
          {/* Full Name */}
          <div>
            <label className="font-semibold">Full Name:</label>
            <input
              type="text"
              placeholder="e.g: Sumit Bhujel"
              {...register("fullname", {
                required: "Full Name is required",
                minLength: {
                  value: 7,
                  message: "Full name must be at least 7 characters",
                },
              })}
              className="border p-2 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.fullname && (
              <span className="text-red-500 text-sm">
                {errors.fullname.message}
              </span>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="font-semibold">Username:</label>
            <input
              type="text"
              placeholder="e.g: argin18"
              {...register("username", {
                required: "Username is required",
                minLength: {
                  value: 5,
                  message: "Username must be at least 5 characters",
                },
              })}
              className="border p-2 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.username && (
              <span className="text-red-500 text-sm">
                {errors.username.message}
              </span>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="font-semibold">Email:</label>
            <input
              type="email"
              placeholder="e.g: abc@gmail.com"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /\S+@\S+\.\S+/, message: "Email is invalid" },
              })}
              className="border p-2 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="font-semibold">Password:</label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              className="border p-2 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="font-semibold">Confirm Password:</label>
            <input
              type="password"
              {...register("cPassword", {
                required: "Confirm password is required",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              className="border p-2 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {errors.cPassword && (
              <span className="text-red-500 text-sm">
                {errors.cPassword.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="bg-green-500 cursor-pointer text-white py-2 rounded-2xl w-full hover:bg-green-600 transition duration-200 mt-2"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link
            to="/startPage/login"
            className="text-orange-600 underline font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
