import React from "react";
import { motion } from "framer-motion";

const GlassCard = ({ children, className = "", ...props }) => {
  return (
    <motion.div
      {...props}
      className={`
        bg-white/5 backdrop-blur-2xl 
        border border-white/10 
        rounded-3xl 
        shadow-[0_0_35px_rgba(255,115,0,0.25)] 
        p-6
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
