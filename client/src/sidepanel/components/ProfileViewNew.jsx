import { LogOut, User, Mail } from "lucide-react";

export default function ProfileView({ user, onLogout }) {
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      onLogout();
    }
  };

  return (
    <div className="w-full h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-linear-to-r from-purple-600 to-purple-800 text-white p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {/* Profile Picture Card */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex flex-col items-center text-center">
              {user?.bodyImage ? (
                <img
                  src={user.bodyImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-purple-500 mb-4"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center mb-4 border-4 border-purple-500">
                  <User size={64} className="text-gray-500" />
                </div>
              )}
              <h2 className="text-2xl font-bold text-gray-800">
                {user?.username}
              </h2>
              <p className="text-gray-500 mt-1">{user?.email}</p>
            </div>
          </div>

          {/* User Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Account Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <User className="text-purple-600" size={24} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-semibold">
                    Username
                  </p>
                  <p className="text-gray-800 font-semibold">
                    {user?.username}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail className="text-blue-600" size={24} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-semibold">Email</p>
                  <p className="text-gray-800 font-semibold break-all">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Account Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-purple-600">5</p>
                <p className="text-sm text-gray-600">Processes</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">128</p>
                <p className="text-sm text-gray-600">Items Processed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
