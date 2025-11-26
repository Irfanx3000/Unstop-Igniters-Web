import React from 'react'
import { useRegistrations } from '../hooks/useRegistrations'
import { useEvents } from '../hooks/useEvents'
import { useTeam } from '../hooks/useTeams'
import GlassCard from '../components/GlassCard'

const Analytics = () => {
  const { registrations } = useRegistrations()
  const { events } = useEvents()
  const { teamMembers } = useTeam()

  const totalRegistrations = registrations.length
  const totalEvents = events.length
  const totalTeamMembers = teamMembers.length

  // Calculate recent registrations (last 7 days)
  const recentRegistrations = registrations.filter(reg => {
    const regDate = new Date(reg.registered_at)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    return regDate >= weekAgo
  }).length

  // Group registrations by event
  const registrationsByEvent = events.map(event => ({
    name: event.title,
    registrations: registrations.filter(r => r.event_id === event.id).length
  })).filter(item => item.registrations > 0)

  // Group team members by role
  const teamByRole = teamMembers.reduce((acc, member) => {
    acc[member.role] = (acc[member.role] || 0) + 1
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-black text-gray-800 mb-6">Analytics Dashboard</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6 text-center hover-glow">
          <div className="text-3xl font-black text-hot-pink mb-2">{totalRegistrations}</div>
          <div className="text-gray-600 font-semibold">Total Registrations</div>
          <div className="text-sm text-green-500 mt-1">
            +{recentRegistrations} this week
          </div>
        </GlassCard>
        
        <GlassCard className="p-6 text-center hover-glow">
          <div className="text-3xl font-black text-orange-500 mb-2">{totalEvents}</div>
          <div className="text-gray-600 font-semibold">Total Events</div>
          <div className="text-sm text-gray-500 mt-1">
            {events.filter(e => e.event_type === 'igniters').length} Igniters
          </div>
        </GlassCard>
        
        <GlassCard className="p-6 text-center hover-glow">
          <div className="text-3xl font-black text-yellow-500 mb-2">{totalTeamMembers}</div>
          <div className="text-gray-600 font-semibold">Team Members</div>
          <div className="text-sm text-gray-500 mt-1">
            {teamByRole.core || 0} Core members
          </div>
        </GlassCard>
        
        <GlassCard className="p-6 text-center hover-glow">
          <div className="text-3xl font-black text-blue-500 mb-2">
            {registrationsByEvent.length > 0 ? Math.max(...registrationsByEvent.map(r => r.registrations)) : 0}
          </div>
          <div className="text-gray-600 font-semibold">Most Popular Event</div>
          <div className="text-sm text-gray-500 mt-1">
            {registrationsByEvent[0]?.name || 'No data'}
          </div>
        </GlassCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Registrations */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Registrations</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {registrations.slice(0, 10).map(registration => (
              <div key={registration.id} className="flex items-center justify-between p-3 bg-white/50 rounded-lg hover:bg-white/70 transition-colors">
                <div>
                  <div className="font-semibold text-gray-800">{registration.name}</div>
                  <div className="text-sm text-gray-600">{registration.email}</div>
                  <div className="text-xs text-gray-500">{registration.course}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-hot-pink">{registration.events?.title}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(registration.registered_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
            {registrations.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No registrations yet
              </div>
            )}
          </div>
        </GlassCard>

        {/* Event-wise Registrations */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Registrations by Event</h3>
          <div className="space-y-4">
            {registrationsByEvent.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-700 font-medium truncate">{item.name}</span>
                  <span className="font-semibold text-hot-pink">{item.registrations}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-[#FF4DA6] to-[#FF8A29] h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(item.registrations / Math.max(...registrationsByEvent.map(r => r.registrations))) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
            {registrationsByEvent.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No registration data available
              </div>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Team Statistics */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Team Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(teamByRole).map(([role, count]) => (
            <div key={role} className="text-center p-4 bg-white/50 rounded-xl">
              <div className="text-2xl font-black text-hot-pink mb-1">{count}</div>
              <div className="text-sm text-gray-600 capitalize">{role}s</div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}

export default Analytics