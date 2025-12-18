import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "../components/GlassCard";
import RegistrationModal from "../components/RegistrationModal";
import logo from "../assets/background-logo.png";
import { useEvents } from "../hooks/useEvents";

/* =========================================================
   HERO SECTION
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
        pt-28 sm:pt-32 md:pt-36 min-h-screen
      "
    >
      {/* 🌌 Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-[420px] h-[420px] sm:w-[520px] sm:h-[520px] md:w-[650px] md:h-[600px] bg-pink-600/25 blur-[180px]" />
        <div className="absolute bottom-0 right-0 w-[420px] h-[420px] sm:w-[520px] sm:h-[520px] md:w-[700px] md:h-[650px] bg-orange-500/20 blur-[200px]" />
      </div>

      {/* Watermark */}
      <div className="absolute inset-0 opacity-[0.04] flex items-center justify-center">
        <img
          src={logo}
          alt="logo"
          className="w-[500px] sm:w-[650px] md:w-[900px]"
        />
      </div>

      <div className="relative z-20 container mx-auto px-4 sm:px-6">
        {/* ================= GRID ================= */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* ================= LEFT CONTENT ================= */}
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

            <p className="mt-5 sm:mt-6 text-base sm:text-lg text-gray-300 max-w-xl">
              A premium student-driven ecosystem fostering innovation,
              leadership, and startup culture through impactful events.
            </p>

            {/* Search */}
            <div className="relative mt-7 sm:mt-8 max-w-xl">
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
                <div className="absolute mt-2 w-full bg-black/80 border border-white/20 rounded-xl overflow-hidden z-30">
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

          {/* ================= RIGHT COLUMN ================= */}
          <div className="flex flex-col gap-6">

            {/* ----------- CAROUSEL ----------- */}
            <div className="relative h-[360px] sm:h-[400px] md:h-[460px]">
              {next && (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0.35, y: 30 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0 z-10"
                >
                  <GlassCard className="p-4 sm:p-5 md:p-6 rounded-3xl bg-white/5">
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
                    className="p-4 sm:p-5 md:p-6 rounded-3xl bg-white/10 cursor-pointer"
                  >
                    <HeroEventCard event={current} />
                  </GlassCard>
                </motion.div>
              )}
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

const HeroEventCard = ({ event, muted }) => {
  const status = event.registration_status || "active";

  return (
    <div className={`group ${muted ? "opacity-70" : ""}`}>
      <div className="relative h-44 sm:h-52 md:h-60 overflow-hidden rounded-2xl">
        <img
          src={event.image_url}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      <div className="mt-4 sm:mt-6">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-base sm:text-lg">
            {event.title}
          </h3>
          <span className="text-xs px-3 py-1 rounded-full bg-hot-pink/20 text-hot-pink">
            {status.toUpperCase()}
          </span>
        </div>

        <p className="mt-2 sm:mt-3 text-sm text-gray-400 line-clamp-2">
          {event.description}
        </p>
      </div>
    </div>
  );
};

export default Hero;
