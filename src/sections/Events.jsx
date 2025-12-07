import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEvents } from "../hooks/useEvents";
import RegistrationModal from "../components/RegistrationModal";
import EventCard from "../components/EventCard"; 

const Events = () => {
  const [activeTab, setActiveTab] = useState("unstop");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [slide, setSlide] = useState(0);

  const [cardsPerSlide, setCardsPerSlide] = useState(3);

  const { events: unstopEvents } = useEvents("unstop");
  const { events: ignitersEvents } = useEvents("igniters");

  // Select current tab events
  const events = activeTab === "unstop" ? unstopEvents : ignitersEvents;

  /* ------------------------ RESPONSIVENESS ------------------------ */
  const updateCardsPerSlide = () => {
    if (window.innerWidth < 640) setCardsPerSlide(1);
    else if (window.innerWidth < 1024) setCardsPerSlide(2);
    else setCardsPerSlide(3);
  };

  useEffect(() => {
    updateCardsPerSlide();
    window.addEventListener("resize", updateCardsPerSlide);
    return () => window.removeEventListener("resize", updateCardsPerSlide);
  }, []);

  const totalSlides = Math.ceil(events.length / cardsPerSlide);

  const goNext = () => setSlide((prev) => (prev + 1) % totalSlides);
  const goPrev = () => setSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

  /* ------------------------ REGISTRATION HANDLER ------------------------ */

  const openEvent = (event) => {
    if (activeTab === "unstop") {
      if (event.external_link) window.open(event.external_link, "_blank");
      return;
    }

    setSelectedEvent(event);
    setModalOpen(true);
  };

  /* ------------------------ MAIN JSX ------------------------ */

  return (
    <section className="min-h-screen py-20 relative bg-[#050505] overflow-hidden">
      {/* 🔥 Nebula BG */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-pink-600/20 blur-[180px] rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-orange-500/20 blur-[180px] rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-20">
        {/* TITLE */}
        <h2 className="text-5xl md:text-6xl font-black text-center mb-12">
          <span className="text-hot-pink">Events</span>{" "}
          <span className="text-white">& Activities</span>
        </h2>

        {/* TABS */}
        <div className="flex justify-center mb-10">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2 inline-flex shadow-lg">
            {["unstop", "igniters"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSlide(0);
                }}
                className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === tab ? "gradient-btn" : "text-gray-300"
                }`}
              >
                {tab === "unstop" ? "Unstop Events" : "Igniters Events"}
              </button>
            ))}
          </div>
        </div>

        {/* CAROUSEL */}
        <div className="relative w-full overflow-hidden">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={slide}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {events
                .slice(slide * cardsPerSlide, slide * cardsPerSlide + cardsPerSlide)
                .map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onRegister={() => openEvent(event)}
                  />
                ))}
            </motion.div>
          </AnimatePresence>

          {/* ARROWS */}
          {events.length > cardsPerSlide && (
            <>
              <button
                onClick={goPrev}
                className="absolute top-1/2 -left-3 transform -translate-y-1/2 bg-white/10 text-white p-3 rounded-full backdrop-blur-xl border border-white/20 hover:bg-white/20"
              >
                ‹
              </button>

              <button
                onClick={goNext}
                className="absolute top-1/2 -right-3 transform -translate-y-1/2 bg-white/10 text-white p-3 rounded-full backdrop-blur-xl border border-white/20 hover:bg-white/20"
              >
                ›
              </button>
            </>
          )}
        </div>

        {/* DOTS */}
        <div className="flex justify-center mt-6 gap-3">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setSlide(index)}
              className={`w-4 h-4 rounded-full transition-all ${
                index === slide
                  ? "bg-hot-pink scale-125"
                  : "bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>

        {/* REGISTER MODAL */}
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
      </div>
    </section>
  );
};

export default Events;
