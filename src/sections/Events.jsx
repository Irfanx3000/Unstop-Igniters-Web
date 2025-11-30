import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEvents } from "../hooks/useEvents";
import GlassCard from "../components/GlassCard";
import RegistrationModal from "../components/RegistrationModal";

const Events = () => {
  const [activeTab, setActiveTab] = useState("unstop");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [slide, setSlide] = useState(0);

  const { events: unstopEvents, loading: unstopLoading } = useEvents("unstop");
  const { events: ignitersEvents, loading: ignitersLoading } =
    useEvents("igniters");

  const events = activeTab === "unstop" ? unstopEvents : ignitersEvents;

  // Number of cards per slide (responsive)
  const getCardsPerSlide = () => {
    if (window.innerWidth < 640) return 1; // mobile
    if (window.innerWidth < 1024) return 2; // tablet
    return 3; // desktop
  };

  const cardsPerSlide = getCardsPerSlide();
  const totalSlides = Math.ceil(events.length / cardsPerSlide);

  const goNext = () => {
    setSlide((prev) => (prev + 1) % totalSlides);
  };

  const goPrev = () => {
    setSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleEventClick = (event) => {
    if (activeTab === "igniters") {
      setSelectedEvent(event);
      setModalOpen(true);
    } else if (event.external_link) {
      window.open(event.external_link, "_blank");
    }
  };

  return (
    <section className="min-h-screen py-20 relative bg-[#050505] overflow-hidden">
      {/* Nebula Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-pink-600/20 blur-[180px] rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-orange-500/20 blur-[180px] rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-20">
        
        {/* Title */}
        <h2 className="text-5xl md:text-6xl font-black text-center mb-8">
          <span className="text-hot-pink">Events</span>{" "}
          <span className="text-white">& Activities</span>
        </h2>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2 inline-flex shadow-lg">
            <button
              onClick={() => {
                setActiveTab("unstop");
                setSlide(0);
              }}
              className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "unstop"
                  ? "gradient-btn text-white"
                  : "text-gray-300"
              }`}
            >
              Unstop Events
            </button>

            <button
              onClick={() => {
                setActiveTab("igniters");
                setSlide(0);
              }}
              className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "igniters"
                  ? "gradient-btn text-white"
                  : "text-gray-300"
              }`}
            >
              Igniters Events
            </button>
          </div>
        </div>

        {/* Carousel Wrapper */}
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
                  <GlassCard
                    key={event.id}
                    hover
                    onClick={() => handleEventClick(event)}
                    className="p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_0_35px_rgba(255,44,165,0.25)] cursor-pointer"
                  >
                    {/* Badge */}
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 ${
                        event.event_type === "unstop"
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-hot-pink/20 text-hot-pink"
                      }`}
                    >
                      {event.event_type}
                    </span>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-3">
                      {event.title}
                    </h3>

                    <p className="text-gray-300 mb-4">{event.description}</p>

                    {/* Date */}
                    {event.event_date && (
                      <div className="text-gray-400 mb-4">
                        {new Date(event.event_date).toLocaleDateString()}
                      </div>
                    )}

                    <button className="w-full gradient-btn py-3 rounded-xl font-semibold">
                      {activeTab === "unstop"
                        ? "View on Unstop"
                        : "Register Now"}
                    </button>
                  </GlassCard>
                ))}
            </motion.div>
          </AnimatePresence>

          {/* ARROW BUTTONS */}
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

        {/* Modals */}
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
