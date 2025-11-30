import React from "react";
import { motion } from "framer-motion";
import GlassCard from "../components/GlassCard";
import logo from "../assets/background-logo.png";

const Hero = () => {
  return (
    <section
      className="
        min-h-screen flex items-center justify-center 
        relative overflow-hidden 
        bg-[#050505]
        text-white
      "
    >
      {/* 🌌 Nebula Glow Background */}
      <div className="absolute inset-0 z-0">
        {/* Pink Top Glow */}
        <div
          className="
            absolute top-0 left-0 w-[650px] h-[600px]
            bg-pink-600/25 blur-[180px] rounded-full
          "
        />

        {/* Orange Bottom Glow */}
        <div
          className="
            absolute bottom-0 right-0 w-[700px] h-[650px]
            bg-orange-500/20 blur-[200px] rounded-full
          "
        />

        {/* Soft Center Glow */}
        <div
          className="
            absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px]
            bg-[#ff6e40]/10 blur-[160px] rounded-full
          "
        />
      </div>

      {/* ⭐ Optional Background LOGO (very faint) */}
      <div className="absolute inset-0 opacity-[0.05] flex items-center justify-center z-0">
        <img
          src={logo}
          alt="Igniters Club"
          className="w-[700px] md:w-[900px] object-contain"
        />
      </div>

      <div className="container mx-auto px-4 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <GlassCard
            className="
              max-w-4xl mx-auto p-12 text-center
              bg-white/10 backdrop-blur-xl 
              border border-white/20 
              shadow-[0_0_50px_rgba(255,65,150,0.25)]
              rounded-3xl
            "
          >
            {/* Logo Section */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 180 }}
              className="mb-10"
            >
              <div className="flex flex-col items-center gap-2">
                {/* unstop */}
                <span className="text-white/90 font-bold text-2xl md:text-3xl tracking-tight">
                  unstop
                </span>

                {/* IGNITERS CLUB */}
                <div className="flex flex-col items-center gap-0 leading-none">
                  <span className="text-hot-pink font-black text-6xl md:text-7xl tracking-tight">
                    IGNITERS
                  </span>
                  <span className="text-white font-extrabold text-4xl md:text-6xl tracking-tight">
                    CLUB
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Separator */}
            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="h-1 w-20 bg-gradient-to-r from-hot-pink to-orange-400 rounded-full" />
              <span className="text-2xl font-bold text-gray-200">AIKTC</span>
              <div className="h-1 w-20 bg-gradient-to-r from-orange-400 to-yellow-300 rounded-full" />
            </div>

            {/* Mission Statement */}
            <p className="text-lg md:text-2xl text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto">
              Igniting innovation, fostering creativity, and developing tomorrow’s
              leaders. Join us as we create impactful experiences and drive
              meaningful change.
            </p>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="
                gradient-btn text-lg font-semibold px-8 py-3 rounded-xl
                shadow-lg
              "
              onClick={() =>
                document.getElementById("events")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              Explore Events
            </motion.button>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
