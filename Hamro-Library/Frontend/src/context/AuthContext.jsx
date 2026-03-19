import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load current user from localStorage on app start
  useEffect(() => {
    const initializeAuth = () => {
      const user = JSON.parse(localStorage.getItem("currentUser"));
      if (user) {
        setCurrentUser(user);
      }
      setLoading(false);
    };
    
    initializeAuth();
  }, []);

  const login = (user) => {
    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  const value = {
    currentUser,
    login,
    logout,
    loading
  };

  return (
    // giving value to all children component
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

