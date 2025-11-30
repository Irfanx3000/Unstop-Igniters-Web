import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase/client";
import GlassCard from "./GlassCard";
import Starfield from "./StarField"; // ⭐ SAME STARS
import logo from "../assets/background-logo.png";

const Signup = ({ onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { signUp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { name, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const { data: authData, error: signUpError } = await signUp(email, password);
      if (signUpError) throw signUpError;

      if (authData?.user) {
        await supabase.from("user_profiles").insert([
          {
            user_id: authData.user.id,
            name: name.trim(),
            email: email.toLowerCase(),
          },
        ]);
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
      relative overflow-hidden bg-[#050505]">

      {/* 🌌 STARFIELD BACKGROUND */}
      <Starfield />

      {/* 🔥 Neon Glows (same as login) */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] 
        bg-pink-600/20 blur-[180px] rounded-full z-0"></div>

      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] 
        bg-orange-500/20 blur-[180px] rounded-full z-0"></div>

      {/* 🔙 Back Button */}
      <div className="fixed top-5 right-5 z-50">
        <button
          onClick={onClose}
          className="gradient-btn py-2 px-4 text-sm font-semibold 
            rounded-xl shadow-xl hover:opacity-90 transition"
        >
          ← Back to Website
        </button>
      </div>

      {/* CARD */}
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
          {/* SUCCESS SCREEN */}
          {success ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-white"
            >
              <div className="w-20 h-20 bg-green-500 rounded-full 
                flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor">
                  <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                    d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h3 className="text-2xl font-bold text-hot-pink mb-3">
                Check Your Email!
              </h3>

              <p className="text-gray-300">
                A confirmation link has been sent to:
              </p>

              <p className="text-white font-semibold mt-2 mb-6">
                {formData.email}
              </p>

              <button onClick={onClose} className="w-full gradient-btn py-3 font-semibold">
                Back to Website
              </button>
            </motion.div>
          ) : (
            <>
              {/* LOGO */}
              <div className="text-center mb-8">
                <img
                  src={logo}
                  alt="Igniters Club Logo"
                  className="w-28 mx-auto drop-shadow-[0_0_20px_rgba(255,122,0,0.6)]"
                />
              </div>

              <h2 className="text-3xl font-black text-white text-center mb-2">
                Create Your Account
              </h2>

              <p className="text-gray-300 text-center text-sm mb-8">
                Join the Igniters Club community and start your journey.
              </p>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-6 text-white">

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-500/20 border border-red-400 
                      text-red-200 rounded-lg text-sm backdrop-blur-sm"
                  >
                    {error}
                  </motion.div>
                )}

                {/* FULL NAME */}
                <div>
                  <label className="text-sm text-gray-200">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 mt-1 bg-white/10 border border-white/20 
                      rounded-xl text-white placeholder-gray-400 
                      focus:ring-2 focus:ring-hot-pink backdrop-blur-md"
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label className="text-sm text-gray-200">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 mt-1 bg-white/10 border border-white/20 
                      rounded-xl text-white placeholder-gray-400 
                      focus:ring-2 focus:ring-hot-pink backdrop-blur-md"
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="text-sm text-gray-200">Password *</label>
                  <div className="relative">
                    <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Create a password"
                    className="w-full px-4 py-3 pr-12 mt-1 bg-white/10 border border-white/20 
                      rounded-xl text-white placeholder-gray-400 
                      focus:ring-2 focus:ring-hot-pink backdrop-blur-md
                      [&::-ms-reveal]:hidden [&::-ms-clear]:hidden
                      [input::-webkit-credentials-auto-fill-button]:hidden"
                  />
                    {/* Eye */}
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"
                    >
                      {showPassword ? (
                        <EyeOff />
                      ) : (
                        <EyeOn />
                      )}
                    </button>
                  </div>
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                  <label className="text-sm text-gray-200">Confirm Password *</label>

                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="Re-enter your password"
                      className="w-full px-4 py-3 pr-12 mt-1 bg-white/10 border border-white/20 
                        rounded-xl text-white placeholder-gray-400 
                        focus:ring-2 focus:ring-hot-pink backdrop-blur-md
                        [&::-ms-reveal]:hidden [&::-ms-clear]:hidden
                        [input::-webkit-credentials-auto-fill-button]:hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((p) => !p)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300"
                    >
                      {showConfirmPassword ? (
                        <EyeOff />
                      ) : (
                        <EyeOn />
                      )}
                    </button>
                  </div>
                </div>

                {/* SUBMIT */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={loading}
                  className="w-full gradient-btn py-3 rounded-xl font-semibold shadow-lg"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </motion.button>

                <div className="text-center pt-4">
                  <span className="text-gray-300 text-sm">Already have an account?</span>
                  <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="ml-1 text-hot-pink hover:text-orange-400 font-semibold text-sm"
                  >
                    Sign in here
                  </button>
                </div>
              </form>
            </>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
};

/* ---------------- ICONS (SAME AS LOGIN) ---------------- */

const EyeOn = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="1.5" d="M1.5 12s4.5-7.5 10.5-7.5S22.5 12 22.5 12 18 19.5 12 19.5 1.5 12 1.5 12z" />
    <circle cx="12" cy="12" r="3" strokeWidth="1.5" />
  </svg>
);

const EyeOff = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      d="M3 3l18 18M9.88 9.88a3 3 0 104.24 4.24M10.6 5.39A9 9 0 0121 12a9.05 9.05 0 01-1.6 3.79M6.26 6.26A9 9 0 003 12a9 9 0 008.4 6.6" />
  </svg>
);

export default Signup;
