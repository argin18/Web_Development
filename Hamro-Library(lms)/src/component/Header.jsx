import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PopUp from "./PopUp";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Header = () => {
  const { currentUser, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [logOut, setLogOut] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const navigate = useNavigate();

  // 
  // Add these states with other useState declarations
const [passwordData, setPasswordData] = useState({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});
const [passwordError, setPasswordError] = useState("");
const [passwordSuccess, setPasswordSuccess] = useState("");

// Add this function
const handlePasswordChange = (e) => {
  setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
};

const handleChangePassword = async (e) => {
  e.preventDefault();
  setPasswordError("");
  setPasswordSuccess("");

  if (passwordData.newPassword !== passwordData.confirmPassword) {
    setPasswordError("New password and confirm password do not match");
    return;
  }

  if (passwordData.newPassword.length < 4) {
    setPasswordError("Password must be at least 4 characters long");
    return;
  }

  try {
    const response = await axios.post(
      "http://localhost/copy/api/users/change-password.php",
      {
        userId: currentUser.id,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.data.success) {
      setPasswordSuccess("Password changed successfully!");
      setTimeout(() => {
        setChangePasswordOpen(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }, 2000);
    } else {
      setPasswordError(response.data.error || "Failed to change password");
    }
  } catch (e) {
    console.error("Change password error:", e);
    setPasswordError("Something went wrong. Please try again.");
  }
};

  const openChangePassword = () => {
    setProfileOpen(false);
    setChangePasswordOpen(true);
  };

  const confirmLogout = () => {
    logout();
    setLogOut(false);
    navigate("/startPage/login");
  };

  const openProfile = () => {
    setProfileOpen(true);
  };

  const closeProfile = () => {
    setProfileOpen(false);
  };

  return (
    <>
      <header className="bg-white fixed top-0 left-0 w-full z-50 shadow text-black px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        
        <h1  onClick={() => navigate("/src/pages/Dashboard.jsx")} className="text-3xl cursor-pointer font-bold">Hamro Library</h1>
        {/* Header links */}
        <div className="flex items-center gap-4">
          <span
            className={`text-sm rounded-full px-3 py-1 ${
              currentUser?.role === "admin"
                ? "bg-purple-200 text-purple-800"
                : "bg-green-200 text-green-800"
            }`}
          >
            {currentUser?.role}
          </span>

          <ul className="flex gap-6 text-lg items-center">
            <li className="cursor-pointer hover:underline">
              <Link to="/">Dashboard</Link>
            </li>

            <li
              onClick={openProfile}
              className="cursor-pointer hover:underline"
            >
              Profile
            </li>
            
            <li
              onClick={() => setLogOut(true)}
              className="cursor-pointer hover:underline text-red-600"
            >
              Logout
            </li>
          </ul>
        </div>
      </header>

      {/* Logout Confirmation Popup */}
      {logOut && (
        <PopUp title="Confirm Logout" onclose={() => setLogOut(false)}>
          <p className="mb-6 text-lg">Are you sure you want to logout?</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setLogOut(false)}
              className="cursor-pointer px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={confirmLogout}
              className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </PopUp>
      )}

      {/* Profile Popup */}
      {profileOpen && currentUser && (
        <PopUp title="Profile Details" onclose={closeProfile}>
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Username:</span>{" "}
              {currentUser.username}
            </p>
            <p>
              <span className="font-semibold">Full Name:</span>{" "}
              {currentUser.fullname}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {currentUser.email}
            </p>
           
             
                <button
              onClick={openChangePassword}
              className=" cursor-pointer justify-center  items-center text-white bg-blue-500  p-2 rounded-lg shadow active:scale-95 w-full sm:w-auto"
            >
              Change Password
            </button>
              
            
            <p>
              <span className="font-semibold">Role:</span>
              <span
                className={`capitalize ml-1 px-2 py-1 ${
                  currentUser?.role === "admin"
                    ? "bg-purple-200 text-purple-800"
                    : "bg-green-200 text-green-800"
                } rounded-full text-sm`}
              >
                {currentUser.role}
              </span>
            </p>
          </div>
        </PopUp>
        
      )}
      {/* Change Password Popup */}
{changePasswordOpen && (
  <PopUp title="Change Password" onclose={() => setChangePasswordOpen(false)}>
    <form onSubmit={handleChangePassword} className="space-y-4">
      {passwordError && (
        <div className="bg-red-100 text-red-700 p-2 rounded-lg text-sm">
          {passwordError}
        </div>
      )}
      {passwordSuccess && (
        <div className="bg-green-100 text-green-700 p-2 rounded-lg text-sm">
          {passwordSuccess}
        </div>
      )}

      <div className="grid gap-1">
        <label className="font-semibold">Current Password:</label>
        <input
          required
          type="password"
          name="currentPassword"
          value={passwordData.currentPassword}
          onChange={handlePasswordChange}
          className="border rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="grid gap-1">
        <label className="font-semibold">New Password:</label>
        <input
          required
          type="password"
          name="newPassword"
          value={passwordData.newPassword}
          onChange={handlePasswordChange}
          className="border rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="grid gap-1">
        <label className="font-semibold">Confirm New Password:</label>
        <input
          required
          type="password"
          name="confirmPassword"
          value={passwordData.confirmPassword}
          onChange={handlePasswordChange}
          className="border rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 active:scale-95 transition-all cursor-pointer"
      >
        Change Password
      </button>
    </form>
  </PopUp>
)}
    </>
  );
};

export default Header;
