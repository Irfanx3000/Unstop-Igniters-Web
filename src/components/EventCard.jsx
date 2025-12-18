import React from "react";

const EventCard = ({ event, onRegister }) => {
  const canRegister = event.registration_status === "active";

  return (
    <div className="glass-card p-5 flex flex-col md:flex-row gap-6 items-start group">
      
      {/* IMAGE CONTAINER 
          - shrink-0: Prevents the image from being squashed by text
          - w-full md:w-52: Full width on mobile, fixed width on desktop
          - h-48 md:h-36: Taller on mobile, compact rectangular on desktop
      */}
      <div className="w-full md:w-52  shrink-0 rounded-xl overflow-hidden relative">
        <img
          src={event.image_url}
          alt={event.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* DETAILS */}
      <div className="flex-1 flex flex-col justify-between w-full h-full">
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-[#ff4da6] transition-colors">
            {event.title}
          </h3>
          {/* line-clamp-2 limits text to 2 lines so card height stays consistent */}
          <p className="text-gray-300 text-sm mt-2 line-clamp-3 md:line-clamp-2">
            {event.description}
          </p>
        </div>

        {/* STATUS / ACTION */}
        <div className="mt-4">
          {canRegister ? (
            <button
              onClick={() => onRegister(event)}
              className="gradient-btn w-full md:w-auto text-sm py-2"
            >
              Register Now
            </button>
          ) : (
            <div className="inline-block px-3 py-1 rounded-full border border-gray-600 bg-white/5 backdrop-blur-sm">
              <span className="text-xs text-gray-400 font-medium">
                {event.registration_status === "upcoming"
                  ? "Registration opening soon"
                  : "Registrations closed"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;