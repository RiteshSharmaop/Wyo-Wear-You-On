import { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useUser } from "../context/UserContext";

export default function LoginView({ onLoginSuccess, onSwitchToSignup }) {
  const { login, loginWithGoogle, googleClientId } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    // Load Google Sign-In script
    if (googleClientId) {
      loadGoogleSignInScript();
    }
  }, [googleClientId]);

  const handleGoogleSignIn = async (response) => {
    setGoogleLoading(true);
    setError("");
    try {
      const result = await loginWithGoogle(response.credential);
      onLoginSuccess(result.user || result);
    } catch (err) {
      setError(err.message || "Google login failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  const loadGoogleSignInScript = () => {
    if (window.google) {
      initializeGoogleSignIn();
      return;
    }
    
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogleSignIn;
    document.head.appendChild(script);
  };

  const initializeGoogleSignIn = () => {
    if (window.google && googleClientId) {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleSignIn,
        });
        
        // Render the button into the container
        const buttonContainer = document.getElementById("google_signin_button");
        if (buttonContainer && buttonContainer.children.length === 0) {
          window.google.accounts.id.renderButton(buttonContainer, {
            theme: "outline",
            size: "large",
            width: "100%",
          });
        }
      } catch (err) {
        console.error("Error initializing Google Sign-In:", err);
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email || !password) throw new Error("Please fill in all fields");
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email))
        throw new Error("Please enter a valid email");

      const result = await login({ email, password });
      onLoginSuccess(result.user || result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Google Sign In Button */}
        {googleClientId && (
          <div className="mb-6">
            <div
              id="google_signin_button"
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            />
            {googleLoading && (
              <p className="text-center text-sm text-gray-600 mt-2">
                Signing in with Google...
              </p>
            )}
          </div>
        )}

        {/* Divider */}
        {googleClientId && (
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-3.5 text-gray-400"
                size={20}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-3.5 text-gray-400"
                size={20}
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
              Forgot password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Don't have an account?
            </span>
          </div>
        </div>

        {/* Sign Up Link */}
        <button
          onClick={onSwitchToSignup}
          className="w-full border-2 border-blue-500 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
        >
          Create New Account
        </button>
      </div>
    </div>
  );
}

//           {/* Remember Me & Forgot Password */}
//           <div className="flex items-center justify-between">
//             <label className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 className="w-4 h-4 rounded border-gray-300"
//               />
//               <span className="text-sm text-gray-600">Remember me</span>
//             </label>
//             <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
//               Forgot password?
//             </a>
//           </div>

//           {/* Login Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
//           >
//             {loading ? "Signing in..." : "Sign In"}
//           </button>
//         </form>

//         {/* Divider */}
//         <div className="relative my-6">
//           <div className="absolute inset-0 flex items-center">
//             <div className="w-full border-t border-gray-300"></div>
//           </div>
//           <div className="relative flex justify-center text-sm">
//             <span className="px-2 bg-white text-gray-500">
//               Don't have an account?
//             </span>
//           </div>
//         </div>

//         {/* Sign Up Link */}
//         <button
//           onClick={onSwitchToSignup}
//           className="w-full border-2 border-blue-500 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
//         >
//           Create New Account
//         </button>
//       </div>
//     </div>
//   );
// }
