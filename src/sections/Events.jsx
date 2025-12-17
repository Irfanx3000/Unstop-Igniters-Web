import React, { useState } from "react";
import { useEvents } from "../hooks/useEvents";
import RegistrationModal from "../components/RegistrationModal";
import { CalendarDaysIcon, MapPinIcon } from "@heroicons/react/24/outline";

const statusStyles = {
  active: "bg-green-500/20 text-green-400",
  closed: "bg-red-500/20 text-red-400",
  upcoming: "bg-yellow-500/20 text-yellow-300",
};

const Events = () => {
  const [activeTab, setActiveTab] = useState("igniters");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { events: unstopEvents } = useEvents("unstop");
  const { events: ignitersEvents } = useEvents("igniters");

  const events = activeTab === "unstop" ? unstopEvents : ignitersEvents;

  const openEvent = (event) => {
    if (activeTab === "unstop") {
      if (event.external_link) {
        window.open(event.external_link, "_blank");
      }
      return;
    }

    if (event.registration_status !== "active") return;

    setSelectedEvent(event);
    setModalOpen(true);
  };

  return (
    <section
      id="events"
      className="py-24 bg-[#050505] relative"
    >
      <div className="container mx-auto px-4">

        {/* TITLE */}
        <h2 className="text-5xl md:text-6xl font-black text-center mb-12">
          <span className="text-hot-pink">Events</span>{" "}
          <span className="text-white">& Activities</span>
        </h2>

        {/* TABS */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2 inline-flex">
            {["igniters", "unstop"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === tab
                    ? "gradient-btn"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {tab === "unstop" ? "Unstop Events" : "Igniters Events"}
              </button>
            ))}
          </div>
        </div>

        {/* EVENTS LIST */}
        <div className="space-y-8 max-w-5xl mx-auto">
          {events.map((event) => (
            <div
              key={event.id}
              className="glass-card p-6 flex flex-col md:flex-row gap-6 items-start"
            >
              {/* IMAGE */}
              <div className="w-full md:w-64 shrink-0">
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-40 object-cover rounded-xl"
                />
              </div>

              {/* DETAILS */}
              <div className="flex-1 space-y-3">
                <div className="flex justify-between items-start gap-4">
                 <h3 className="text-2xl font-bold text-white mb-2">
                  <span className="bg-gradient-to-r from-hot-pink to-orange-400 bg-clip-text text-transparent">
                    {event.title}
                  </span>
                </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      statusStyles[event.registration_status || "active"]
                    }`}
                  >
                    {(event.registration_status || "active").toUpperCase()}
                  </span>
                </div>

                <p className="text-gray-300">
                  {event.description}
                </p>
                <div className="text-sm flex flex-wrap gap-6 items-center mt-2">
                 {event.event_date && (
                      <span className="flex items-center gap-2 text-orange-300 font-medium">
                        <CalendarDaysIcon className="w-4 h-4 text-orange-400" />
                        {new Date(event.event_date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                        {event.event_end_date &&
                          event.event_end_date !== event.event_date && (
                            <>
                              {" "}–{" "}
                              {new Date(event.event_end_date).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </>
                          )}
                      </span>
                    )}
                  {event.venue && (
                    <span className="flex items-center gap-2 text-gray-400">
                      <MapPinIcon className="w-4 h-4 text-gray-400" />
                      {event.venue}
                    </span>
                  )}
                </div>
                {/* ACTION */}
                {activeTab === "igniters" && (
                  <>
                    {event.registration_status === "active" && (
                      <button
                        onClick={() => openEvent(event)}
                        className="gradient-btn mt-4"
                      >
                        Register Now
                      </button>
                    )}

                    {event.registration_status === "closed" && (
                      <button
                        disabled
                        className="mt-4 px-6 py-2 rounded-xl bg-white/10 text-gray-400 cursor-not-allowed"
                      >
                        Registration Closed
                      </button>
                    )}

                    {event.registration_status === "upcoming" && (
                      <button
                        disabled
                        className="mt-4 px-6 py-2 rounded-xl bg-white/10 text-yellow-400 cursor-not-allowed"
                      >
                        Coming Soon
                      </button>
                    )}
                  </>
                )}

                {activeTab === "unstop" && event.external_link && (
                  <button
                    onClick={() => openEvent(event)}
                    className="gradient-btn mt-4"
                  >
                    View on Unstop
                  </button>
                )}
              </div>
            </div>
          ))}

          {events.length === 0 && (
            <div className="glass-card p-10 text-center text-gray-400">
              No events available.
            </div>
          )}
        </div>

        {/* REGISTRATION MODAL */}
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
