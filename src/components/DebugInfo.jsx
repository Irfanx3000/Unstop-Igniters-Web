import React from 'react'
import { useAuth } from '../context/AuthContext'

const DebugInfo = () => {
  const { user, isAdmin, loading } = useAuth()
  
  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs z-50">
      <div>User: {user ? user.email : 'None'}</div>
      <div>Admin: {isAdmin ? 'Yes' : 'No'}</div>
      <div>Loading: {loading ? 'Yes' : 'No'}</div>
    </div>
  )
}

export default DebugInfo