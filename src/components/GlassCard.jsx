import React from 'react'
import { motion } from 'framer-motion'

const GlassCard = ({ children, className = '', hover = false, ...props }) => {
  return (
    <motion.div
      className={`glass-card ${hover ? 'hover-glow' : ''} ${className}`}
      whileHover={hover ? { y: -5, transition: { duration: 0.2 } } : {}}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default GlassCard