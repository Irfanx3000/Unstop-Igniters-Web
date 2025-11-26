import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useEvents } from '../hooks/useEvents'
import GlassCard from '../components/GlassCard'
import RegistrationModal from '../components/RegistrationModal'

const Events = () => {
  const [activeTab, setActiveTab] = useState('unstop')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  
  const { events: unstopEvents, loading: unstopLoading } = useEvents('unstop')
  const { events: ignitersEvents, loading: ignitersLoading } = useEvents('igniters')

  const handleEventClick = (event) => {
    if (activeTab === 'igniters') {
      setSelectedEvent(event)
      setModalOpen(true)
    } else if (event.external_link) {
      window.open(event.external_link, '_blank')
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  return (
    <section id="events" className="min-h-screen py-20 bg-gradient-to-b from-white to-pink-50/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-black mb-6">
            <span className="text-hot-pink">Events</span>
            <span className="text-black"> & Activities</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover exciting competitions, workshops, and networking opportunities 
            to fuel your passion and accelerate your growth.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <GlassCard className="p-2 inline-flex">
            <button
              onClick={() => setActiveTab('unstop')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'unstop'
                  ? 'gradient-btn text-white'
                  : 'text-gray-600 hover:text-hot-pink'
              }`}
            >
              Unstop Events
            </button>
            <button
              onClick={() => setActiveTab('igniters')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'igniters'
                  ? 'gradient-btn text-white'
                  : 'text-gray-600 hover:text-hot-pink'
              }`}
            >
              Igniters Events
            </button>
          </GlassCard>
        </div>

        {/* Events Grid */}
        <motion.div
          key={activeTab}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {(activeTab === 'unstop' ? unstopEvents : ignitersEvents).map((event, index) => (
            <motion.div
              key={event.id}
              variants={itemVariants}
              custom={index}
            >
              <GlassCard
                hover={true}
                className="p-6 h-full cursor-pointer"
                onClick={() => handleEventClick(event)}
              >
                <div className="mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    event.event_type === 'unstop'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-hot-pink/10 text-hot-pink'
                  }`}>
                    {event.event_type}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-3">{event.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
                
                {event.event_date && (
                  <div className="flex items-center text-gray-500 mb-4">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(event.event_date).toLocaleDateString()}
                  </div>
                )}
                
                <button className={`w-full py-2 rounded-lg font-semibold transition-all ${
                  activeTab === 'unstop'
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'gradient-btn'
                }`}>
                  {activeTab === 'unstop' ? 'View on Unstop' : 'Register Now'}
                </button>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        {(activeTab === 'unstop' ? unstopLoading : ignitersLoading) && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-hot-pink"></div>
          </div>
        )}

        {selectedEvent && (
          <RegistrationModal
            event={selectedEvent}
            isOpen={modalOpen}
            onClose={() => {
              setModalOpen(false)
              setSelectedEvent(null)
            }}
          />
        )}
      </div>
    </section>
  )
}

export default Events