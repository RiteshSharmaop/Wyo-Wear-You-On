import {
  LogOut,
  Mail,
  User,
  CheckCircle,
  Clock,
  Package,
  RefreshCw,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";

export default function ProcessView() {
  const { user: userData, logout } = useUser();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [productImage, setProductImage] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    // Load product image from Chrome storage
    chrome.storage.local.get(["productImage"], (result) => {
      if (result.productImage) {
        setProductImage(result.productImage);
      }
    });
  }, []);

  const handleLogout = () => {
    logout();
  };

  const handleRetryImage = async () => {
    setIsRetrying(true);
    try {
      // Send message to content script to capture new image
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(
            tabs[0].id,
            { action: "retryProductImage" },
            (response) => {
              if (response && response.success) {
                // Image has been updated in storage, update local state
                setProductImage(response.imageUrl);
              } else {
                console.error("Failed to capture new image");
              }
              setIsRetrying(false);
            }
          );
        }
      });
    } catch (error) {
      console.error("Error retrying image capture:", error);
      setIsRetrying(false);
    }
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
      {/* Header with User Info */}
      <div className="bg-gray-800 border-b border-gray-700 p-6 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {userData?.bodyImage ? (
              <img
                src={userData.bodyImage}
                alt="Profile"
                className="w-14 h-14 rounded-full object-cover border-2 border-blue-500 shadow-lg"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center border-2 border-blue-500">
                <User size={28} className="text-gray-400" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-white">
                {userData?.username}
              </h2>
              <p className="text-gray-400 text-sm">{userData?.email}</p>
            </div>
          </div>
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
              access your account.
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

      {/* Main Content */}
      <div className="p-6 max-w-4xl">
        <div className="space-y-6">
          {/* Processing Status Card */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6">
              Processing Status
            </h3>
            <div className="space-y-6">
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-green-400" size={20} />
                    <span className="text-gray-300 font-semibold">
                      Items Processed
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-blue-400">
                    42 / 100
                  </span>
                </div>
                <div className="w-full bg-gray-900 rounded-full h-4 border border-gray-700">
                  <div
                    className="bg-linear-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-500"
                    style={{ width: "42%" }}
                  ></div>
                </div>
                <p className="text-gray-400 text-sm mt-2">42% Complete</p>
              </div>

              {/* Processing Stats Grid */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 text-center">
                  <p className="text-3xl font-bold text-green-400 mb-1">42</p>
                  <p className="text-gray-400 text-sm">Completed</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 text-center">
                  <p className="text-3xl font-bold text-yellow-400 mb-1">8</p>
                  <p className="text-gray-400 text-sm">Pending</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 text-center">
                  <p className="text-3xl font-bold text-red-400 mb-1">0</p>
                  <p className="text-gray-400 text-sm">Failed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Details Card */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6">
              Account Details
            </h3>
            <div className="space-y-4">
              {/* Username */}
              <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
                <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center shrink-0">
                  <User className="text-blue-400" size={24} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 font-semibold uppercase">
                    Username
                  </p>
                  <p className="text-white font-semibold text-lg">
                    {userData?.username}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
                <div className="w-12 h-12 bg-purple-900 rounded-full flex items-center justify-center shrink-0">
                  <Mail className="text-purple-400" size={24} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 font-semibold uppercase">
                    Email Address
                  </p>
                  <p className="text-white font-semibold text-lg break-all">
                    {userData?.email}
                  </p>
                </div>
              </div>

              {/* User ID */}
              {userData?.id && (
                <div className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
                  <div className="w-12 h-12 bg-green-900 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-green-400 font-bold">ID</span>
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
            </div>
          </div>

          {/* Product Image Card */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between gap-2 mb-6">
              <div className="flex items-center gap-2">
                <Package className="text-blue-400" size={24} />
                <h3 className="text-2xl font-bold text-white">Product Image</h3>
              </div>
              <button
                onClick={handleRetryImage}
                disabled={isRetrying}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isRetrying
                    ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
                title="Fetch new image from current page"
              >
                <RefreshCw
                  size={18}
                  className={isRetrying ? "animate-spin" : ""}
                />
                Retry
              </button>
            </div>
            {productImage ? (
              <div className="flex flex-col gap-4">
                <div className="flex justify-center">
                  <img
                    src={productImage}
                    alt="Amazon Product"
                    className="max-w-full h-auto rounded-lg shadow-lg border border-gray-700 max-h-96 object-contain"
                    onError={(e) => {
                      e.target.src = "";
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 bg-gray-900 rounded-lg border border-gray-700">
                <Package size={48} className="text-gray-500 mb-3" />
                <p className="text-gray-400 text-center">
                  No product image captured from Amazon
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Open this extension on an Amazon product page
                </p>
                <button
                  onClick={handleRetryImage}
                  disabled={isRetrying}
                  className={`mt-4 flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isRetrying
                      ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  <RefreshCw
                    size={18}
                    className={isRetrying ? "animate-spin" : ""}
                  />
                  {isRetrying ? "Fetching..." : "Fetch Image"}
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg transition-colors border border-green-500">
              <CheckCircle size={20} />
              Start Process
            </button>
            <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-colors border border-blue-500">
              <Clock size={20} />
              View History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
