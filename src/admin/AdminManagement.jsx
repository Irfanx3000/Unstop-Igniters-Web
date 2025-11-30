import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../supabase/client'
import GlassCard from '../components/GlassCard'

const AdminManagement = () => {
  const [admins, setAdmins] = useState([])
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    const { data, error } = await supabase
      .from('admin_roles')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) {
      setAdmins(data || [])
    }
  }

  const addAdmin = async (e) => {
    e.preventDefault()
    if (!newAdminEmail) return

    setLoading(true)
    const { error } = await supabase
      .from('admin_roles')
      .insert([{ email: newAdminEmail }])

    if (!error) {
      setNewAdminEmail('')
      fetchAdmins()
    }
    setLoading(false)
  }

  const removeAdmin = async (id) => {
    if (confirm('Are you sure you want to remove this admin?')) {
      const { error } = await supabase
        .from('admin_roles')
        .delete()
        .eq('id', id)

      if (!error) {
        fetchAdmins()
      }
    }
  }

  return (
    <div className="space-y-6">

      <h2 className="text-3xl font-black text-white drop-shadow-lg">
        Admin Management
      </h2>

      {/* Add Admin */}
      <GlassCard className="p-6 bg-white/10 backdrop-blur-xl border border-white/10 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-4">
          Add New Admin
        </h3>

        <form onSubmit={addAdmin} className="flex gap-4">

          {/* EMAIL INPUT */}
          <input
            type="email"
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
            placeholder="Enter admin email"
            className="flex-1 px-4 py-3 rounded-lg 
                       bg-black/40 text-white border border-white/20 
                       placeholder-white/40
                       focus:ring-2 focus:ring-hot-pink focus:border-transparent"
          />

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="gradient-btn disabled:opacity-50"
          >
            Add Admin
          </button>
        </form>
      </GlassCard>

      {/* Current Admin List */}
      <GlassCard className="p-6 bg-white/10 backdrop-blur-xl border border-white/10 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-4">
          Current Admins
        </h3>

        <div className="space-y-3">
          {admins.map(admin => (
            <div
              key={admin.id}
              className="flex justify-between items-center 
                         p-4 rounded-lg bg-black/40 border border-white/10"
            >
              <div>
                <div className="font-semibold text-white">{admin.email}</div>
                <div className="text-sm text-white/60">
                  Added: {new Date(admin.created_at).toLocaleDateString()}
                </div>
              </div>

              <button
                onClick={() => removeAdmin(admin.id)}
                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
              >
                Remove
              </button>
            </div>
          ))}

          {admins.length === 0 && (
            <div className="text-center text-white/50 py-6">
              No admins added yet.
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  )
}

export default AdminManagement
