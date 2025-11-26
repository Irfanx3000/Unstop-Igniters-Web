import React, { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import UserWebsite from './UserWebsite'
import Login from './components/Login'
import Signup from './components/Signup'
import AdminDashboard from './admin/AdminDashboard'


function AppContent() {
  const { user, isAdmin, loading } = useAuth()
  const [authMode, setAuthMode] = useState(null)
  const [viewMode, setViewMode] = useState('user')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-hot-pink"></div>
          <p className="mt-4 text-gray-600">Loading..</p>
        </div>
      </div>
    )
  }

  if (isAdmin && viewMode === 'admin') {
    return (
      <AdminDashboard 
        onViewUserWebsite={() => setViewMode('user')} 
      />
    )
  }

  if (authMode) {
    return authMode === 'login' ? (
      <Login 
        onClose={() => setAuthMode(null)} 
        onSwitchToSignup={() => setAuthMode('signup')} 
      />
    ) : (
      <Signup 
        onClose={() => setAuthMode(null)} 
        onSwitchToLogin={() => setAuthMode('login')} 
      />
    )
  }

  return (
    <UserWebsite 
      onViewAdmin={() => setViewMode('admin')} 
      onShowAuth={setAuthMode} 
    />
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App