import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase/client";
import Starfield from "./StarField"; // ⭐ Stars background
import emailjs from "emailjs-com";

// 🔐 EmailJS ENV
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const RegistrationModal = ({ event, isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    course: "",
    year: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (user && isOpen) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || "",
      }));
    }
  }, [user, isOpen]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // 📧 EmailJS sender
  const sendConfirmationEmail = async () => {
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name: formData.name,
          email: formData.email,
          event_name: event.title,
          event_date: "7 January 2026",
          venue: "AIKTC Campus",
        },
        EMAILJS_PUBLIC_KEY
      );
    } catch (error) {
      console.error("Email sending failed:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please sign in to register for events.");
      onClose();
      return;
    }

    setLoading(true);

    try {
      const { data: existingRegistration, error: checkError } = await supabase
        .from("igniters_registrations")
        .select("*")
        .eq("event_id", event.id)
        .eq("email", formData.email)
        .single();

      if (checkError && checkError.code !== "PGRST116") throw checkError;

      if (existingRegistration) {
        alert("You already registered for this event!");
        setLoading(false);
        return;
      }

      const { error } = await supabase.from("igniters_registrations").insert([
        {
          event_id: event.id,
          name: formData.name,
          email: formData.email,
          course: formData.course,
          year: formData.year,
        },
      ]);

      if (error) throw error;

      // 📧 Send confirmation email (EmailJS)
      sendConfirmationEmail();

      setSuccess(true);

      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({ name: "", email: "", course: "", year: "" });
      }, 2000);
    } catch (err) {
      console.error(err);
      alert("Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* ⭐ Stars + Nebula */}
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <Starfield />
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-pink-500/20 blur-[150px] rounded-full"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-500/20 blur-[150px] rounded-full"></div>
          </div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="
              glass-card 
              max-w-lg w-full 
              max-h-[80vh] overflow-y-auto
              p-6 
              rounded-3xl 
              bg-white/10 backdrop-blur-2xl 
              border border-white/20 
              shadow-[0_0_60px_rgba(255,120,200,0.2)]
            "
          >
            {success ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-hot-pink mb-2">
                  Registration Successful!
                </h3>
                <p className="text-gray-200">You are registered for:</p>
                <p className="font-semibold text-white mt-1">
                  {event.title}
                </p>
              </motion.div>
            ) : (
              <>
                <h3 className="text-3xl font-black text-hot-pink mb-2">
                  Register for {event.title}
                </h3>
                <p className="text-gray-200 mb-6">
                  Join this exciting event hosted by Igniters Club
                </p>

                {!user && (
                  <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-400 text-yellow-200 rounded-lg text-sm">
                    Please sign in to register for this event.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* NAME */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">
                      Full Name *
                    </label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={!user}
                      className="w-full px-4 py-3 bg-white/10 text-white border border-white/20 rounded-xl focus:ring-2 focus:ring-hot-pink placeholder-gray-300 disabled:opacity-50"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">
                      Email *
                    </label>
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={!user}
                      className="w-full px-4 py-3 bg-white/10 text-white border border-white/20 rounded-xl focus:ring-2 focus:ring-hot-pink placeholder-gray-300 disabled:opacity-50"
                      placeholder="Enter your email"
                    />
                  </div>

                  {/* COURSE */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">
                      Course/Department *
                    </label>
                    <input
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      required
                      disabled={!user}
                      className="w-full px-4 py-3 bg-white/10 text-white border border-white/20 rounded-xl focus:ring-2 focus:ring-hot-pink placeholder-gray-300 disabled:opacity-50"
                      placeholder="e.g., Computer Engineering, B.Tech"
                    />
                  </div>

                  {/* YEAR */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">
                      Year *
                    </label>
                    <input
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      required
                      disabled={!user}
                      className="w-full px-4 py-3 bg-white/10 text-white border border-white/20 rounded-xl focus:ring-2 focus:ring-hot-pink placeholder-gray-300 disabled:opacity-50"
                      placeholder="e.g., FY / SY / TY"
                    />
                  </div>

                  {/* BUTTONS */}
                  <div className="flex gap-4 pt-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 py-3 bg-white/10 text-white border border-white/20 rounded-xl"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={!user || loading}
                      className="flex-1 gradient-btn rounded-xl disabled:opacity-50"
                    >
                      {!user
                        ? "Sign In Required"
                        : loading
                        ? "Registering..."
                        : "Register"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RegistrationModal;
