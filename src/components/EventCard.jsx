import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const EventCard = ({ event, onRegister }) => {
  const [flipped, setFlipped] = useState(false);
  const [cardHeight, setCardHeight] = useState("auto");
  const imgRef = useRef(null);

  // Auto adjust height based on image
  useEffect(() => {
    if (imgRef.current) {
      const updateSize = () => {
        setCardHeight(imgRef.current.offsetHeight + 80);
      };
      updateSize();
      window.addEventListener("resize", updateSize);
      return () => window.removeEventListener("resize", updateSize);
    }
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

        {/* --------------------------------------------------
            FRONT SIDE
        -------------------------------------------------- */}
        <div className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden bg-black/40">

          {/* CLICK TO FLIP — desktop only shows on hover */}
          <div
            className="
              absolute top-3 left-1/2 -translate-x-1/2
              px-4 py-1 text-white text-sm font-semibold
              bg-black/40 backdrop-blur-md rounded-full shadow-md
              z-20
              opacity-0 group-hover:opacity-100
              transition-opacity duration-300
              md:opacity-0
              sm:opacity-100 sm:group-hover:opacity-100
            "
          >
            Click to flip →
          </div>

          {/* IMAGE */}
          <img
            ref={imgRef}
            src={event.image_url}
            alt={event.title}
            className="w-full object-contain rounded-t-2xl"
          />

          {/* EVENT TITLE (always visible) */}
          <div
            className="
              absolute bottom-0 left-0 right-0 
              bg-black/70 backdrop-blur-md 
              text-center px-3 py-2 rounded-b-2xl
            "
          >
            <h3 className="text-lg md:text-xl font-bold text-white">
              {event.title}
            </h3>
          </div>
        </div>

        {/* --------------------------------------------------
            BACK SIDE (Details + Register)
        -------------------------------------------------- */}
        <div
          className="
            absolute inset-0 backface-hidden rotateY-180
            rounded-2xl bg-white/10 backdrop-blur-xl
            p-5 flex flex-col justify-between
          "
          style={{ minHeight: cardHeight }}
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
