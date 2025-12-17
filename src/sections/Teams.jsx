import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTeam } from "../hooks/useTeam";
import GlassCard from "../components/GlassCard";

const Team = () => {
  const { teamMembers, loading } = useTeam();
  const [selectedMember, setSelectedMember] = useState(null);

  const roleMap = {
    president: { label: "Club President", level: 1 },
    coordinator: { label: "Faculty Coordinator", level: 1 },
    core: { label: "Core Team Member", level: 2 },
    volunteer: { label: "Volunteer", level: 3 },
  };

  const groupedMembers = teamMembers.reduce((acc, member) => {
    const level = roleMap[member.role]?.level || 3;
    acc[level] = [...(acc[level] || []), member];
    return acc;
  }, {});

  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const item = {
    hidden: { y: 18, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <section
      id="team"
      className="relative min-h-screen py-24 bg-[#050505] overflow-hidden"
    >
      {/* Background glow – toned down */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-pink-500/10 blur-[200px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-500/10 blur-[200px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight">
            Our <span className="text-hot-pink">Team</span>
          </h2>
          <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto">
            A collective of leaders, builders, and volunteers working together
            to ignite innovation and impact.
          </p>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-hot-pink border-t-transparent" />
          </div>
        )}

        {!loading && (
          <div className="space-y-24">
            {/* Leaders */}
            {groupedMembers[1] && (
              <motion.div
                variants={container}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto"
              >
                {groupedMembers[1].map((m) => (
                  <motion.div
                    key={m.id}
                    variants={item}
                    onClick={() => setSelectedMember(m)}
                  >
                    <GlassCard
                      hover
                      className="cursor-pointer p-10 text-center rounded-3xl border border-white/15 bg-white/5 backdrop-blur-xl"
                    >
                      <ProfileAvatar member={m} size="xl" />
                      <h3 className="mt-6 text-2xl font-semibold text-white">
                        {m.name}
                      </h3>
                      <p className="mt-1 text-sm font-medium text-hot-pink">
                        {roleMap[m.role]?.label}
                      </p>
                      {m.bio && (
                        <p className="mt-4 text-sm text-gray-400 leading-relaxed line-clamp-3">
                          {m.bio}
                        </p>
                      )}
                    </GlassCard>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Core Team */}
            {groupedMembers[2] && (
              <Section title="Core Team">
                {groupedMembers[2].map((m) => (
                  <MemberCard
                    key={m.id}
                    member={m}
                    onClick={() => setSelectedMember(m)}
                  />
                ))}
              </Section>
            )}

            {/* Volunteers */}
            {groupedMembers[3] && (
              <Section title="Volunteers" cols="lg:grid-cols-4">
                {groupedMembers[3].map((m) => (
                  <MemberCard
                    key={m.id}
                    member={m}
                    compact
                    onClick={() => setSelectedMember(m)}
                  />
                ))}
              </Section>
            )}
          </div>
        )}
      </div>

      {/* Member Dialog */}
      <AnimatePresence>
        {selectedMember && (
          <MemberDialog
            member={selectedMember}
            onClose={() => setSelectedMember(null)}
            roleLabel={roleMap[selectedMember.role]?.label}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Team;

/* ----------------- Helper Components ----------------- */

const Section = ({ title, children, cols = "lg:grid-cols-3" }) => (
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
  >
    <h3 className="text-3xl font-semibold text-center mb-12">{title}</h3>
    <div className={`grid md:grid-cols-2 ${cols} gap-8`}>{children}</div>
  </motion.div>
);

const MemberCard = ({ member, compact, onClick }) => (
  <GlassCard
    hover
    onClick={onClick}
    className={`cursor-pointer text-center rounded-3xl border border-white/15 bg-white/5 backdrop-blur-xl ${
      compact ? "p-5" : "p-7"
    }`}
  >
    <ProfileAvatar member={member} size={compact ? "sm" : "md"} />
    <h4 className="mt-4 font-semibold text-white">{member.name}</h4>
    <p className="text-xs text-hot-pink font-medium">{member.role}</p>
  </GlassCard>
);

const ProfileAvatar = ({ member, size }) => {
  const sizes = {
    xl: "w-36 h-36",
    md: "w-28 h-28",
    sm: "w-20 h-20",
  };

  return (
    <div
      className={`${sizes[size]} mx-auto rounded-full p-[2px] bg-gradient-to-r from-hot-pink to-orange-400`}
    >
      {member.image_url ? (
        <img
          src={member.image_url}
          alt={member.name}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center font-bold text-black">
          {member.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
      )}
    </div>
  );
};

const MemberDialog = ({ member, roleLabel, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
  >
    <motion.div
      initial={{ scale: 0.95, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.95, y: 20 }}
      className="max-w-lg w-full rounded-3xl border border-white/20 bg-[#0b0b0b] p-8"
    >
      <ProfileAvatar member={member} size="xl" />
      <h3 className="mt-6 text-2xl font-semibold text-center">
        {member.name}
      </h3>
      <p className="text-center text-hot-pink font-medium">{roleLabel}</p>

      {member.bio && (
        <p className="mt-6 text-gray-300 text-sm leading-relaxed text-center">
          {member.bio}
        </p>
      )}

      <button
        onClick={onClose}
        className="mt-8 mx-auto block rounded-full px-6 py-2 text-sm font-medium bg-white/10 hover:bg-white/20 transition"
      >
        Close
      </button>
    </motion.div>
  </motion.div>
);
