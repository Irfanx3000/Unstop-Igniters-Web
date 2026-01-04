// import React, { useEffect, useMemo, useState } from "react";
// import { motion } from "framer-motion";
// import GlassCard from "../components/GlassCard";
// import RegistrationModal from "../components/RegistrationModal";
// import logo from "../assets/background-logo.png";
// import { useEvents } from "../hooks/useEvents";

// const Hero = () => {
//   const { events = [] } = useEvents("igniters");

//   const [active, setActive] = useState(0);
//   const [query, setQuery] = useState("");
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [modalOpen, setModalOpen] = useState(false);

//   /* ================= CAROUSEL ================= */
//   useEffect(() => {
//     if (!events.length) return;
//     const id = setInterval(
//       () => setActive((p) => (p + 1) % events.length),
//       5000
//     );
//     return () => clearInterval(id);
//   }, [events]);

//   const current = events[active] || null;
//   const next = events[(active + 1) % events.length] || null;

//   /* ================= SEARCH ================= */
//   const suggestions = useMemo(() => {
//     if (!query) return [];
//     return events
//       .filter((e) =>
//         e.title?.toLowerCase().includes(query.toLowerCase())
//       )
//       .slice(0, 5);
//   }, [query, events]);

//   return (
//     <section
//       id="hero"
//       className="relative pt-24 lg:pt-32 min-h-[100svh] bg-[#050505] text-white overflow-hidden"
//     >
//       {/* 🌌 Background */}
//       <div className="absolute inset-0 z-0">
//         <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-pink-600/25 blur-[160px]" />
//         <div className="absolute bottom-0 right-0 w-[550px] h-[550px] bg-orange-500/20 blur-[180px]" />
//       </div>

//       {/* Watermark */}
//       <div className="absolute inset-0 opacity-[0.04] flex items-center justify-center">
//         <img src={logo} alt="logo" className="w-[700px] max-w-full" />
//       </div>

//       {/* ================= MAIN CONTAINER ================= */}
//       <div className="relative z-20 container mx-auto px-5">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">

//           {/* ================= LEFT CONTENT ================= */}
//           <div className="text-center lg:text-left">
//             <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
//               <span className="px-4 py-1.5 rounded-full text-sm bg-hot-pink/20 text-hot-pink">
//                 🚀 Unstop Igniters
//               </span>
//               <span className="px-4 py-1.5 rounded-full text-sm bg-orange-500/20 text-orange-300">
//                 🔥 Trending
//               </span>
//             </div>

//             <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight">
//               Ignite{" "}
//               <span className="bg-gradient-to-r from-hot-pink to-orange-400 bg-clip-text text-transparent">
//                 Startup
//               </span>{" "}
//               Excellence
//             </h1>

//             <p className="mt-5 sm:mt-6 text-sm sm:text-base lg:text-lg text-gray-300 max-w-xl mx-auto lg:mx-0">
//               A premium student-driven ecosystem fostering innovation,
//               leadership, and startup culture through impactful events.
//             </p>

//             {/* SEARCH */}
//             <div className="relative mt-6 sm:mt-8 w-full max-w-xl mx-auto lg:mx-0">
//               <input
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 placeholder="Search events..."
//                 className="w-full px-4 py-3 text-sm sm:text-base rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-hot-pink"
//               />

//               {suggestions.length > 0 && (
//                 <div className="absolute mt-2 w-full bg-black/90 border border-white/20 rounded-xl overflow-hidden z-50">
//                   {suggestions.map((e) => (
//                     <button
//                       key={e.id}
//                       onClick={() =>
//                         document
//                           .getElementById("events")
//                           ?.scrollIntoView({ behavior: "smooth" })
//                       }
//                       className="w-full text-left px-4 py-3 hover:bg-white/10 text-sm"
//                     >
//                       {e.title}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* ================= RIGHT CONTENT ================= */}
//           <div className="flex flex-col pt-4 lg:pt-12">

//             {/* MOBILE: SINGLE EVENT CARD */}
//             {current && (
//               <div className="block lg:hidden">
//                 <GlassCard className="p-4 rounded-2xl bg-white/10">
//                   <HeroEventCard event={current} />
//                 </GlassCard>
//               </div>
//             )}

//             {/* DESKTOP: STACKED CAROUSEL */}
//             <div className="hidden lg:block relative h-[520px]">
//               {next && (
//                 <motion.div
//                   initial={{ scale: 0.96, opacity: 0.35, y: 30 }}
//                   animate={{ scale: 1, opacity: 1, y: 0 }}
//                   transition={{ duration: 0.8 }}
//                   className="absolute inset-0 z-10"
//                 >
//                   <GlassCard className="p-6 rounded-3xl bg-white/5 h-full">
//                     <HeroEventCard event={next} muted />
//                   </GlassCard>
//                 </motion.div>
//               )}

//               {current && (
//                 <motion.div className="absolute inset-0 z-20 h-full">
//                   <GlassCard
//                     onClick={() => {
//                       if (
//                         (current.registration_status || "active") === "active"
//                       ) {
//                         setSelectedEvent(current);
//                         setModalOpen(true);
//                       }
//                     }}
//                     className="p-6 rounded-3xl bg-white/10 cursor-pointer h-full"
//                   >
//                     <HeroEventCard event={current} />
//                   </GlassCard>
//                 </motion.div>
//               )}
//             </div>

//           </div>
//         </div>
//       </div>

//       {/* MODAL */}
//       {selectedEvent && (
//         <RegistrationModal
//           event={selectedEvent}
//           isOpen={modalOpen}
//           onClose={() => {
//             setModalOpen(false);
//             setSelectedEvent(null);
//           }}
//         />
//       )}
//     </section>
//   );
// };

// /* =========================================================
//    HERO EVENT CARD
// ========================================================= */

// const HeroEventCard = ({ event, muted }) => {
//   const status = event.registration_status || "active";

//   return (
//     <div className={`group ${muted ? "opacity-70" : ""}`}>
//       <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
//         <img
//           src={event.image_url}
//           alt={event.title}
//           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//         />
//       </div>

//       <div className="mt-4">
//         <div className="flex justify-between items-center gap-3">
//           <h3 className="font-bold text-base sm:text-lg line-clamp-1">
//             {event.title}
//           </h3>
//           <span className="text-xs px-3 py-1 rounded-full bg-hot-pink/20 text-hot-pink whitespace-nowrap">
//             {status.toUpperCase()}
//           </span>
//         </div>

//         <p className="mt-2 text-sm text-gray-400 line-clamp-2">
//           {event.description}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Hero;
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "../components/GlassCard";
import RegistrationModal from "../components/RegistrationModal";
import logo from "../assets/background-logo.png";
import { useEvents } from "../hooks/useEvents";

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

  return (
    <section
      id="hero"
      className="
        relative
        pt-20 lg:pt-24
        bg-[#050505]
        text-white
        overflow-hidden
      "
    >
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-[420px] h-[420px] bg-pink-600/25 blur-[160px]" />
        <div className="absolute bottom-0 right-0 w-[480px] h-[480px] bg-orange-500/20 blur-[180px]" />
      </div>

      {/* WATERMARK */}
      <div className="absolute inset-0 opacity-[0.04] flex items-center justify-center pointer-events-none">
        <img src={logo} alt="logo" className="w-[650px] max-w-full" />
      </div>

      {/* CONTENT */}
      <div className="relative z-20 container mx-auto px-6">
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-[1.1fr_0.9fr]
            gap-12
            items-start
          "
        >
          {/* LEFT: TEXT */}
          <div className="max-w-xl">
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="px-4 py-1.5 rounded-full text-sm bg-hot-pink/20 text-hot-pink">
                🚀 Unstop Igniters
              </span>
              <span className="px-4 py-1.5 rounded-full text-sm bg-orange-500/20 text-orange-300">
                🔥 Trending
              </span>
            </div>

            <h1 className="font-black leading-tight text-[clamp(2.6rem,5vw,4.6rem)]">
              Ignite{" "}
              <span className="bg-gradient-to-r from-hot-pink to-orange-400 bg-clip-text text-transparent">
                Startup
              </span>{" "}
              Excellence
            </h1>

            <p className="mt-5 text-base lg:text-lg text-gray-300">
              A premium student-driven ecosystem fostering innovation,
              leadership, and startup culture through impactful events.
            </p>

            {/* SEARCH */}
            <div className="relative mt-6">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search events..."
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-hot-pink"
              />

              {suggestions.length > 0 && (
                <div className="absolute mt-2 w-full bg-black/90 border border-white/20 rounded-xl overflow-hidden z-50">
                  {suggestions.map((e) => (
                    <button
                      key={e.id}
                      onClick={() =>
                        document
                          .getElementById("events")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                      className="w-full text-left px-4 py-3 hover:bg-white/10 text-sm"
                    >
                      {e.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: CAROUSEL (LOCKED) */}
          <div className="relative w-full max-w-[520px] ml-auto">
            {next && (
              <motion.div
                initial={{ scale: 0.96, opacity: 0.35, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 z-10 hidden lg:block"
              >
                <GlassCard className="p-6 rounded-3xl bg-white/5">
                  <HeroEventCard event={next} muted />
                </GlassCard>
              </motion.div>
            )}

            {current && (
              <motion.div className="relative z-20">
                <GlassCard
                  onClick={() => {
                    if (
                      (current.registration_status || "active") === "active"
                    ) {
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

/* ================= EVENT CARD ================= */

const HeroEventCard = ({ event, muted }) => {
  const status = event.registration_status || "active";

  return (
    <div className={`${muted ? "opacity-70" : ""}`}>
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
        <img
          src={event.image_url}
          alt={event.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-center gap-3">
          <h3 className="font-bold text-lg line-clamp-1">
            {event.title}
          </h3>
          <span className="text-xs px-3 py-1 rounded-full bg-hot-pink/20 text-hot-pink">
            {status.toUpperCase()}
          </span>
        </div>

        <p className="mt-2 text-sm text-gray-400 line-clamp-2">
          {event.description}
        </p>
      </div>
    </div>
  );
};

export default Hero;
