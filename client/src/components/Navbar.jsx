import React, { useState } from "react";
import {
  User,
  Image,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
} from "lucide-react";

export default function Navbar({ onCollapseChange }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const handleCollapse = (state) => {
    setIsCollapsed(state);
    if (onCollapseChange) onCollapseChange(state);
  };

  const handleProfile = () => {
    chrome.runtime.sendMessage({ action: "showProfile" }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error opening side panel:", chrome.runtime.lastError);
      }
    });
  };

  const handleProcess = () => {
    // Check if user is logged in before opening Process view
    chrome.storage.local.get(["isLoggedIn"], (result) => {
      if (result.isLoggedIn) {
        // User is logged in, show process view
        chrome.runtime.sendMessage({ action: "showProcess" }, (response) => {
          if (chrome.runtime.lastError) {
            console.error(
              "Error opening side panel:",
              chrome.runtime.lastError
            );
          }
        });
      } else {
        // User is not logged in, show login view
        chrome.runtime.sendMessage({ action: "showLogin" }, (response) => {
          if (chrome.runtime.lastError) {
            console.error(
              "Error opening side panel:",
              chrome.runtime.lastError
            );
          }
        });
      }
    });
  };

  return (
    <>
      <div
        className={`transition-all duration-300 ${
          isCollapsed
            ? "w-12 h-5 bg-gray-400"
            : `${isDark ? "bg-gray-900" : "bg-white"} w-full h-16 border-b ${
                isDark ? "border-gray-700" : "border-gray-200"
              }`
        } ml-auto`}
      >
        {isCollapsed ? (
          // Collapsed View - Minimal bar
          <div className="h-full px-2 flex relative right-0 items-center justify-center gap-1">
            <button
              onClick={() => handleCollapse(false)}
              className="p-0 bg-amber-500 rounded-lg transition-colors text-gray-600 hover:text-gray-800"
              title="Expand"
            >
              <ChevronRight size={50} />
            </button>
          </div>
        ) : (
          // Expanded View - Full Navbar
          <div className="h-full px-6 flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg ${
                  isDark ? "bg-gray-700" : "bg-gray-800"
                } flex items-center justify-center`}
              >
                <span className="text-white font-bold">Wyo</span>
              </div>
              <span
                className={`font-semibold text-xl ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                Wear Your On
              </span>
            </div>

            {/* Right Section - Buttons */}
            <div className="flex items-center gap-3">
              {/* My Photo Button */}
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isDark
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                }`}
              >
                <Image size={20} />
                <span className="font-medium">My Photo</span>
              </button>

              {/* Profile Button */}
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isDark
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                }`}
                onClick={handleProfile}
              >
                <User size={20} />
                <span className="font-medium">Profile</span>
              </button>

              {/* Process Button */}
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isDark
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                }`}
                onClick={handleProcess}
              >
                <span className="font-medium">Process</span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={() => setIsDark(!isDark)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isDark
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                }`}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
                <span className="font-medium">{isDark ? "Light" : "Dark"}</span>
              </button>

              {/* Collapse Button */}
              <button
                onClick={() => handleCollapse(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isDark
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                }`}
              >
                <ChevronRight size={20} />
                <span className="font-medium">Collapse</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
