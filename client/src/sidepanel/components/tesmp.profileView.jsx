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
                  <p className="text-xs text-gray-500 font-semibold">Username</p>
                  <p className="text-gray-800 font-semibold">
                    {userData?.username}
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
                    {userData?.email}
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
  const [user, setUser] = useState({
    username: 'johndoe',
    email: 'john.doe@example.com',
    password: 'password123',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=800&fit=crop'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });
  const [showPassword, setShowPassword] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateImage = async () => {
    if (!newImage) {
      setMessage({ type: 'error', text: 'Please select an image first' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('image', newImage);

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/update-image', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setUser({ ...user, imageUrl: data.imageUrl });
        setImagePreview(null);
        setNewImage(null);
        setMessage({ type: 'success', text: 'Image updated successfully!' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update image' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Connection error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelImage = () => {
    setNewImage(null);
    setImagePreview(null);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    setEditedUser({ ...user });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedUser({ ...user });
    setMessage({ type: '', text: '' });
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: editedUser.username,
          email: editedUser.email,
          password: editedUser.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        setUser({ ...user, ...editedUser });
        setIsEditing(false);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Connection error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-700 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <button className="p-2 hover:bg-gray-800 rounded-lg transition">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold">Profile Settings</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Profile Image */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4 text-gray-100">Profile Picture</h2>
              
              {/* Image Display */}
              <div className="relative mb-4 group">
                <img
                  src={imagePreview || user.imageUrl}
                  alt="Profile"
                  className="w-full h-96 object-cover rounded-lg shadow-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 rounded-lg flex items-center justify-center">
                  <label className="cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="bg-blue-600 hover:bg-blue-700 p-4 rounded-full shadow-lg">
                      <Camera size={28} />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Image Upload Message */}
              {message.type && !isEditing && (
                <div className={`mb-4 p-3 rounded-lg ${
                  message.type === 'success' 
                    ? 'bg-green-900 border border-green-700 text-green-200' 
                    : 'bg-red-900 border border-red-700 text-red-200'
                }`}>
                  {message.text}
                </div>
              )}

              {/* Image Action Buttons */}
              {newImage ? (
                <div className="flex space-x-2">
                  <button
                    onClick={handleUpdateImage}
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition disabled:bg-gray-600 flex items-center justify-center space-x-2"
                  >
                    <Save size={20} />
                    <span>{loading ? 'Uploading...' : 'Update Image'}</span>
                  </button>
                  <button
                    onClick={handleCancelImage}
                    disabled={loading}
                    className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition disabled:bg-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <label className="block w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition cursor-pointer text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <Camera size={20} />
                    <span>Change Photo</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}

              {/* Image Tips */}
              <div className="mt-4 p-3 bg-gray-900 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-400">
                  <strong className="text-gray-300">Tip:</strong> Upload a full body image for best results. Recommended size: 500x800px
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-100">Profile Information</h2>
                {!isEditing && (
                  <button
                    onClick={handleEditProfile}
                    className="hover:bg-[#ffffff5d] text-white px-2 py-2 rounded-4xl cursor-pointer font-medium transition flex items-center space-x-2"
                  >
                    <Edit2 size={18} />
                  </button>
                )}
              </div>

              {/* Message Display */}
              {message.type && isEditing && (
                <div className={`mb-6 p-4 rounded-lg ${
                  message.type === 'success' 
                    ? 'bg-green-900 border border-green-700 text-green-200' 
                    : 'bg-red-900 border border-red-700 text-red-200'
                }`}>
                  {message.text}
                </div>
              )}

              <div className="space-y-6">
                {/* Username Field */}
                <div>
                  <label className="block text-gray-300 font-medium mb-2">Username</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedUser.username}
                      onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-200">
                      {user.username}
                    </div>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-gray-300 font-medium mb-2">Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedUser.email}
                      onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-200">
                      {user.email}
                    </div>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-gray-300 font-medium mb-2">Password</label>
                  {isEditing ? (
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={editedUser.password}
                        onChange={(e) => setEditedUser({ ...editedUser, password: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white pr-12"
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  ) : (
                    <div className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 flex items-center justify-between">
                      <span>{'•'.repeat(user.password.length)}</span>
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-200"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  )}
                  {showPassword && !isEditing && (
                    <p className="mt-2 text-sm text-gray-400">{user.password}</p>
                  )}
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex space-x-4 pt-4">
                    <button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition disabled:bg-gray-600 flex items-center justify-center space-x-2"
                    >
                      <Save size={20} />
                      <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={loading}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition disabled:bg-gray-600 flex items-center justify-center space-x-2"
                    >
                      <X size={20} />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}

                {/* Account Info */}
                <div className="pt-6 border-t border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-200 mb-4">Account Information</h3>
                  <div className="space-y-2 text-sm text-gray-400">
                    <p><strong className="text-gray-300">Member since:</strong> January 2024</p>
                    <p><strong className="text-gray-300">Account Status:</strong> <span className="text-green-400">Active</span></p>
                    <p><strong className="text-gray-300">Last Login:</strong> 2 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// export default ProfileView;
