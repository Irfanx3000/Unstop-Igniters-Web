import React from "react";
import { motion } from "framer-motion";
import { useTeam } from "../hooks/useTeam";
import GlassCard from "../components/GlassCard";

const Team = () => {
  const { teamMembers, loading } = useTeam();

  const getRoleDisplay = (role) => {
    const roleMap = {
      president: "Club President",
      coordinator: "Faculty Coordinator",
      core: "Core Team Member",
      volunteer: "General Volunteer",
    };
    return roleMap[role] || role;
  };

  const getRoleLevel = (role) => {
    const levelMap = {
      president: 1,
      coordinator: 1,
      core: 2,
      volunteer: 3,
    };
    return levelMap[role] || 3;
  };

  const groupedMembers = teamMembers.reduce((acc, member) => {
    const level = getRoleLevel(member.role);
    if (!acc[level]) acc[level] = [];
    acc[level].push(member);
    return acc;
  }, {});

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <section
      id="team"
      className="min-h-screen py-20 relative overflow-hidden bg-[#050505]"
    >
      {/* 🌌 Nebula Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-pink-500/20 blur-[180px] rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-orange-500/20 blur-[180px] rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-20">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-black mb-6">
            <span className="text-white">Our</span>
            <span className="text-hot-pink"> Team</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Meet the passionate individuals who drive the Igniters Club forward
            with dedication, innovation, and teamwork.
          </p>
        </motion.div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-hot-pink"></div>
          </div>
        ) : (
          <div className="space-y-20">
            {/* ======================= */}
            {/* LEVEL 1 — Leaders */}
            {/* ======================= */}
            {groupedMembers[1] && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto"
              >
                {groupedMembers[1].map((member, index) => (
                  <motion.div key={member.id} variants={itemVariants}>
                    <GlassCard
                      hover
                      className="
                        p-10 text-center 
                        bg-white/10 backdrop-blur-xl 
                        border border-white/20 
                        rounded-3xl
                        shadow-[0_0_40px_rgba(255,80,150,0.25)]
                      "
                    >
                      {/* Profile Image */}
                      <div className="w-36 h-36 mx-auto mb-6 rounded-full p-1 bg-gradient-to-r from-hot-pink to-orange-400">
                        {member.image_url ? (
                          <img
                            src={member.image_url}
                            alt={member.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center text-black font-bold text-2xl">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                        )}
                      </div>

                      <h3 className="text-2xl font-bold text-white mb-2">
                        {member.name}
                      </h3>
                      <p className="text-hot-pink font-semibold mb-3">
                        {getRoleDisplay(member.role)}
                      </p>

                      {member.bio && (
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {member.bio}
                        </p>
                      )}
                    </GlassCard>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* ======================= */}
            {/* LEVEL 2 — Core Team */}
            {/* ======================= */}
            {groupedMembers[2] && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <h3 className="text-3xl font-bold text-center mb-10 text-white">
                  Core Team
                </h3>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {groupedMembers[2].map((member, index) => (
                    <motion.div key={member.id} variants={itemVariants}>
                      <GlassCard
                        hover
                        className="
                          p-8 text-center 
                          bg-white/10 backdrop-blur-xl 
                          border border-white/20 
                          rounded-3xl
                          shadow-[0_0_25px_rgba(255,80,150,0.20)]
                        "
                      >
                        <div className="w-28 h-28 mx-auto mb-4 rounded-full p-1 bg-gradient-to-r from-hot-pink to-orange-400">
                          {member.image_url ? (
                            <img
                              src={member.image_url}
                              alt={member.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center text-black font-bold">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                          )}
                        </div>

                        <h4 className="text-xl font-bold text-white mb-1">
                          {member.name}
                        </h4>
                        <p className="text-hot-pink text-sm font-semibold">
                          {getRoleDisplay(member.role)}
                        </p>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ======================= */}
            {/* LEVEL 3 — Volunteers */}
            {/* ======================= */}
            {groupedMembers[3] && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <h3 className="text-3xl font-bold text-center mb-10 text-white">
                  Volunteers
                </h3>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {groupedMembers[3].map((member, index) => (
                    <motion.div key={member.id} variants={itemVariants}>
                      <GlassCard
                        hover
                        className="
                          p-5 text-center 
                          bg-white/10 backdrop-blur-xl 
                          border border-white/20 
                          rounded-3xl
                        "
                      >
                        <div className="w-20 h-20 mx-auto mb-3 rounded-full p-1 bg-gradient-to-r from-hot-pink to-orange-400">
                          {member.image_url ? (
                            <img
                              src={member.image_url}
                              alt={member.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center text-black font-bold text-sm">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                          )}
                        </div>

                        <h5 className="font-bold text-white text-sm">
                          {member.name}
                        </h5>
                        <p className="text-hot-pink text-xs font-semibold">
                          Volunteer
                        </p>
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
  );
};

export default Team;
