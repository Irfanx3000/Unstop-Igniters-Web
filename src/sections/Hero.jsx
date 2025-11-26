import React from 'react'
import { motion } from 'framer-motion'
import GlassCard from '../components/GlassCard'
import logo from "../assets/background-logo.png";


const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-white">
      {/* Background Illustration */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="w-full h-full flex items-center justify-center">
          {/* This will use your provided image */}
          <div className="max-w-4xl max-h-4xl w-full h-full flex items-center justify-center">
            <img 
              src="/src/assets/background-logo.png" 
              alt="Unstop Igniters Club Background"
              className="w-full h-full object-contain opacity-10"
              onError={(e) => {
                // Fallback if image doesn't load
                e.target.style.display = 'none'
              }}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <GlassCard className="max-w-4xl mx-auto p-12 text-center border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            {/* Updated Logo using your design */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className="mb-8"
            >
              <div className="flex flex-col items-center justify-center gap-1">
                {/* "unstop" text - smaller and above */}
                <span className="text-black font-bold text-2xl md:text-3xl tracking-tight">unstop</span>
                
                {/* Main logo text */}
                <div className="flex flex-col items-center gap-0">
                  <span className="text-hot-pink font-black text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-none">IGNITERS</span>
                  <span className="text-black font-bold text-4xl md:text-6xl lg:text-7xl tracking-tighter leading-none">CLUB</span>
                </div>
              </div>
            </motion.div>
            
            {/* Separator */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-1 w-20 bg-gradient-to-r from-[#FF4DA6] to-[#FF8A29] rounded-full"></div>
              <span className="text-2xl font-bold text-gray-600">AIKTC</span>
              <div className="h-1 w-20 bg-gradient-to-r from-[#FF8A29] to-[#FFD84A] rounded-full"></div>
            </div>
            
            {/* Mission statement */}
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              Igniting innovation, fostering creativity, and building the future leaders of tomorrow. 
              Join us in our mission to create impactful experiences and drive positive change.
            </p>
            
            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="gradient-btn text-lg"
              onClick={() => document.getElementById('events').scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Events
            </motion.button>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero