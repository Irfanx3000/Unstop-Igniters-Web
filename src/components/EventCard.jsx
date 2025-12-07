import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const EventCard = ({ event, onRegister }) => {
  const [flipped, setFlipped] = useState(false);
  const [cardHeight, setCardHeight] = useState(350);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const updateHeight = () => {
      const imgH = imgRef.current.offsetHeight;

      // Title bar height (bottom black bar)
      const titleH = 70;

      // Final card height = image + title (no unnecessary extra padding)
      const finalH = imgH + titleH;

      // Apply safe minimum
      setCardHeight(Math.max(320, finalH));
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, [event.image_url]);

  return (
    <div
      className="relative w-full max-w-sm cursor-pointer perspective group"
      onClick={() => setFlipped(!flipped)}
      style={{ height: cardHeight }}
    >
      <motion.div
        className="relative w-full h-full transition-transform duration-700 preserve-3d"
        animate={{ rotateY: flipped ? 180 : 0 }}
      >
        {/* FRONT */}
        <div className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden bg-black">

          {/* Hover "Click to flip" */}
          <div
            className="
              absolute top-3 left-1/2 -translate-x-1/2
              px-4 py-1 text-white text-sm font-semibold
              bg-black/40 backdrop-blur-md rounded-full shadow-md
              opacity-0 group-hover:opacity-100 transition-all duration-300
              sm:opacity-100
            "
          >
            Click to flip →
          </div>

          {/* EVENT IMAGE */}
          <img
            ref={imgRef}
            src={event.image_url}
            alt={event.title}
            className="w-full object-contain rounded-t-2xl"
          />

          {/* TITLE BAR */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg text-center py-3 rounded-b-2xl">
            <h3 className="text-xl font-bold text-white">{event.title}</h3>
          </div>
        </div>

        {/* BACK SIDE */}
        <div
          className="
            absolute inset-0 backface-hidden rotateY-180
            rounded-2xl bg-white/10 backdrop-blur-xl
            p-5 flex flex-col justify-between
          "
          style={{ height: cardHeight }}
        >
          <div>
            <h3 className="text-2xl font-bold text-hot-pink mb-2">
              {event.title}
            </h3>

            <p className="text-gray-200 text-sm leading-relaxed">
              {event.description}
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onRegister(event);
            }}
            className="gradient-btn w-full py-2 mt-3 rounded-xl font-semibold"
          >
            Register
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default EventCard;
