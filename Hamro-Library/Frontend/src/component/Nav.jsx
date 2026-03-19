import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Nav = () => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === "admin";

  return (
    <aside className="w-64 min-h-screen bg-green-800 text-white p-5 flex flex-col">
      <h2 className="text-xl font-bold text-gray-400 mb-4">MENU</h2>

      <ul className="space-y-3 text-lg flex-1">
        {/* Common for both roles */}
        <li className="hover:text-blue-300 cursor-pointer transition-colors">
          <Link to="/">Dashboard</Link>
        </li>

        {/* Books - Both can access  */}
        <li className="hover:text-blue-300 cursor-pointer transition-colors">
          <Link to="/books">Books</Link>
        </li>

        {/* Members - Both can access  */}
        <li className="hover:text-blue-300 cursor-pointer transition-colors">
          <Link to="/member">Members</Link>
        </li>

        {/* Common for both roles */}
        <li className="hover:text-blue-300 cursor-pointer transition-colors">
          <Link to="/issue">Issue Books</Link>
        </li>
        <li className="hover:text-blue-300 cursor-pointer transition-colors">
          <Link to="/return">Return Books</Link>
        </li>

        {/* Reports - Admin Only */}
        {isAdmin && (
          <>
            <li className="hover:text-blue-300 cursor-pointer transition-colors">
              <Link to="/userManage">Manage Librarian</Link>
            </li>
            <li className="hover:text-blue-300 cursor-pointer transition-colors">
              <Link to="/report">Reports</Link>
            </li>
          </>
        )}
      </ul>

      {/* User Info */}
      <div className="border-t border-green-600 pt-4 mt-4 text-sm">
        <div className="bg-green-700 p-3 rounded-lg">
          <p className="text-gray-200">Logged in as:</p>
          <p className="font-semibold text-white truncate">
            {currentUser?.username}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                isAdmin
                  ? "bg-purple-200 text-purple-800"
                  : "bg-green-200 text-green-800"
              }`}
            >
              {currentUser?.role}
            </span>
            {!isAdmin && (
              <span className="text-gray-200  text-xs">(View & add Only)</span>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Nav;
