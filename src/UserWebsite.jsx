import React from 'react'
import { useAuth } from './context/AuthContext'
import Hero from './sections/Hero'
import Events from './sections/Events'
import Teams from './sections/Teams'
import logo from "./assets/background-logo.png";
import { motion } from 'framer-motion'

const UserWebsite = ({ onViewAdmin, onShowAuth }) => {
  const { user, userProfile, isAdmin, signOut } = useAuth()

  const displayName = userProfile?.name || user?.email?.split('@')[0] || 'User'

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      alert('Sign out failed.')
    }
  }

  // ----------------------------------------------------
  // 🔥 NO-MIX TYPEWRITER SYSTEM (Final & Perfect)
  // ----------------------------------------------------
  const slogans = [
    { first: "Ignite. Inspire. ", second: "Innovate." },
    { first: "Create. Collaborate. ", second: "Conquer." },
    { first: "Dream Big. ", second: "Build Bigger." },
    { first: "Turning Ideas ", second: "into Impact." },
    { first: "Leadership Through ", second: "Innovation." }
  ];

  const [index, setIndex] = React.useState(0);
  const [firstTyped, setFirstTyped] = React.useState("");
  const [secondTyped, setSecondTyped] = React.useState("");
  const [cursorVisible, setCursorVisible] = React.useState(true);

  // Blinking cursor
  React.useEffect(() => {
    const blink = setInterval(() => {
      setCursorVisible(prev => !prev);
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
      // Type first part
      if (i < first.length) {
        setFirstTyped(first.slice(0, i + 1));
        i++;
        return;
      }

      // Type second part
      if (j < second.length) {
        setSecondTyped(second.slice(0, j + 1));
        j++;
        return;
      }

      // Completed → wait then switch slogan
      clearInterval(interval);
      setTimeout(() => {
        setIndex(prev => (prev + 1) % slogans.length);
      }, 3000); // hold 3 seconds fully typed

    }, 60);

    return () => clearInterval(interval);
  }, [index]);

  return (
    <div className="relative">
      <header className="fixed top-0 left-0 right-0 z-50 p-4">
        <div className="bg-white/95 backdrop-blur-md border-b border-gray-200 p-4 rounded-b-2xl shadow-sm">
          <div className="flex items-center justify-between">

            {/* ------------------------------------ */}
            {/* LOGO + PERFECT TYPEWRITER TEXT        */}
            {/* ------------------------------------ */}
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
                {/* First part — black */}
                <span className="text-black">{firstTyped}</span>

                {/* Second part — hot pink */}
                <span className="text-hot-pink">{secondTyped}</span>

                {/* Blinking cursor */}
                <span
                  className={`ml-1 ${
                    cursorVisible ? "opacity-100" : "opacity-0"
                  } text-hot-pink font-bold`}
                >
                  |
                </span>
              </motion.div>
            </div>

            {/* ------------------------------------ */}
            {/* RIGHT SIDE CONTROLS (Sign In etc.)   */}
            {/* ------------------------------------ */}
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
                    <span className="text-sm text-gray-600">
                      Welcome,{" "}
                      <span className="font-semibold text-hot-pink">
                        {displayName}
                      </span>
                    </span>

                    <button
                      onClick={handleSignOut}
                      className="px-4 py-2 text-gray-600 hover:text-hot-pink transition-colors border border-gray-300 rounded-lg hover:border-hot-pink"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => onShowAuth("login")}
                    className="px-6 py-2 text-gray-600 hover:text-hot-pink transition-colors font-semibold"
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

      {/* ------------------------------------ */}
      {/* WEBSITE SECTIONS                     */}
      {/* ------------------------------------ */}
      <main className="pt-20">
        <Hero />
        <Events />
        <Teams />
      </main>

      {/* ------------------------------------ */}
      {/* FOOTER                               */}
      {/* ------------------------------------ */}
      <footer className="bg-gradient-to-r from-[#FF4DA6] to-[#FF8A29] text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-black mb-4">Unstop Igniters Club - AIKTC</h3>
          <p className="text-white/80 mb-6">
            Igniting innovation, fostering creativity
          </p>
          <div className="text-white/60 text-sm">
            © 2024 Igniters Club. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default UserWebsite
