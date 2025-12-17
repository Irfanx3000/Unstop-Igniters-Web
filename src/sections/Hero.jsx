// import React, { useEffect, useMemo, useState } from "react";
// import { motion } from "framer-motion";
// import GlassCard from "../components/GlassCard";
// import logo from "../assets/background-logo.png";
// import { supabase } from "../supabase/client";

// /* ================= UTIL ================= */
// const formatDate = (date) =>
//   new Date(date).toLocaleDateString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });

// const formatEventDate = (start, end) => {
//   if (!start) return "";
//   if (!end || start === end) return formatDate(start);
//   return `${formatDate(start)} – ${formatDate(end)}`;
// };

// const getTag = (status) => {
//   if (status === "active") return "Registering Now";
//   if (status === "upcoming") return "Upcoming";
//   return "Closed";
// };

// /* ================= HERO ================= */
// const Hero = () => {
//   const [events, setEvents] = useState([]);
//   const [active, setActive] = useState(0);
//   const [query, setQuery] = useState("");

//   /* 🔁 FETCH IGNITERS EVENTS */
//   useEffect(() => {
//     const fetchEvents = async () => {
//       const { data, error } = await supabase
//         .from("events")
//         .select("*")
//         .eq("event_type", "igniters")
//         .in("registration_status", ["active", "upcoming"])
//         .order("event_date", { ascending: true });

//       if (!error) setEvents(data || []);
//     };

//     fetchEvents();
//   }, []);

//   /* 🎯 MAP EVENTS FOR HERO */
//   const heroEvents = useMemo(() => {
//     return events.slice(0, 5).map((e) => ({
//       id: e.id,
//       title: e.title,
//       image: e.image_url,
//       tag: getTag(e.registration_status),
//       date: formatEventDate(e.event_date, e.event_end_date),
//       progress: e.registration_status === "active" ? 70 : 40,
//     }));
//   }, [events]);

//   /* 🔄 AUTO ROTATE */
//   useEffect(() => {
//     if (heroEvents.length <= 1) return;
//     const interval = setInterval(
//       () => setActive((p) => (p + 1) % heroEvents.length),
//       5000
//     );
//     return () => clearInterval(interval);
//   }, [heroEvents.length]);

//   const current = heroEvents[active];
//   const next = heroEvents[(active + 1) % heroEvents.length];

//   /* 🔍 SEARCH */
//   const suggestions = useMemo(() => {
//     if (!query) return [];
//     return events
//       .filter((e) =>
//         e.title.toLowerCase().includes(query.toLowerCase())
//       )
//       .slice(0, 5);
//   }, [query, events]);

//   const scrollToEvents = () => {
//     document
//       .getElementById("events")
//       ?.scrollIntoView({ behavior: "smooth" });
//     setQuery("");
//   };

//   if (!heroEvents.length) return null;

//   return (
//     <section
//       id="hero"
//       className="relative -mt-24 pt-24 min-h-screen flex items-center overflow-hidden bg-[#050505] text-white"
//     >
//       {/* 🌌 BACKGROUND */}
//       <div className="absolute inset-0 z-0">
//         <div className="absolute top-0 left-0 w-[650px] h-[600px] bg-pink-600/25 blur-[180px] rounded-full" />
//         <div className="absolute bottom-0 right-0 w-[700px] h-[650px] bg-orange-500/20 blur-[200px] rounded-full" />
//       </div>

//       {/* WATERMARK */}
//       <div className="absolute inset-0 opacity-[0.05] flex items-center justify-center z-0">
//         <img src={logo} alt="Igniters Club" className="w-[850px]" />
//       </div>

//       <div className="container mx-auto px-6 relative z-20 grid lg:grid-cols-2 gap-16 items-center">
//         {/* ================= LEFT ================= */}
//         <div>
//           <div className="flex gap-3 mb-6">
//             <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-hot-pink/20 text-hot-pink border border-hot-pink/30">
//               🚀 Unstop Igniters
//             </span>
//             <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-orange-500/20 text-orange-300 border border-orange-400/30">
//               🔥 Live & Upcoming
//             </span>
//           </div>

//           <h1 className="text-5xl md:text-6xl font-black leading-tight">
//             Ignite <br />
//             <span className="bg-gradient-to-r from-hot-pink to-orange-400 bg-clip-text text-transparent">
//               Innovation
//             </span>
//           </h1>

//           <p className="mt-6 text-lg text-gray-300 max-w-xl">
//             Discover hands-on workshops, bootcamps, and flagship events
//             organized by Unstop Igniters Club.
//           </p>

//           {/* 🔍 SEARCH */}
//           <div className="relative mt-8 max-w-xl">
//             <div className="flex gap-3">
//               <input
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 placeholder="Search events, workshops..."
//                 className="flex-1 px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-hot-pink"
//               />
//               <button
//                 onClick={scrollToEvents}
//                 className="gradient-btn px-6 py-3 rounded-xl font-semibold"
//               >
//                 Explore
//               </button>
//             </div>

//             {suggestions.length > 0 && (
//               <div className="absolute mt-2 w-full bg-black/80 border border-white/20 rounded-xl overflow-hidden z-30">
//                 {suggestions.map((e) => (
//                   <button
//                     key={e.id}
//                     onClick={scrollToEvents}
//                     className="w-full px-5 py-3 text-left hover:bg-white/10"
//                   >
//                     <p className="font-medium">{e.title}</p>
//                     <p className="text-xs text-gray-400">
//                       {formatEventDate(e.event_date, e.event_end_date)}
//                     </p>
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div className="mt-10 grid grid-cols-3 gap-6 max-w-xl">
//             <Stat value={`${events.length}+`} label="Igniters Events" />
//             <Stat value="Hands-on" label="Workshops" />
//             <Stat value="AIKTC" label="Campus Driven" />
//           </div>
//         </div>

//         {/* ================= RIGHT ================= */}
//         <div className="relative h-[460px]">
//           {/* BACK */}
//           {next && (
//             <motion.div
//               key={next.title}
//               initial={{ scale: 0.92, opacity: 0.4, y: 40 }}
//               animate={{ scale: 1, opacity: 1, y: 0 }}
//               transition={{ duration: 1 }}
//               className="absolute inset-0 z-10"
//             >
//               <GlassCard className="p-6 rounded-3xl bg-white/5 border border-white/15">
//                 <EventCard event={next} muted />
//               </GlassCard>
//             </motion.div>
//           )}

//           {/* FRONT */}
//           <motion.div
//             key={current.title}
//             className="absolute inset-0 z-20"
//           >
//             <GlassCard className="p-6 rounded-3xl bg-white/10 border border-white/20 shadow-xl">
//               <EventCard event={current} />
//             </GlassCard>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// };

// /* ================= COMPONENTS ================= */

// const Stat = ({ value, label }) => (
//   <div>
//     <h4 className="text-2xl font-bold">{value}</h4>
//     <p className="text-sm text-gray-400">{label}</p>
//   </div>
// );

// const EventCard = ({ event, muted }) => (
//   <div className="group">
//     <div className="relative h-60 overflow-hidden rounded-2xl">
//       <img
//         src={event.image}
//         alt={event.title}
//         className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${
//           muted ? "opacity-70" : ""
//         }`}
//       />
//       <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
//     </div>

//     <div className={`mt-6 ${muted ? "opacity-70" : ""}`}>
//       <div className="flex justify-between items-center">
//         <h3 className="font-bold text-lg">{event.title}</h3>
//         <span className="px-3 py-1 text-xs rounded-full bg-hot-pink/20 text-hot-pink font-semibold">
//           {event.tag}
//         </span>
//       </div>

//       <p className="mt-3 text-sm text-gray-400">{event.date}</p>

//       <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
//         <div
//           className="h-full bg-gradient-to-r from-hot-pink to-orange-400"
//           style={{ width: `${event.progress}%` }}
//         />
//       </div>
//     </div>
//   </div>
// );

// export default Hero;
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "../components/GlassCard";
import RegistrationModal from "../components/RegistrationModal";
import logo from "../assets/background-logo.png";
import { useEvents } from "../hooks/useEvents";

const Hero = () => {
  /* ================= HOOKS (ORDER SAFE) ================= */
  const hookResult = useEvents("igniters");
  const events = Array.isArray(hookResult?.events) ? hookResult.events : [];

  const [active, setActive] = useState(0);
  const [query, setQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  /* ================= CAROUSEL ================= */
  useEffect(() => {
    if (events.length === 0) return;

    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % events.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [events]);

  /* ================= SEARCH ================= */
  const suggestions = useMemo(() => {
    if (!query || events.length === 0) return [];
    return events
      .filter((e) =>
        e?.title?.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5);
  }, [query, events]);

  /* ================= STATS (DYNAMIC) ================= */
  const stats = useMemo(() => {
    const total = events.length;
    const activeCount = events.filter(
      (e) => (e.registration_status || "active") === "active"
    ).length;
    const upcomingCount = events.filter(
      (e) => e.registration_status === "upcoming"
    ).length;

    return [
      { value: total, label: "Total Events" },
      { value: activeCount, label: "Active Registrations" },
      { value: upcomingCount, label: "Upcoming Events" },
    ];
  }, [events]);

  /* ================= SAFE DERIVED ================= */
  const hasEvents = events.length > 0;
  const safeIndex = hasEvents ? active % events.length : 0;
  const current = hasEvents ? events[safeIndex] : null;
  const next = hasEvents ? events[(safeIndex + 1) % events.length] : null;

  return (
    <section
      id="hero"
      className="relative -mt-24 pt-24 min-h-screen flex items-center overflow-hidden bg-[#050505] text-white"
    >
      {/* 🌌 Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-[650px] h-[600px] bg-pink-600/25 blur-[180px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[700px] h-[650px] bg-orange-500/20 blur-[200px] rounded-full" />
      </div>

      {/* Watermark */}
      <div className="absolute inset-0 opacity-[0.05] flex items-center justify-center z-0">
        <img src={logo} alt="logo" className="w-[800px]" />
      </div>

      {/* ================= LOADING ================= */}
      {!hasEvents && (
        <div className="relative z-20 w-full text-center text-gray-400">
          Loading events...
        </div>
      )}

      {/* ================= CONTENT ================= */}
      {hasEvents && (
        <div className="container mx-auto px-6 relative z-20 grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div>
            <div className="flex gap-3 mb-6">
              <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-hot-pink/20 text-hot-pink border border-hot-pink/30">
                🚀 Unstop Igniters
              </span>
              <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-orange-500/20 text-orange-300 border border-orange-400/30">
                🔥 Trending
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black leading-tight">
              Ignite <br />
              <span className="bg-gradient-to-r from-hot-pink to-orange-400 bg-clip-text text-transparent">
                Startup
              </span>{" "}
              Excellence
            </h1>

            <p className="mt-6 text-lg text-gray-300 max-w-xl">
              A premium student-driven ecosystem fostering innovation,
              leadership, and startup culture through impactful events.
            </p>

            {/* 🔍 Search */}
            <div className="relative mt-8 max-w-xl">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search events..."
                className="w-full px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white"
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

            {/* 📊 DYNAMIC STATS */}
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-xl">
              {stats.map((s) => (
                <Stat key={s.label} value={s.value} label={s.label} />
              ))}
            </div>
          </div>

          {/* RIGHT (CLICKABLE CARD) */}
          <div className="relative h-[460px]">
            {next && (
              <motion.div
                key={next.id}
                initial={{ scale: 0.92, opacity: 0.35, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 z-10"
              >
                <GlassCard className="p-6 rounded-3xl bg-white/5">
                  <HeroEventCard event={next} muted />
                </GlassCard>
              </motion.div>
            )}

            {current && (
              <motion.div key={current.id} className="absolute inset-0 z-20">
                <GlassCard
                  onClick={() => {
                    if ((current.registration_status || "active") === "active") {
                      setSelectedEvent(current);
                      setModalOpen(true);
                    }
                  }}
                  className="p-6 rounded-3xl bg-white/10 cursor-pointer"
                >
                  <HeroEventCard event={current} />
                </GlassCard>
              </motion.div>
            )}
          </div>
        </div>
      )}

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

/* ================= HELPERS ================= */

const Stat = ({ value, label }) => (
  <div>
    <h4 className="text-2xl font-bold">{value}</h4>
    <p className="text-sm text-gray-400">{label}</p>
  </div>
);

const HeroEventCard = ({ event, muted }) => {
  const status = event.registration_status || "active";

  return (
    <div className="group">
      <div className="relative h-60 overflow-hidden rounded-2xl">
        <img
          src={event.image_url}
          alt={event.title}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
            muted ? "opacity-70" : ""
          }`}
        />
      </div>

      <div className={`mt-6 ${muted ? "opacity-70" : ""}`}>
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg">{event.title}</h3>
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
