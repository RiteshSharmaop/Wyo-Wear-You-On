import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from Chrome storage on mount
  useEffect(() => {
    chrome.storage.local.get(["user", "isLoggedIn"], (result) => {
      if (result.user) {
        setUser(result.user);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setIsLoading(false);
    });
  }, []);

  // Login function
  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    chrome.storage.local.set({
      user: userData,
      isLoggedIn: true,
    });
  };

  // Signup function
  const signup = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    chrome.storage.local.set({
      user: userData,
      isLoggedIn: true,
    });
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    chrome.storage.local.remove(["user", "isLoggedIn"]);
  };

  // Update user function
  const updateUser = (updatedUserData) => {
    const newUserData = { ...user, ...updatedUserData };
    setUser(newUserData);
    chrome.storage.local.set({
      user: newUserData,
    });
  };

  const value = {
    user,
    isLoggedIn,
    isLoading,
    login,
    signup,
    logout,
    updateUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
