import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useTeam } from '../hooks/useTeams'
import GlassCard from '../components/GlassCard'

const TeamManagement = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    role: 'volunteer',
    bio: '',
    image_url: ''
  })

  const { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember } = useTeam()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingMember) {
        await updateTeamMember(editingMember.id, formData)
      } else {
        await addTeamMember(formData)
      }
      setShowForm(false)
      setEditingMember(null)
      setFormData({
        name: '',
        role: 'volunteer',
        bio: '',
        image_url: ''
      })
    } catch (error) {
      console.error('Error saving team member:', error)
      alert('Error saving team member. Please try again.')
    }
  }

  const handleEdit = (member) => {
    setEditingMember(member)
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio || '',
      image_url: member.image_url || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this team member?')) {
      try {
        await deleteTeamMember(id)
      } catch (error) {
        console.error('Error deleting team member:', error)
        alert('Error deleting team member. Please try again.')
      }
    }
  }

  const getRoleDisplay = (role) => {
    const roleMap = {
      president: 'Club President',
      coordinator: 'Faculty Coordinator',
      core: 'Core Team Member',
      volunteer: 'General Volunteer'
    }
    return roleMap[role] || role
  }

  const roleOrder = {
    president: 1,
    coordinator: 2,
    core: 3,
    volunteer: 4
  }

  const sortedMembers = [...teamMembers].sort((a, b) => roleOrder[a.role] - roleOrder[b.role])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black text-gray-800">Team Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="gradient-btn"
        >
          + Add Team Member
        </button>
      </div>

      {/* Team Member Form Modal */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowForm(false)
            setEditingMember(null)
            setFormData({
              name: '',
              role: 'volunteer',
              bio: '',
              image_url: ''
            })
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-hot-pink mb-4">
              {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hot-pink focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hot-pink focus:border-transparent"
                >
                  <option value="volunteer">General Volunteer</option>
                  <option value="core">Core Team Member</option>
                  <option value="coordinator">Faculty Coordinator</option>
                  <option value="president">Club President</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio/Description</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  rows="3"
                  placeholder="Brief description about the team member..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hot-pink focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image URL</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hot-pink focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">Optional: Provide a direct link to the profile image</p>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingMember(null)
                    setFormData({
                      name: '',
                      role: 'volunteer',
                      bio: '',
                      image_url: ''
                    })
                  }}
                  className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 gradient-btn"
                >
                  {editingMember ? 'Update Member' : 'Add Member'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Team Members List */}
      <div className="space-y-6">
        {sortedMembers.map((member) => (
          <GlassCard key={member.id} className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#FF4DA6] to-[#FF8A29] p-1 flex-shrink-0">
                {member.image_url ? (
                  <img
                    src={member.image_url}
                    alt={member.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-white font-bold text-lg">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-1 ${
                      member.role === 'president' ? 'bg-purple-100 text-purple-600' :
                      member.role === 'coordinator' ? 'bg-blue-100 text-blue-600' :
                      member.role === 'core' ? 'bg-green-100 text-green-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {getRoleDisplay(member.role)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(member)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                {member.bio && (
                  <p className="text-gray-600">{member.bio}</p>
                )}
                
                <div className="text-sm text-gray-500 mt-2">
                  Added: {new Date(member.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {teamMembers.length === 0 && (
        <GlassCard className="p-12 text-center">
          <div className="text-gray-400 text-lg">No team members found.</div>
          <button
            onClick={() => setShowForm(true)}
            className="gradient-btn mt-4"
          >
            Add your first team member
          </button>
        </GlassCard>
      )}
    </div>
  )
}

export default TeamManagement