import React from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import Upload from "./Upload";
import Post from "../component/Post";

const Dashboard = () => {
  const location = useLocation();

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-stone-950/80 backdrop-blur-md border-b border-stone-800">
        <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Brand */}
          <span className="text-amber-400 font-serif font-bold text-xl tracking-tight">
            Pixora
          </span>

          {/* Links */}
          <div className="flex items-center gap-1">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-mono tracking-widest uppercase transition-all duration-200 ${
                location.pathname === "/"
                  ? "bg-amber-400 text-stone-950 font-bold"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
              Home
            </Link>

            <Link
              to="/upload"
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-mono tracking-widest uppercase transition-all duration-200 ${
                location.pathname === "/upload"
                  ? "bg-amber-400 text-stone-950 font-bold"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Upload
            </Link>
          </div>
        </div>
      </nav>

      {/* Page content — offset for fixed navbar */}
      <div className="pt-14 bg-stone-950 min-h-screen">
        <Routes>
          <Route path="/" element={<Post />} />
          <Route path="/upload" element={<Upload />} />
        </Routes>
      </div>
    </>
  );
};

export default Dashboard;
