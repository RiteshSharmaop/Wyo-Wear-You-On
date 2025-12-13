import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../../utils/api";

const UserContext = createContext();

function normalizeUser(u, token = null) {
  if (!u) return null;
  return {
    id: u.id || u._id,
    username: u.username || u.name || (u.email ? u.email.split("@")[0] : ""),
    email: u.email,
    bodyImage: u.bodyImage || u.bodyImageUrl || u.profileImage || null,
    token: token || u.token || null,
  };
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    chrome.storage.local.get(["user", "token"], (result) => {
      if (result?.user) {
        setUser(normalizeUser(result.user, result.token));
        setIsLoggedIn(!!result.token);
      }
      setIsLoading(false);
    });
  }, []);

  // login -> call backend, store token + user
  const login = async ({ email, password }) => {
    const resp = await api.post("/api/auth/login", { email, password });
    const { token, user: userData } = resp.data;
    const normalized = normalizeUser(userData, token);
    setUser(normalized);
    setIsLoggedIn(true);
    chrome.storage.local.set({ user: normalized, token });
    return { token, user: normalized };
  };

  // signup -> call backend, store token + user
  const signup = async ({ name, email, password, imageFile }) => {
    const resp = await api.post("/api/auth/register", {
      name,
      email,
      password,
    });
    const { token, user: userData } = resp.data;
    const normalized = normalizeUser(userData, token);
    // store token + user first
    chrome.storage.local.set({ token, user: normalized }, async () => {
      setUser(normalized);
      setIsLoggedIn(true);
      // if there's an image file, upload it via helper
      if (imageFile) {
        try {
          await uploadBodyImage(imageFile);
        } catch (err) {
          console.error("Image upload failed after signup", err);
        }
      }
      return { token, user: normalized };
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

  // Upload body image and update stored user
  const uploadBodyImage = async (file) => {
    if (!file) throw new Error("No file provided");
    const form = new FormData();
    form.append("image", file);
    const resp = await api.post("/api/user/me/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const updated = resp.data.user;
    const normalized = normalizeUser(updated);
    setUser(normalized);
    chrome.storage.local.set({ user: normalized });
    return normalized;
  };

  const value = {
    user,
    isLoggedIn,
    isLoading,
    login,
    signup,
    logout,
    updateUser,
    uploadBodyImage,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
}
