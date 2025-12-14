// src/components/EventCard.jsx
import React from "react";

const EventCard = ({ event, onRegister }) => {
  const canRegister = event.registration_status === "active";

  return (
    <div className="glass-card p-6 flex gap-6">

      {/* IMAGE */}
      <img
        src={event.image_url}
        alt={event.title}
        className="w-48 h-32 object-cover rounded-xl"
      />

      {/* DETAILS */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold">{event.title}</h3>
          <p className="text-gray-300 text-sm">{event.description}</p>
        </div>

        {/* STATUS / ACTION */}
        {canRegister ? (
          <button
            onClick={() => onRegister(event)}
            className="gradient-btn mt-3 w-fit"
          >
            Register
          </button>
        ) : (
          <span className="text-sm text-gray-400 mt-3">
            {event.registration_status === "upcoming"
              ? "Registration opening soon"
              : "Registrations closed"}
          </span>
        )}
      </div>
    </div>
  );
};

export default EventCard;
