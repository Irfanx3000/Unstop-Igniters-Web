import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useEvents } from '../hooks/useEvents'
import GlassCard from '../components/GlassCard'

const EventManagement = () => {
  const [activeTab, setActiveTab] = useState('unstop')
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    event_type: 'igniters',
    external_link: ''
  })

  const { events, addEvent, updateEvent, deleteEvent } = useEvents()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, formData)
      } else {
        await addEvent(formData)
      }
      setShowForm(false)
      setEditingEvent(null)
      setFormData({
        title: '',
        description: '',
        event_date: '',
        event_type: 'igniters',
        external_link: ''
      })
    } catch (error) {
      alert('Error saving event.')
    }
  }

  const handleEdit = (event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description || '',
      event_date: event.event_date ? event.event_date.slice(0, 16) : '',
      event_type: event.event_type,
      external_link: event.external_link || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure?')) {
      try {
        await deleteEvent(id)
      } catch (err) {
        alert('Error deleting event.')
      }
    }
  }

  const filteredEvents = events.filter(e => e.event_type === activeTab)

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black text-white">Event Management</h2>
        <button onClick={() => setShowForm(true)} className="gradient-btn">
          + Add Event
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4">
        <button
          onClick={() => setActiveTab('unstop')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            activeTab === 'unstop'
              ? 'gradient-btn text-white'
              : 'bg-white/10 text-gray-300 hover:bg-white/20'
          }`}
        >
          Unstop Events
        </button>

        <button
          onClick={() => setActiveTab('igniters')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            activeTab === 'igniters'
              ? 'gradient-btn text-white'
              : 'bg-white/10 text-gray-300 hover:bg-white/20'
          }`}
        >
          Igniters Events
        </button>
      </div>

      {/* Event Form Modal */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowForm(false)
            setEditingEvent(null)
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-hot-pink mb-4">
              {editingEvent ? 'Edit Event' : 'Create New Event'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                  className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg focus:ring-2 focus:ring-hot-pink"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows="3"
                  className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg focus:ring-2 focus:ring-hot-pink"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    Event Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.event_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
                    className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg focus:ring-2 focus:ring-hot-pink"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    Event Type
                  </label>
                  <select
                    value={formData.event_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, event_type: e.target.value }))}
                    className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg"
                  >
                    <option value="igniters">Igniters Event</option>
                    <option value="unstop">Unstop Event</option>
                  </select>
                </div>

              </div>

              {/* External Link */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  External Link (Optional)
                </label>
                <input
                  type="url"
                  value={formData.external_link}
                  onChange={(e) => setFormData(prev => ({ ...prev, external_link: e.target.value }))}
                  placeholder="https://unstop.com/event-link"
                  className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg focus:ring-2 focus:ring-hot-pink"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingEvent(null)
                  }}
                  className="flex-1 py-3 px-4 border border-white/20 text-white rounded-xl hover:bg-white/10"
                >
                  Cancel
                </button>

                <button type="submit" className="flex-1 gradient-btn">
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </button>
              </div>

            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Events list */}
      <div className="grid gap-6">
        {filteredEvents.map((event) => (
          <GlassCard key={event.id} className="p-6 bg-white/10 border border-white/20">
            <div className="flex justify-between items-start mb-4">

              <div>
                <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>

                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold
                  ${
                    event.event_type === 'unstop'
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-hot-pink/20 text-hot-pink'
                  }`}
                >
                  {event.event_type}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(event)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>

            </div>

            {event.description && (
              <p className="text-gray-300 mb-4">{event.description}</p>
            )}

            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              {event.event_date && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(event.event_date).toLocaleString()}
                </div>
              )}

              {event.external_link && (
                <a
                  href={event.external_link}
                  target="_blank"
                  className="flex items-center text-blue-400 hover:text-blue-300"
                >
                  External Link →
                </a>
              )}
            </div>
          </GlassCard>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <GlassCard className="p-12 text-center bg-white/10 border border-white/20 text-gray-300">
          No {activeTab} events found.
        </GlassCard>
      )}
    </div>
  )
}

export default EventManagement
