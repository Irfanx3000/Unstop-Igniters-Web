import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import GlassCard from "./GlassCard";
import Starfield from "./StarField"; // 🌌 IMPORT STARFIELD
import logo from "../assets/background-logo.png";

const Login = ({ onClose, onSwitchToSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { signIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error: signInError } = await signIn(email, password);
      if (signInError) throw signInError;
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center 
        relative overflow-hidden bg-[#050505]"
    >
      {/* 🌌 STARS & SHOOTING STARS */}
      <Starfield />

      {/* 🔥 Nebula Glow */}
      <div
        className="absolute top-0 left-0 w-[600px] h-[600px] 
        bg-pink-600/20 blur-[180px] rounded-full z-0"
      ></div>

      <div
        className="absolute bottom-0 right-0 w-[600px] h-[600px] 
        bg-orange-500/20 blur-[180px] rounded-full z-0"
      ></div>

      {/* 🔥 BACK BUTTON */}
      <div className="fixed top-5 right-5 z-50">
        <button
          onClick={onClose}
          className="gradient-btn py-2 px-4 text-sm font-semibold 
          rounded-xl shadow-xl hover:opacity-90 transition"
        >
          ← Back to Website
        </button>
      </div>

      {/* LOGIN CARD */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md z-20"
      >
        <GlassCard
          className="
          p-8 w-full 
          bg-white/10 backdrop-blur-2xl 
          border border-white/20 
          shadow-[0_0_35px_rgba(255,44,165,0.25)] 
          rounded-3xl
        "
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <img
                src={logo}
                alt="Igniters Club Logo"
                className="w-28 md:w-32 drop-shadow-[0_0_20px_rgba(255,122,0,0.6)]"
              />
            </div>

            {/* Admin/User Switch */}
            <div className="flex bg-white/70 backdrop-blur-md rounded-xl p-1 mb-6 shadow-sm border border-gray-200">
              {/* USER BUTTON */}
              <button
                onClick={() => setIsAdminLogin(false)}
                className={`flex-1 py-3 rounded-lg font-semibold text-sm transition-all
                  ${
                    !isAdminLogin
                      ? "gradient-btn text-white shadow-md"
                      : "text-gray-700 bg-white hover:bg-gray-100 border border-gray-200"
                  }`}
              >
                User Login
              </button>

              {/* ADMIN BUTTON */}
              <button
                onClick={() => setIsAdminLogin(true)}
                className={`flex-1 py-3 rounded-lg font-semibold text-sm transition-all
                  ${
                    isAdminLogin
                      ? "gradient-btn text-white shadow-md"
                      : "text-gray-700 bg-white hover:bg-gray-100 border border-gray-200"
                  }`}
              >
                Admin Login
              </button>
            </div>

            <h2 className="text-2xl font-black mb-2 text-white">
              {isAdminLogin ? "Admin Sign In" : "Sign In to Your Account"}
            </h2>

            <p className="text-gray-300 text-sm">
              {isAdminLogin
                ? "Access the admin dashboard"
                : "Welcome back! Please sign in to continue."}
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/20 border border-red-400 text-red-200 
                rounded-lg text-sm backdrop-blur-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-200">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 text-base 
                  bg-white/10 border border-white/20 text-white 
                  rounded-xl focus:ring-2 focus:ring-hot-pink 
                  placeholder-gray-400 backdrop-blur-md"
                placeholder={
                  isAdminLogin ? "admin@example.com" : "you@example.com"
                }
              />
            </div>

            {/* Password + Eye */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-200">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 text-base 
                    bg-white/10 border border-white/20 text-white 
                    rounded-xl focus:ring-2 focus:ring-hot-pink 
                    placeholder-gray-400 backdrop-blur-md
                    [&::-ms-reveal]:hidden [&::-ms-clear]:hidden
                    [input::-webkit-credentials-auto-fill-button]:hidden"
                  placeholder="Enter your password"
                />

                {/* 👁 SINGLE EYE ICON (Fixed) */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 
                    text-gray-300 hover:text-white"
                >
                  {showPassword ? (
                    // Hide icon
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M3 3l18 18M9.88 9.88a3 3 0 104.24 4.24M10.6 5.39a9 9 0 0110.4 6.61M6.26 6.26A9 9 0 003 12a9 9 0 008.4 6.6"
                      />
                    </svg>
                  ) : (
                    // Show icon
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M1.5 12s4.5-7.5 10.5-7.5S22.5 12 22.5 12s-4.5 7.5-10.5 7.5S1.5 12 1.5 12z"
                      />
                      <circle cx="12" cy="12" r="3" strokeWidth="1.5" />
                    </svg>
                  )}
                </button>
              </div>
            </div>


            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full gradient-btn py-3 text-base font-semibold rounded-xl shadow-lg 
              disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"}
            </motion.button>

            {/* Link to signup */}
            {!isAdminLogin && (
              <div className="text-center space-y-3 pt-4">
                <span className="text-gray-300 text-sm">
                  Don't have an account?{" "}
                </span>
                <button
                  type="button"
                  onClick={onSwitchToSignup}
                  className="text-hot-pink hover:text-orange-400 font-semibold text-sm transition-colors"
                >
                  Sign up here
                </button>
              </div>
            )}
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default Login;
