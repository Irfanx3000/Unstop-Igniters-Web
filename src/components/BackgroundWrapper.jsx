import React from "react";
import bgLogo from "../assets/background-logo.png";

const BackgroundWrapper = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Faint Background Logo */}
      <div className="pointer-events-none fixed inset-0 -z-10 flex items-center justify-center opacity-[0.05]">
        <img
          src={bgLogo}
          alt="Igniters Club Background"
          className="max-w-[900px] w-full h-auto object-contain"
        />
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default BackgroundWrapper;
