import React from 'react'
import { motion } from 'framer-motion'

const Logo = ({ className = "w-12 h-12", animated = false }) => {
  const logo = (
    <svg viewBox="0 0 100 100" className={className}>
      {/* Flame Base */}
      <path
        d="M50 85 L35 60 L45 40 L55 40 L65 60 Z"
        fill="#FF8A29"
        stroke="#000000"
        strokeWidth="2"
      />
      
      {/* Flame Middle */}
      <path
        d="M50 65 L40 50 L45 45 L55 45 L60 50 Z"
        fill="#FFD84A"
        stroke="#000000"
        strokeWidth="1.5"
      />
      
      {/* Flame Tip */}
      <path
        d="M50 55 L47 48 L53 48 Z"
        fill="#FFFFFF"
        stroke="#000000"
        strokeWidth="1"
      />
      
      {/* Spark Lines */}
      <path
        d="M30 55 L25 50 M70 55 L75 50 M45 30 L40 25 M55 30 L60 25"
        stroke="#FF4DA6"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )

  if (animated) {
    return (
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        {logo}
      </motion.div>
    )
  }

  return logo
}

export default Logo