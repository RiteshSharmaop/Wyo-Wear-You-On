import { useEffect, useState } from "react";
import { UserProvider, useUser } from "./context/UserContext";
import LoginView from "./components/LoginView";
import SignupView from "./components/SignupView";
import ProfileView from "./components/ProfileView";
import ProcessView from "./components/ProcessView";

function AppContent() {
  const { user, isLoading, isLoggedIn, login, signup, logout } = useUser();
  const [currentView, setCurrentView] = useState("profile");

  useEffect(() => {
    // Update view when login status changes
    if (!isLoggedIn) {
      setCurrentView("login");
    } else {
      // If user just logged in and view is still login, show profile
      if (currentView === "login") {
        setCurrentView("profile");
      }
    }
  }, [isLoggedIn]);

  useEffect(() => {
    // Listen for view changes from storage (from navbar)
    const handleStorageChange = (changes, areaName) => {
      if (areaName === "session" && changes.currentView) {
        const newView = changes.currentView.newValue;
        // If user is logged in, show the requested view, otherwise show login
        if (isLoggedIn) {
          setCurrentView(newView);
        } else {
          setCurrentView("login");
        }
      }
    };

    // Get initial view
    chrome.storage.session.get("currentView", (result) => {
      if (result.currentView && isLoggedIn) {
        setCurrentView(result.currentView);
      }
    });

    // Listen for storage changes
    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, [isLoggedIn]);

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in - show auth pages
  if (!isLoggedIn) {
    return currentView === "signup" ? (
      <SignupView
        onSignupSuccess={(userData) => {
          signup(userData);
          setCurrentView("profile");
        }}
        onSwitchToLogin={() => setCurrentView("login")}
      />
    ) : (
      <LoginView
        onLoginSuccess={(userData) => {
          login(userData);
          setCurrentView("profile");
        }}
        onSwitchToSignup={() => setCurrentView("signup")}
      />
    );
  }

  // Logged in - show content pages
  return (
    <div className="w-full h-screen bg-gray-50">
      {currentView === "showProfile" || currentView === "profile" ? (
        <ProfileView />
      ) : (
        <ProcessView />
      )}
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}
