import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./context/ProtectedRoute";

// Pages
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Member from "./pages/Member";
import Issue from "./pages/Issue";
import Return from "./pages/Return";
import Report from "./pages/Report";
import StartPage from "./pages/StartPage";
import UserManage from "./pages/UserManage";

const App = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-2xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/startPage/*" element={<StartPage />} />

      {/* Admin & Librarian Both Can Access */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={["admin", "librarian"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      
      {/* Books - Admin Full Access, */}
      <Route
        path="/books"
        element={
          <ProtectedRoute allowedRoles={["admin", "librarian"]}>
            <Books userRole={currentUser?.role} />
          </ProtectedRoute>
        }
      />
      
      {/* Members - Admin Full Access*/}
      <Route
        path="/member"
        element={
          <ProtectedRoute allowedRoles={["admin", "librarian"]}>
            <Member userRole={currentUser?.role} />
          </ProtectedRoute>
        }
      />
      
      {/* Issue/Return - Both Can Access */}
      <Route
        path="/issue"
        element={
          <ProtectedRoute allowedRoles={["admin", "librarian"]}>
            <Issue />
          </ProtectedRoute>
        }
      />
      <Route
        path="/return"
        element={
          <ProtectedRoute allowedRoles={["admin", "librarian"]}>
            <Return />
          </ProtectedRoute>
        }
      />

      {/* Reports - Admin Only */}
      <Route
        path="/report"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Report />
          </ProtectedRoute>
        }
      />

      <Route 
  path="/userManage" 
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <UserManage />
    </ProtectedRoute>
  } 
/>

      {/* Default redirect for logged-in users */}
      {currentUser && (
        <Route path="*" element={<Navigate to="/" replace />} />
      )}
    </Routes>
  );
};

export default App;

