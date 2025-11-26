import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabase/client'

const RegistrationModal = ({ event, isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    course: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { user } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Check if user is logged in
    if (!user) {
      alert('Please sign in to register for events.')
      onClose()
      return
    }

    setLoading(true)

    try {
      // First, check if user is already registered for this event
      const { data: existingRegistration, error: checkError } = await supabase
        .from('igniters_registrations')
        .select('*')
        .eq('event_id', event.id)
        .eq('email', formData.email)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError
      }

      if (existingRegistration) {
        alert('You are already registered for this event!')
        setLoading(false)
        return
      }

      // Insert new registration
      const { error } = await supabase
        .from('igniters_registrations')
        .insert([{
          event_id: event.id,
          name: formData.name,
          email: formData.email,
          course: formData.course
        }])

      if (error) throw error
      
      setSuccess(true)
      setTimeout(() => {
        onClose()
        setSuccess(false)
        setFormData({ name: '', email: '', course: '' })
      }, 2000)
    } catch (error) {
      console.error('Registration error:', error)
      alert('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  // Pre-fill form with user data if available
  React.useEffect(() => {
    if (user && isOpen) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        name: prev.name || '' // Don't auto-fill name for privacy
      }))
    }
  }, [user, isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-card p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {success ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-hot-pink mb-2">Registration Successful!</h3>
                <p className="text-gray-600 mb-4">Thank you for registering for</p>
                <p className="font-semibold text-gray-800">{event.title}</p>
                <button
                  onClick={onClose}
                  className="w-full gradient-btn mt-6"
                >
                  Close
                </button>
              </motion.div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-hot-pink mb-2">Register for {event.title}</h3>
                <p className="text-gray-600 mb-6">Join this exciting event hosted by Igniters Club</p>
                
                {!user && (
                  <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 text-yellow-700 rounded-lg text-sm">
                    Please sign in to register for this event.
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={!user}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hot-pink focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={!user}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hot-pink focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course/Department *</label>
                    <input
                      type="text"
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      required
                      disabled={!user}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hot-pink focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="e.g., Computer Engineering, B.Tech"
                    />
                  </div>
                  
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !user}
                      className="flex-1 gradient-btn disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {!user ? 'Sign In Required' : loading ? 'Registering...' : 'Register'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default RegistrationModal