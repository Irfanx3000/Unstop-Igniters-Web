import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import Analytics from './Analytics'
import EventManagement from './EventManagement'
import TeamManagement from './TeamManagement'
import AdminManagement from './AdminManagement'

const AdminDashboard = ({ onViewUserWebsite }) => {
  const [activeTab, setActiveTab] = useState('analytics')
  const { user, userProfile, signOut } = useAuth()

  const tabs = [
    { id: 'analytics', name: 'Analytics', icon: '📊' },
    { id: 'events', name: 'Events', icon: '🎯' },
    { id: 'team', name: 'Team', icon: '👥' },
    { id: 'admins', name: 'Admins', icon: '🔐' },
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out failed:', error)
      alert('Sign out failed. Please try again.')
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'analytics':
        return <Analytics />
      case 'events':
        return <EventManagement />
      case 'team':
        return <TeamManagement />
      case 'admins':
        return <AdminManagement />
      default:
        return <Analytics />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between p-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-black font-bold text-lg">unstop</span>
              <div className="h-4 w-px bg-gray-300"></div>
              <span className="text-hot-pink font-black text-lg">IGNITERS</span>
              <span className="text-black font-bold text-lg">CLUB</span>
            </div>
            <h1 className="text-2xl font-black">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back, {userProfile?.name || user?.email?.split('@')[0] || 'Admin'}
            </p>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={onViewUserWebsite}
              className="gradient-btn text-sm"
            >
              View User Website
            </button>
            <button
              onClick={handleSignOut}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <motion.nav
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-64 bg-white min-h-screen p-4 border-r border-gray-200"
        >
          <div className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#FF4DA6] to-[#FF8A29] text-white shadow-lg'
                    : 'text-gray-600 hover:text-hot-pink hover:bg-gray-50'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span className="font-semibold">{tab.name}</span>
              </button>
            ))}
          </div>
        </motion.nav>

        {/* Main Content */}
        <motion.main
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 p-6"
        >
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </motion.main>
      </div>
    </div>
  )
}

export default AdminDashboard