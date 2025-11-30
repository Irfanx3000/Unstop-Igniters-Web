import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useTeam } from '../hooks/useTeam'
import GlassCard from '../components/GlassCard'

const TeamManagement = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    role: 'volunteer',
    bio: '',
    image_url: '',
    social_links: {
      linkedin: '',
      github: '',
      twitter: '',
      instagram: '',
      portfolio: '',
      email: ''
    }
  })
  const [formError, setFormError] = useState('')
  const [formLoading, setFormLoading] = useState(false)

  const { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember, loading } = useTeam()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)
    setFormError('')

    if (!formData.name.trim()) {
      setFormError('Please enter a name')
      setFormLoading(false)
      return
    }

    try {
      const memberData = { ...formData }

      if (editingMember) {
        await updateTeamMember(editingMember.id, memberData)
      } else {
        await addTeamMember(memberData)
      }

      resetForm()
    } catch (error) {
      setFormError('Error saving team member.')
    } finally {
      setFormLoading(false)
    }
  }

  const handleEdit = (member) => {
    setEditingMember(member)
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio || '',
      image_url: member.image_url || '',
      social_links: member.social_links || {
        linkedin: '',
        github: '',
        twitter: '',
        instagram: '',
        portfolio: '',
        email: ''
      }
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this team member?')) {
      await deleteTeamMember(id)
    }
  }

  const handleSocialLinkChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [platform]: value
      }
    }))
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingMember(null)
    setFormData({
      name: '',
      role: 'volunteer',
      bio: '',
      image_url: '',
      social_links: {
        linkedin: '',
        github: '',
        twitter: '',
        instagram: '',
        portfolio: '',
        email: ''
      }
    })
    setFormError('')
  }

  const roleOrder = { president: 1, coordinator: 2, core: 3, volunteer: 4 }
  const sortedMembers = [...teamMembers].sort((a, b) => roleOrder[a.role] - roleOrder[b.role])

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black text-white">Team Management</h2>
        <button onClick={() => setShowForm(true)} className="gradient-btn">
          + Add Team Member
        </button>
      </div>

      {/* FORM MODAL */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={resetForm}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-hot-pink mb-4">
              {editingMember ? "Edit Team Member" : "Add New Team Member"}
            </h3>

            {formError && (
              <div className="p-3 bg-red-500/20 text-red-300 border border-red-400 rounded-lg text-sm mb-4">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* NAME */}
              <div>
                <label className="block text-sm text-white/80 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg focus:ring-hot-pink focus:ring-2"
                />
              </div>

              {/* ROLE */}
              <div>
                <label className="block text-sm text-white/80 mb-1">Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-4 py-2 bg-black/40 text-white border border-white/20 rounded-lg 
                            focus:ring-2 focus:ring-hot-pink focus:border-transparent appearance-none">
                  <option value="volunteer" className="bg-black text-white">General Volunteer</option>
                  <option value="core" className="bg-black text-white">Core Team Member</option>
                  <option value="coordinator" className="bg-black text-white">Faculty Coordinator</option>
                  <option value="president" className="bg-black text-white">Club President</option>
                </select>
              </div>

              {/* BIO */}
              <div>
                <label className="block text-sm text-white/80 mb-1">Bio</label>
                <textarea
                  rows="3"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg focus:ring-hot-pink focus:ring-2"
                />
              </div>

              {/* IMAGE */}
              <div>
                <label className="block text-sm text-white/80 mb-1">Profile Image URL</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg"
                />
              </div>

              {/* SOCIAL LINKS */}
              <div className="pt-4 border-t border-white/10">
                <h4 className="text-lg font-semibold text-white mb-3">Social Links</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.keys(formData.social_links).map(platform => (
                    <div key={platform}>
                      <label className="block text-xs text-white/60 capitalize mb-1">
                        {platform}
                      </label>
                      <input
                        type="url"
                        value={formData.social_links[platform]}
                        onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white/10 text-white border border-white/20 rounded-lg focus:ring-hot-pink"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-3 border border-white/20 text-white rounded-xl hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 gradient-btn disabled:opacity-50"
                >
                  {formLoading ? "Saving..." : editingMember ? "Update" : "Add Member"}
                </button>
              </div>

            </form>
          </motion.div>
        </motion.div>
      )}

      {/* TEAM LIST */}
      {loading ? (
        <div className="text-center text-white py-8">Loading...</div>
      ) : (
        sortedMembers.map(member => (
          <GlassCard key={member.id} className="p-6 bg-white/5 border border-white/10">

            <div className="flex gap-6 items-start">

              {/* IMAGE */}
              <div className="w-24 h-24 rounded-full overflow-hidden">
                {member.image_url ? (
                  <img src={member.image_url} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-700 text-white flex items-center justify-center text-xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
              </div>

              {/* INFO */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">{member.name}</h3>

                <p className="text-hot-pink font-semibold mt-1">
                  {member.role}
                </p>

                {member.bio && (
                  <p className="text-gray-300 mt-2">{member.bio}</p>
                )}

                {/* Socials */}
                {member.social_links &&
                  Object.values(member.social_links).some(link => link) && (
                    <div className="flex flex-wrap gap-3 mt-3">
                      {Object.entries(member.social_links).map(([platform, url]) =>
                        url ? (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            className="px-3 py-1 bg-white/10 text-white rounded-md text-sm hover:bg-white/20"
                          >
                            {platform}
                          </a>
                        ) : null
                      )}
                    </div>
                  )}

                <p className="text-xs text-gray-500 mt-3">
                  Added: {new Date(member.created_at).toLocaleDateString()}
                </p>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleEdit(member)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(member.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>

            </div>

          </GlassCard>
        ))
      )}

      {teamMembers.length === 0 && !loading && (
        <GlassCard className="p-12 text-center text-gray-300">
          No team members found.
        </GlassCard>
      )}

    </div>
  )
}

export default TeamManagement
