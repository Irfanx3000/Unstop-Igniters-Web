import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import GlassCard from './GlassCard'
import logo from "../assets/background-logo.png"; // ✅ Logo import

const Login = ({ onClose, onSwitchToSignup }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isAdminLogin, setIsAdminLogin] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signIn } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error: signInError } = await signIn(email, password)
      if (signInError) throw signInError
      onClose()
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-8 px-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <GlassCard className="p-8 w-full">

          {/* ====================== */}
          {/* Updated Logo Section  */}
          {/* ====================== */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="flex items-center justify-center mb-6">
                                <img 
                                  src={logo}
                                  alt="Igniters Club Logo"
                                  className="w-28 md:w-32 drop-shadow-xl"
                                />
                              </div>
            </div>
          {/* ====================== */}

            {/* Admin/User Switch */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              <button
                type="button"
                onClick={() => setIsAdminLogin(false)}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
                  !isAdminLogin
                    ? 'bg-white text-hot-pink shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                User Login
              </button>

              <button
                type="button"
                onClick={() => setIsAdminLogin(true)}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
                  isAdminLogin
                    ? 'bg-white text-hot-pink shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Admin Login
              </button>
            </div>

            <h2 className="text-2xl font-black mb-2">
              {isAdminLogin ? 'Admin Sign In' : 'Sign In to Your Account'}
            </h2>
            <p className="text-gray-600 text-sm">
              {isAdminLogin 
                ? 'Access the admin dashboard'
                : 'Welcome back! Please sign in to continue.'}
            </p>
          </div>

          {isAdminLogin && (
            <div className="mb-6 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm">
              💼 Admin access requires @aiktc.ac.in email or admin privileges
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-hot-pink focus:border-transparent transition-all"
                placeholder={isAdminLogin ? "admin@aiktc.ac.in" : "you@example.com"}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-hot-pink focus:border-transparent transition-all"
                placeholder="Enter your password"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full gradient-btn py-3 text-base font-semibold disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </span>
              ) : (
                'Sign In'
              )}
            </motion.button>

            <div className="text-center space-y-3 pt-4">
              {!isAdminLogin && (
                <div>
                  <span className="text-gray-600 text-sm">Don't have an account? </span>
                  <button
                    type="button"
                    onClick={onSwitchToSignup}
                    className="text-hot-pink hover:text-orange-500 font-semibold text-sm transition-colors"
                  >
                    Sign up here
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-sm transition-colors block w-full py-2"
              >
                ← Back to website
              </button>
            </div>
          </form>

        </GlassCard>
      </motion.div>
    </div>
  )
}

export default Login
