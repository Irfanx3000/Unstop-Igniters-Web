import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "../components/GlassCard";
import RegistrationModal from "../components/RegistrationModal";
import logo from "../assets/background-logo.png";
import { useEvents } from "../hooks/useEvents";

/* =========================================================
   HERO SECTION (RESPONSIVE FIXED)
========================================================= */

const Hero = () => {
  const { events = [] } = useEvents("igniters");

  const [active, setActive] = useState(0);
  const [query, setQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  /* ================= CAROUSEL ================= */
  useEffect(() => {
    if (!events.length) return;
    const id = setInterval(
      () => setActive((p) => (p + 1) % events.length),
      5000
    );
    return () => clearInterval(id);
  }, [events]);

  const current = events[active] || null;
  const next = events[(active + 1) % events.length] || null;

  /* ================= SEARCH ================= */
  const suggestions = useMemo(() => {
    if (!query) return [];
    return events
      .filter((e) =>
        e.title?.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5);
  }, [query, events]);

  /* ================= STATS ================= */
  const stats = useMemo(() => {
    return [
      { label: "Total Events", value: events.length },
      {
        label: "Active Registrations",
        value: events.filter(
          (e) => (e.registration_status || "active") === "active"
        ).length,
      },
      {
        label: "Upcoming Events",
        value: events.filter(
          (e) => e.registration_status === "upcoming"
        ).length,
      },
    ];
  }, [events]);

  return (
    <section
      id="hero"
      className="
        relative bg-[#050505] text-white overflow-hidden
        pt-28 md:pt-32 min-h-screen
      "
    >
      {/* 🌌 BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-[450px] h-[450px] md:w-[650px] md:h-[600px] bg-pink-600/25 blur-[180px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] md:w-[700px] md:h-[650px] bg-orange-500/20 blur-[200px]" />
      </div>

      {/* WATERMARK */}
      <div className="absolute inset-0 opacity-[0.035] flex items-center justify-center -z-10">
        <img
          src={logo}
          alt="logo"
          className="w-[500px] md:w-[800px]"
        />
      </div>

      <div className="container mx-auto px-5 sm:px-6 relative z-20">
        {/* ================= GRID ================= */}
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-start">

          {/* ================= LEFT ================= */}
          <div className="max-w-xl">
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="px-4 py-1.5 rounded-full text-sm bg-hot-pink/20 text-hot-pink">
                🚀 Unstop Igniters
              </span>
              <span className="px-4 py-1.5 rounded-full text-sm bg-orange-500/20 text-orange-300">
                🔥 Trending
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight">
              Ignite <br />
              <span className="bg-gradient-to-r from-hot-pink to-orange-400 bg-clip-text text-transparent">
                Startup
              </span>{" "}
              Excellence
            </h1>

            <p className="mt-5 text-base sm:text-lg text-gray-300">
              A premium student-driven ecosystem fostering innovation,
              leadership, and startup culture through impactful events.
            </p>

            {/* SEARCH */}
            <div className="relative mt-7">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search events..."
                className="
                  w-full px-5 py-3 rounded-xl
                  bg-white/10 border border-white/20
                  focus:ring-2 focus:ring-hot-pink
                "
              />

              {suggestions.length > 0 && (
                <div className="absolute mt-2 w-full bg-black/90 border border-white/20 rounded-xl overflow-hidden z-30">
                  {suggestions.map((e) => (
                    <button
                      key={e.id}
                      onClick={() =>
                        document
                          .getElementById("events")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                      className="w-full text-left px-5 py-3 hover:bg-white/10"
                    >
                      {e.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="flex flex-col gap-8">

            {/* -------- CAROUSEL -------- */}
            <div className="relative h-[380px] sm:h-[420px] md:h-[460px]">
              {next && (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0.35, y: 30 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0 z-10"
                >
                  <GlassCard className="p-5 sm:p-6 rounded-3xl bg-white/5">
                    <HeroEventCard event={next} muted />
                  </GlassCard>
                </motion.div>
              )}

              {current && (
                <motion.div className="absolute inset-0 z-20">
                  <GlassCard
                    onClick={() => {
                      if ((current.registration_status || "active") === "active") {
                        setSelectedEvent(current);
                        setModalOpen(true);
                      }
                    }}
                    className="p-5 sm:p-6 rounded-3xl bg-white/10 cursor-pointer"
                  >
                    <HeroEventCard event={current} />
                  </GlassCard>
                </motion.div>
              )}
            </div>

            {/* -------- STATS (UNDER CAROUSEL) -------- */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 text-center">
              {stats.map((s) => (
                <Stat key={s.label} value={s.value} label={s.label} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {selectedEvent && (
        <RegistrationModal
          event={selectedEvent}
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </section>
  );
};

/* =========================================================
   HELPERS
========================================================= */

const Stat = ({ value, label }) => (
  <div>
    <h4 className="text-2xl sm:text-3xl font-black">{value}</h4>
    <p className="text-xs sm:text-sm text-gray-400 mt-1">{label}</p>
  </div>
);

const HeroEventCard = ({ event, muted }) => {
  const status = event.registration_status || "active";

  return (
    <div className={`group ${muted ? "opacity-70" : ""}`}>
      <div className="relative h-48 sm:h-56 overflow-hidden rounded-2xl">
        <img
          src={event.image_url}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      <div className="mt-5">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-base sm:text-lg">{event.title}</h3>
          <span className="text-xs px-3 py-1 rounded-full bg-hot-pink/20 text-hot-pink">
            {status.toUpperCase()}
          </span>
        </div>

        <p className="mt-3 text-sm text-gray-400 line-clamp-2">
          {event.description}
        </p>
      </div>
    </div>
  );
};

export default Hero;
