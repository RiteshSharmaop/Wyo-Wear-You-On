import { useEffect, useState } from "react";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from Chrome storage on mount
  useEffect(() => {
    chrome.storage.local.get(["user", "isLoggedIn"], (result) => {
      if (result.isLoggedIn && result.user) {
        setUser(result.user);
      }
      setIsLoading(false);
    });
  }, []);

  const login = (userData) => {
    setUser(userData);
    chrome.storage.local.set({
      user: userData,
      isLoggedIn: true,
    });
  };

  const signup = (userData) => {
    setUser(userData);
    chrome.storage.local.set({
      user: userData,
      isLoggedIn: true,
    });
  };

  const logout = () => {
    setUser(null);
    chrome.storage.local.set({
      user: null,
      isLoggedIn: false,
    });
  };

  return {
    user,
    isLoading,
    isLoggedIn: !!user,
    login,
    signup,
    logout,
  };
}
