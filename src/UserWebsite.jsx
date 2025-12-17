import React from "react";
import { useAuth } from "./context/AuthContext";
import Hero from "./sections/Hero";
import Events from "./sections/Events";
import Teams from "./sections/Teams";
import JoinUs from "./sections/JoinUs";
import logo from "./assets/background-logo.png";
import { motion } from "framer-motion";

const UserWebsite = ({ onViewAdmin, onShowAuth }) => {
  const { user, userProfile, isAdmin, signOut } = useAuth();

  const displayName =
    userProfile?.name || user?.email?.split("@")[0] || "User";

  /* ⭐ TYPEWRITER */
  const slogans = [
    { first: "Ignite. Inspire. ", second: "Innovate." },
    { first: "Create. Collaborate. ", second: "Conquer." },
    { first: "Dream Big. ", second: "Build Bigger." },
    { first: "Turning Ideas ", second: "Into Impact." },
    { first: "Leadership Through ", second: "Innovation." },
  ];

  const [index, setIndex] = React.useState(0);
  const [firstTyped, setFirstTyped] = React.useState("");
  const [secondTyped, setSecondTyped] = React.useState("");
  const [cursorVisible, setCursorVisible] = React.useState(true);

  /* Cursor blinking */
  React.useEffect(() => {
    const blink = setInterval(() => {
      setCursorVisible((p) => !p);
    }, 500);
    return () => clearInterval(blink);
  }, []);

  /* Typewriter logic */
  React.useEffect(() => {
    const full = slogans[index];
    let i = 0, j = 0;

    setFirstTyped("");
    setSecondTyped("");

    const interval = setInterval(() => {
      if (i < full.first.length) {
        setFirstTyped(full.first.slice(0, i + 1));
        i++;
        return;
      }
      if (j < full.second.length) {
        setSecondTyped(full.second.slice(0, j + 1));
        j++;
        return;
      }
      clearInterval(interval);
      setTimeout(() => setIndex((p) => (p + 1) % slogans.length), 1500);
    }, 55);

    return () => clearInterval(interval);
  }, [index]);

  /* ⭐ MOBILE MENU STATE */
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  /* SIGN OUT */
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch {
      alert("Sign out failed.");
    }
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden bg-[#050505]">

      {/* ===================== HEADER ===================== */}
  {/* DESKTOP HEADER */}
<header className="hidden md:block fixed top-0 left-0 right-0 z-50 
  backdrop-blur-xl bg-black/40 border-b border-white/10">
  
  <div className="flex items-center justify-between px-10 py-4">

    {/* LEFT — Logo + Typewriter */}
    <div className="flex items-center gap-4">
      <img src={logo} className="h-10 w-auto" />

      <div className="w-[260px] overflow-hidden">
      <span className="text-sm font-medium text-white whitespace-nowrap">
        {firstTyped}
        <span className="text-hot-pink">{secondTyped}</span>
        <span className={cursorVisible ? "opacity-100" : "opacity-0"}>|</span>
      </span>
    </div>
    </div>

    {/* CENTER — NAVIGATION */}
    <nav className="hidden md:flex gap-10 text-lg font-semibold mr-auto pl-12">
      <a href="#hero" className="hover:text-hot-pink transition">Home</a>
      <a href="#events" className="hover:text-hot-pink transition">Events</a>
      <a href="#teams" className="hover:text-hot-pink transition">Teams</a>
      <a href="#joinus" className="hover:text-hot-pink transition">Join Us</a>
    </nav>

    {/* RIGHT — AUTH BUTTONS */}
    <div className="flex items-center gap-4">
      {user ? (
        <>
          {isAdmin && (
            <button
              onClick={onViewAdmin}
              className="gradient-btn text-sm px-4 py-2"
            >
              Admin Dashboard
            </button>
          )}
          <span className="text-gray-300 text-sm">
            Welcome, <span className="text-hot-pink">{displayName}</span>
          </span>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 border border-gray-600 rounded-lg 
              hover:border-hot-pink hover:text-hot-pink text-sm"
          >
            Sign Out
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => onShowAuth("login")}
            className="hover:text-hot-pink transition text-sm"
          >
            Sign In
          </button>
          <button
            onClick={() => onShowAuth("signup")}
            className="gradient-btn text-sm px-4 py-2"
          >
            Sign Up
          </button>
        </>
      )}
    </div>

  </div>
</header>
{/* MOBILE HEADER */}
<header className="md:hidden fixed top-0 left-0 right-0 z-50 
  bg-black/40 backdrop-blur-xl border-b border-white/10">

 {/* MOBILE HEADER (Logo | Typewriter | Menu) */}
<div className="flex md:hidden items-center justify-between px-4 py-3 gap-2 w-full">

  {/* LOGO */}
  <img
    src={logo}
    alt="Igniters Logo"
    className="h-10 w-auto flex-shrink-0"
  />

  {/* TYPEWRITER CENTERED */}
  <div className="flex-1 text-center overflow-hidden">
    <span className="text-xs font-medium text-white whitespace-nowrap block truncate">
      {firstTyped}
      <span className="text-hot-pink">{secondTyped}</span>
      <span
        className={`${cursorVisible ? "opacity-100" : "opacity-0"} text-hot-pink`}
      >
        |
      </span>
    </span>
  </div>

  {/* HAMBURGER */}
  <button
    className="text-white text-3xl flex-shrink-0 ml-2"
    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
  >
    ☰
  </button>

</div>
  {/* DROPDOWN MENU */}
  {mobileMenuOpen && (
    <div className="bg-black/70 backdrop-blur-xl border-t border-white/10 flex flex-col text-center py-4 space-y-4">

      <a href="#hero" className="text-lg text-gray-200 hover:text-hot-pink transition">Home</a>
      <a href="#events" className="text-lg text-gray-200 hover:text-hot-pink transition">Events</a>
      <a href="#teams" className="text-lg text-gray-200 hover:text-hot-pink transition">Teams</a>
      <a href="#joinus" className="text-lg text-gray-200 hover:text-hot-pink transition">Join Us</a>

      <div className="border-t border-white/10 pt-4">
        {user ? (
          <>
            {isAdmin && (
              <button
                onClick={() => {
                  onViewAdmin();
                  setMobileMenuOpen(false);
                }}
                className="gradient-btn w-40 mx-auto py-2 mb-3"
              >
                Admin Dashboard
              </button>
            )}

            <button
              onClick={() => {
                handleSignOut();
                setMobileMenuOpen(false);
              }}
              className="w-40 mx-auto py-2 border border-gray-500 rounded-lg 
                text-gray-300 hover:text-hot-pink hover:border-hot-pink"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                onShowAuth("login");
                setMobileMenuOpen(false);
              }}
              className="w-40 mx-auto text-gray-300 hover:text-hot-pink transition"
            >
              Sign In
            </button>

            <button
              onClick={() => {
                onShowAuth("signup");
                setMobileMenuOpen(false);
              }}
              className="gradient-btn w-40 mx-auto py-2 mt-3"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </div>
  )}
</header>
      {/* ===================== MAIN CONTENT ===================== */}

      <main className="pt-24 z-10 relative">
        <section id="hero"><Hero /></section>
        <section id="events"><Events /></section>
        <section id="teams"><Teams /></section>
        <section id="joinus"><JoinUs /></section>
      </main>

      {/* ===================== FOOTER ===================== */}

      <footer className="relative overflow-hidden text-white py-12 border-t border-white/10">

        <div className="absolute -top-20 left-0 w-[500px] h-[300px] bg-pink-500/20 blur-[150px]"></div>
        <div className="absolute -bottom-20 right-0 w-[500px] h-[300px] bg-orange-400/20 blur-[150px]"></div>

        <div className="relative container mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-10 z-10">

          {/* LEFT */}
          <div>
            <h3 className="text-2xl font-black mb-3">Unstop Igniters Club — AIKTC</h3>

            <p className="text-white/70 leading-relaxed max-w-md">
              Igniters Club is a student-driven initiative at AIKTC focused on
              innovation, creativity, and practical learning.
            </p>

            <div className="flex gap-5 mt-5 text-white/80">
              <a href="https://www.instagram.com/unstop_igniters_aiktc?igsh=Y203dHdzMnd4eHYx" target="_blank" className="hover:text-hot-pink">Instagram</a>
              <a href="https://chat.whatsapp.com/GC48FYFqHwL4o6GD2IuAPc" target="_blank" className="hover:text-hot-pink">WhatsApp Community</a>
            </div>
          </div>

          {/* RIGHT */}
          <div className="md:text-right">
            <h3 className="text-2xl font-black mb-3">Core Team GitHub</h3>

            <ul className="space-y-2 text-white/80">
              <li>
                <a href="https://github.com/LabbaiIrfan" target="_blank" className="hover:text-hot-pink">
                  ⭐ Irfan Labbai 
                </a>
              </li>
              <li>
                <a href="https://github.com/Irfanx3000" target="_blank" className="hover:text-hot-pink">
                  ⭐ Irfan Shaikh 
                </a>
              </li>
              <li>
                <a href="https://github.com/affanshaikh-dev" target="_blank" className="hover:text-hot-pink">
                  ⭐ Affan Shaikh
                </a>
              </li>
              <li>
                <a href="https://github.com/Irfanx3000" target="_blank" className="hover:text-hot-pink">
                  ⭐ Mohd Sohel Ansari 
                </a>
              </li>
              <li>
                <a href="https://github.com/Irfanx3000" target="_blank" className="hover:text-hot-pink">
                  ⭐ Aaysha Quraishi 
                </a>
              </li>
              <li>
                <a href="https://github.com/Irfanx3000" target="_blank" className="hover:text-hot-pink">
                  ⭐ Mariyam Khan Deshmukh
                </a>
              </li>
              <li>
                <a href="https://github.com/Irfanx3000" target="_blank" className="hover:text-hot-pink">
                  ⭐ Burhan Parkar 
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center text-white/40 text-sm mt-10">
          © 2025 Igniters Club. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default UserWebsite;
