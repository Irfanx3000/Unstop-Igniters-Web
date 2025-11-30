import React from "react";
import { useAuth } from "./context/AuthContext";
import Hero from "./sections/Hero";
import Events from "./sections/Events";
import Teams from "./sections/Teams";
import logo from "./assets/background-logo.png";
import { motion } from "framer-motion";

const UserWebsite = ({ onViewAdmin, onShowAuth }) => {
  const { user, userProfile, isAdmin, signOut } = useAuth();

  const displayName =
    userProfile?.name || user?.email?.split("@")[0] || "User";

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      alert("Sign out failed.");
    }
  };

  // ----------------------------------------------------
  // 🔥 NO-MIX TYPEWRITER SYSTEM
  // ----------------------------------------------------
  const slogans = [
    { first: "Ignite. Inspire. ", second: "Innovate." },
    { first: "Create. Collaborate. ", second: "Conquer." },
    { first: "Dream Big. ", second: "Build Bigger." },
    { first: "Turning Ideas ", second: "into Impact." },
    { first: "Leadership Through ", second: "Innovation." },
  ];

  const [index, setIndex] = React.useState(0);
  const [firstTyped, setFirstTyped] = React.useState("");
  const [secondTyped, setSecondTyped] = React.useState("");
  const [cursorVisible, setCursorVisible] = React.useState(true);

  // Blinking cursor
  React.useEffect(() => {
    const blink = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);
    return () => clearInterval(blink);
  }, []);

  // FULL typewriter animation
  React.useEffect(() => {
    const { first, second } = slogans[index];

    let i = 0;
    let j = 0;

    setFirstTyped("");
    setSecondTyped("");

    const interval = setInterval(() => {
      if (i < first.length) {
        setFirstTyped(first.slice(0, i + 1));
        i++;
        return;
      }

      if (j < second.length) {
        setSecondTyped(second.slice(0, j + 1));
        j++;
        return;
      }

      clearInterval(interval);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % slogans.length);
      }, 3000);
    }, 60);

    return () => clearInterval(interval);
  }, [index]);

  return (
    <div
      className="
        relative min-h-screen text-white overflow-hidden 
        bg-[#050505]
      "
    >
      {/* 🌌 STATIC NEBULA GLOW */}
      <div
        className="
          absolute top-0 left-1/3 w-[900px] h-[700px] 
          bg-pink-600/20 blur-[180px] rounded-full
          pointer-events-none z-0
        "
      />
      <div
        className="
          absolute bottom-0 right-0 w-[700px] h-[700px] 
          bg-orange-500/20 blur-[200px] rounded-full
          pointer-events-none z-0
        "
      />

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div
          className="
            bg-[#0a0a0a]/80 backdrop-blur-2xl 
            border-b border-white/10 
            p-4 rounded-b-2xl shadow-[0_0_25px_rgba(255,115,0,0.25)]
          "
        >
          <div className="flex items-center justify-between">
            {/* LOGO + TYPEWRITER */}
            <div className="flex items-center gap-4">
              <img
                src={logo}
                alt="Igniters Club Logo"
                className="h-12 w-auto drop-shadow-md rounded-md"
              />

              <motion.div
                key={index}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-sm md:text-base font-medium whitespace-nowrap flex items-center"
              >
                <span className="text-white">{firstTyped}</span>
                <span className="text-hot-pink">{secondTyped}</span>

                <span
                  className={`ml-1 ${
                    cursorVisible ? "opacity-100" : "opacity-0"
                  } text-hot-pink font-bold`}
                >
                  |
                </span>
              </motion.div>
            </div>

            {/* RIGHT SIDE BUTTONS */}
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  {isAdmin && (
                    <button
                      onClick={onViewAdmin}
                      className="gradient-btn text-sm"
                    >
                      Admin Dashboard
                    </button>
                  )}

                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-300">
                      Welcome,{" "}
                      <span className="font-semibold text-hot-pink">
                        {displayName}
                      </span>
                    </span>

                    <button
                      onClick={handleSignOut}
                      className="
                        px-4 py-2 text-gray-300 hover:text-hot-pink 
                        transition-colors border border-gray-600 
                        rounded-lg hover:border-hot-pink
                      "
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => onShowAuth("login")}
                    className="
                      px-6 py-2 text-gray-300 hover:text-hot-pink 
                      transition-colors font-semibold
                    "
                  >
                    Sign In
                  </button>

                  <button
                    onClick={() => onShowAuth("signup")}
                    className="gradient-btn text-sm"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="pt-24 z-10 relative">
        <Hero />

        {/* ⭐ SCROLL TARGET */}
        <div id="events">
          <Events />
        </div>

        <Teams />
      </main>

      {/* FOOTER */}
      <footer className="relative overflow-hidden text-white py-12 border-t border-white/10">
        <div className="absolute -top-20 left-0 w-[500px] h-[300px] bg-pink-500/20 blur-[150px]" />
        <div className="absolute -bottom-20 right-0 w-[500px] h-[300px] bg-orange-400/20 blur-[150px]" />

        <div className="relative container mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-10 z-10">
          <div>
            <h3 className="text-2xl font-black mb-3">Unstop Igniters Club — AIKTC</h3>

            <p className="text-white/70 leading-relaxed max-w-md">
              Igniters Club is a student-driven initiative at AIKTC focused on 
              innovation, creativity, and practical learning.
            </p>
          </div>

          <div className="md:text-right">
            <h3 className="text-2xl font-black mb-3">Core Team GitHub</h3>

            <ul className="space-y-2 text-white/80 md:space-y-3">
              <li>
                <a href="https://github.com/Irfanx3000" target="_blank"
                   className="hover:text-hot-pink transition font-semibold">
                  ⭐ Irfan Shaikh — Tech Lead
                </a>
              </li>

              <li>
                <a href="https://github.com/LabbaiIrfan" target="_blank"
                   className="hover:text-hot-pink transition font-semibold">
                  ⭐ Irfan Labbai — President
                </a>
              </li>

              <li>
                <a href="#" target="_blank"
                   className="hover:text-hot-pink transition font-semibold">
                  ⭐ NAME — Vice President
                </a>
              </li>

              <li>
                <a href="#" target="_blank"
                   className="hover:text-hot-pink transition font-semibold">
                  ⭐ NAME — Design Lead
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="relative text-center text-white/40 text-sm mt-10 z-10">
          © 2024 Igniters Club. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default UserWebsite;
