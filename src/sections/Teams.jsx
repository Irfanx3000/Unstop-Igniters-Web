import React from 'react'
import { motion } from 'framer-motion'
import { useTeam } from '../hooks/useTeams'
import GlassCard from '../components/GlassCard'

const Team = () => {
  const { teamMembers, loading } = useTeam()

  const getRoleDisplay = (role) => {
    const roleMap = {
      president: 'Club President',
      coordinator: 'Faculty Coordinator',
      core: 'Core Team Member',
      volunteer: 'General Volunteer'
    }
    return roleMap[role] || role
  }

  const getRoleLevel = (role) => {
    const levelMap = {
      president: 1,
      coordinator: 1,
      core: 2,
      volunteer: 3
    }
    return levelMap[role] || 3
  }

  const groupedMembers = teamMembers.reduce((acc, member) => {
    const level = getRoleLevel(member.role)
    if (!acc[level]) acc[level] = []
    acc[level].push(member)
    return acc
  }, {})

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
    <section id="team" className="min-h-screen py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-black mb-6">
            <span className="text-black">Our</span>
            <span className="text-hot-pink"> Team</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Meet the passionate individuals who drive the Igniters Club forward 
            with innovation, dedication, and teamwork.
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-hot-pink"></div>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Level 1 - President & Coordinator */}
            {groupedMembers[1] && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
              >
                {groupedMembers[1].map((member, index) => (
                  <motion.div
                    key={member.id}
                    variants={itemVariants}
                    custom={index}
                  >
                    <GlassCard hover={true} className="p-8 text-center">
                      <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#FF4DA6] to-[#FF8A29] p-1">
                        {member.image_url ? (
                          <img
                            src={member.image_url}
                            alt={member.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-white text-2xl font-bold">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">{member.name}</h3>
                      <p className="text-hot-pink font-semibold mb-4">{getRoleDisplay(member.role)}</p>
                      {member.bio && (
                        <p className="text-gray-600 text-sm">{member.bio}</p>
                      )}
                    </GlassCard>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Level 2 - Core Team */}
            {groupedMembers[2] && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <h3 className="text-3xl font-bold text-center mb-8 text-gray-800">Core Team</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedMembers[2].map((member, index) => (
                    <motion.div
                      key={member.id}
                      variants={itemVariants}
                      custom={index}
                    >
                      <GlassCard hover={true} className="p-6 text-center">
                        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#FF4DA6] to-[#FF8A29] p-1">
                          {member.image_url ? (
                            <img
                              src={member.image_url}
                              alt={member.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-white font-bold">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </div>
                          )}
                        </div>
                        <h4 className="text-lg font-bold text-gray-800 mb-1">{member.name}</h4>
                        <p className="text-hot-pink text-sm font-semibold">{getRoleDisplay(member.role)}</p>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Level 3 - Volunteers */}
            {groupedMembers[3] && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <h3 className="text-3xl font-bold text-center mb-8 text-gray-800">Volunteers</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {groupedMembers[3].map((member, index) => (
                    <motion.div
                      key={member.id}
                      variants={itemVariants}
                      custom={index}
                    >
                      <GlassCard hover={true} className="p-4 text-center">
                        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r from-[#FF4DA6] to-[#FF8A29] p-1">
                          {member.image_url ? (
                            <img
                              src={member.image_url}
                              alt={member.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-white text-sm font-bold">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </div>
                          )}
                        </div>
                        <h5 className="font-bold text-gray-800 text-sm mb-1">{member.name}</h5>
                        <p className="text-hot-pink text-xs font-semibold">Volunteer</p>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default Team