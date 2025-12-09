import axios from "axios";

const API_BASE = window.__env?.REACT_APP_API_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// attach token automatically when present in chrome.storage.local
api.interceptors.request.use(async (config) => {
  return new Promise((resolve) => {
    try {
      chrome.storage.local.get(["token"], (result) => {
        const token = result?.token;
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
        resolve(config);
      });
    } catch (e) {
      resolve(config);
    }
  });
});

export default api;
