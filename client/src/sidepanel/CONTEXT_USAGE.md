// User Context Usage Guide

// The UserContext provides a centralized way to manage user authentication and data
// across your entire application without prop drilling.

// ============================================================================
// 1. HOW TO USE THE CONTEXT IN YOUR COMPONENTS
// ============================================================================

// Import the useUser hook in any component where you need user data:
import { useUser } from "../context/UserContext";

// Use it in your component:
function MyComponent() {
const { user, isLoggedIn, isLoading, login, signup, logout, updateUser } = useUser();

// Now you can access user data and functions anywhere
console.log(user?.username);
console.log(isLoggedIn);
}

// ============================================================================
// 2. CONTEXT API REFERENCE
// ============================================================================

// useUser() returns an object with:

// user (object | null)
// - The currently logged-in user object
// - Properties: id, username, email, token, bodyImage
// - null if not logged in

// isLoggedIn (boolean)
// - True if user is logged in, false otherwise

// isLoading (boolean)
// - True while loading user data from storage
// - False when loading is complete

// login(userData)
// - Function to log in a user
// - Accepts user object and stores it in Chrome storage
// - Updates context state

// signup(userData)
// - Function to sign up a new user
// - Accepts user object and stores it in Chrome storage
// - Updates context state

// logout()
// - Function to log out the current user
// - Clears user data from Chrome storage and context
// - No parameters needed

// updateUser(updatedUserData)
// - Function to update user information
// - Accepts partial user object to merge with existing user
// - Example: updateUser({ username: "newusername" })

// ============================================================================
// 3. EXAMPLE: LOGIN COMPONENT
// ============================================================================

import { useState } from "react";
import { useUser } from "../context/UserContext";

function LoginForm() {
const { login } = useUser();
const [email, setEmail] = useState("");

const handleLogin = async (e) => {
e.preventDefault();

    // Fetch user data from your API
    const userData = {
      id: "user123",
      email: email,
      username: email.split("@")[0],
      token: "jwt_token_here"
    };

    // Use context to login
    login(userData);

};

return (
<form onSubmit={handleLogin}>
<input
type="email"
value={email}
onChange={(e) => setEmail(e.target.value)}
placeholder="Enter your email"
/>
<button type="submit">Login</button>
</form>
);
}

// ============================================================================
// 4. EXAMPLE: PROFILE COMPONENT
// ============================================================================

import { useUser } from "../context/UserContext";

function Profile() {
const { user, logout } = useUser();

if (!user) {
return <div>Please log in</div>;
}

return (
<div>
<h1>Welcome, {user.username}!</h1>
<p>Email: {user.email}</p>
{user.bodyImage && (
<img src={user.bodyImage} alt="Profile" />
)}
<button onClick={logout}>Logout</button>
</div>
);
}

// ============================================================================
// 5. EXAMPLE: UPDATE USER INFORMATION
// ============================================================================

import { useUser } from "../context/UserContext";

function UpdateProfile() {
const { user, updateUser } = useUser();
const [newUsername, setNewUsername] = useState(user?.username || "");

const handleUpdate = () => {
updateUser({ username: newUsername });
};

return (
<div>
<input
type="text"
value={newUsername}
onChange={(e) => setNewUsername(e.target.value)}
/>
<button onClick={handleUpdate}>Update Profile</button>
</div>
);
}

// ============================================================================
// 6. HOW THE CONTEXT IS SET UP
// ============================================================================

// In App.jsx, the UserProvider wraps all components:

import { UserProvider } from "./context/UserContext";

export default function App() {
return (
<UserProvider>
<AppContent />
</UserProvider>
);
}

// This ensures that:
// - User data is loaded from Chrome storage on app startup
// - All child components can access user context via useUser hook
// - User state is synchronized across all components
// - Chrome storage is automatically updated when user data changes

// ============================================================================
// 7. CHROME STORAGE INTEGRATION
// ============================================================================

// The context automatically syncs with Chrome storage:

// On Mount:
// - Loads user from chrome.storage.local.user
// - Loads isLoggedIn from chrome.storage.local.isLoggedIn

// On Login/Signup:
// - Saves user to chrome.storage.local.user
// - Sets chrome.storage.local.isLoggedIn = true

// On Logout:
// - Removes user from chrome.storage.local
// - Removes isLoggedIn from chrome.storage.local

// On Update:
// - Updates chrome.storage.local.user with new data

// ============================================================================
