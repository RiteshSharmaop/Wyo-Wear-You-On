import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../../utils/api";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    chrome.storage.local.get(["user", "token"], (result) => {
      if (result?.user) {
        setUser(result.user);
        setIsLoggedIn(!!result.token);
      }
      setIsLoading(false);
    });
  }, []);

  // login -> call backend, store token + user
  const login = async ({ email, password }) => {
    const resp = await api.post("/api/auth/login", { email, password });
    const { token, user: userData } = resp.data;
    setUser(userData);
    setIsLoggedIn(true);
    chrome.storage.local.set({ user: userData, token });
    return { token, user: userData };
  };

  // signup -> call backend, store token + user
  const signup = async ({ name, email, password, imageFile }) => {
    const resp = await api.post("/api/auth/register", {
      name,
      email,
      password,
    });
    const { token, user: userData } = resp.data;
    // save token immediately so subsequent requests include it
    chrome.storage.local.set({ token }, async () => {
      // if there's an image file, upload it
      if (imageFile) {
        try {
          const form = new FormData();
          form.append("image", imageFile);
          await api.post("/api/user/me/upload", form, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          // fetch updated profile
          const profile = await api.get("/api/user/me");
          const updatedUser = profile.data.user;
          setUser(updatedUser);
          chrome.storage.local.set({ user: updatedUser });
          setIsLoggedIn(true);
          return { token, user: updatedUser };
        } catch (err) {
          // image upload failed but registration succeeded
          console.error("Image upload failed", err);
        }
      }
      setUser(userData);
      setIsLoggedIn(true);
      chrome.storage.local.set({ user: userData });
      return { token, user: userData };
    });
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    chrome.storage.local.remove(["user", "token"]);
  };

  const updateUser = (updatedUserData) => {
    const newUserData = { ...user, ...updatedUserData };
    setUser(newUserData);
    chrome.storage.local.set({ user: newUserData });
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
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
}
