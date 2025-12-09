// Helper to check if user is logged in
export function isUserLoggedIn(callback) {
  chrome.storage.local.get(["isLoggedIn", "user"], (result) => {
    callback(result.isLoggedIn && result.user);
  });
}

// Helper to get current user
export function getCurrentUser(callback) {
  chrome.storage.local.get("user", (result) => {
    callback(result.user || null);
  });
}
