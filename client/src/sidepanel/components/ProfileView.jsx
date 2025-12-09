import { LogOut, User, Mail } from "lucide-react";
import { useState } from "react";
import { useUser } from "../context/UserContext";

export default function ProfileView() {
  const { user: userData, logout } = useUser();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
  };

  if (!userData) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-black">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black text-white overflow-y-auto">
      {/* Header with Logout */}
      <div className="bg-gray-800 border-b border-gray-700 p-6 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Your Profile</h1>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg max-w-sm mx-4">
            <h2 className="text-xl font-bold mb-4">Confirm Logout</h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to logout? You'll need to login again to
              access your profile.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6 max-w-4xl">
        <div className="space-y-6">
          {/* Profile Picture Card */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700">
            <div className="flex flex-col items-center text-center">
              {userData?.bodyImage ? (
                <img
                  src={userData.bodyImage}
                  alt="Profile"
                  className="w-40 h-40 rounded-full object-cover border-4 border-blue-500 mb-4 shadow-lg"
                />
              ) : (
                <div className="w-40 h-40 rounded-full bg-gray-700 flex items-center justify-center mb-4 border-4 border-blue-500">
                  <User size={80} className="text-gray-400" />
                </div>
              )}
              <h2 className="text-3xl font-bold text-white mt-4">
                {userData?.username || "User"}
              </h2>
              <p className="text-gray-400 mt-2">
                {userData?.email || "No email"}
              </p>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6">
              Account Information
            </h3>
            <div className="space-y-4">
              {/* Username Card */}
              <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
                <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center shrink-0">
                  <User className="text-blue-400" size={24} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 font-semibold uppercase">
                    Username
                  </p>
                  <p className="text-white font-semibold text-lg">
                    {userData?.username || "N/A"}
                  </p>
                </div>
              </div>

              {/* Email Card */}
              <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
                <div className="w-12 h-12 bg-purple-900 rounded-full flex items-center justify-center shrink-0">
                  <Mail className="text-purple-400" size={24} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 font-semibold uppercase">
                    Email Address
                  </p>
                  <p className="text-white font-semibold text-lg break-all">
                    {userData?.email || "N/A"}
                  </p>
                </div>
              </div>

              {/* User ID Card */}
              {userData?.id && (
                <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
                  <div className="w-12 h-12 bg-green-900 rounded-full flex items-center justify-center shrink-0">
                    <User className="text-green-400" size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 font-semibold uppercase">
                      User ID
                    </p>
                    <p className="text-white font-semibold break-all font-mono text-sm">
                      {userData.id}
                    </p>
                  </div>
                </div>
              )}

              {/* Token Card */}
              {userData?.token && (
                <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
                  <div className="w-12 h-12 bg-yellow-900 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-yellow-400 font-bold">🔐</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 font-semibold uppercase">
                      Auth Token
                    </p>
                    <p className="text-white font-semibold text-sm break-all font-mono">
                      {userData.token.substring(0, 20)}...
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account Stats */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6">
              Account Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-900 bg-opacity-40 border border-blue-700 p-6 rounded-lg text-center">
                <p className="text-4xl font-bold text-blue-400 mb-2">5</p>
                <p className="text-gray-300 font-medium">Processes</p>
              </div>
              <div className="bg-purple-900 bg-opacity-40 border border-purple-700 p-6 rounded-lg text-center">
                <p className="text-4xl font-bold text-purple-400 mb-2">128</p>
                <p className="text-gray-300 font-medium">Items Processed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
