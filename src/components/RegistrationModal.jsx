import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase/client";
import Starfield from "./StarField";
import emailjs from "emailjs-com";
import QRCode from "qrcode";

/* ================= EMAILJS ENV ================= */
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

/* ================= QR GENERATOR ================= */
const generateQRCode = async (payload) => {
  return QRCode.toDataURL(JSON.stringify(payload), {
    width: 300,
    margin: 2,
  });
};

const RegistrationModal = ({ event, isOpen, onClose }) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    course: "",
    year: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  /* ================= AUTO FILL EMAIL ================= */
  useEffect(() => {
    if (user && isOpen) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || "",
      }));
    }
  }, [user, isOpen]);

  /* ================= INPUT HANDLER ================= */
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* ================= EMAIL SENDER ================= */
  const sendConfirmationEmail = async (qrCode, registrationId) => {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        name: formData.name,
        email: formData.email,
        event_name: event.title,
        event_date: "7–9 January 2026",
        venue: "AIKTC Campus",
        registration_id: registrationId,
        qr_code: qrCode, // <img src="{{qr_code}}" />
      },
      EMAILJS_PUBLIC_KEY
    );
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please sign in to register for this event.");
      return;
    }

    setLoading(true);

    try {
      /* 🔍 DUPLICATE CHECK */
      const { data: existing } = await supabase
        .from("igniters_registrations")
        .select("registration_id")
        .eq("event_id", event.id)
        .eq("email", formData.email)
        .maybeSingle();

      if (existing) {
        alert("You already registered for this event.");
        setLoading(false);
        return;
      }

      /* 📝 INSERT REGISTRATION */
      const { data, error } = await supabase
        .from("igniters_registrations")
        .insert([
          {
            event_id: event.id,
            name: formData.name,
            email: formData.email,
            course: formData.course,
            year: formData.year,
          },
        ])
        .select("registration_id")
        .single();

      if (error) throw error;

      /* 🔳 GENERATE QR */
      const qrCode = await generateQRCode({
        registration_id: data.registration_id,
        event_id: event.id,
      });

      /* 📧 SEND EMAIL */
      await sendConfirmationEmail(qrCode, data.registration_id);

      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        onClose();
        setFormData({ name: "", email: "", course: "", year: "" });
      }, 2500);
    } catch (err) {
      console.error(err);
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          {/* BACKGROUND */}
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <Starfield />
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-pink-500/20 blur-[150px]" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-500/20 blur-[150px]" />
          </div>

          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="
              glass-card max-w-lg w-full max-h-[85vh] overflow-y-auto
              p-6 rounded-3xl bg-white/10 backdrop-blur-2xl
              border border-white/20 shadow-xl
            "
          >
            {success ? (
              /* ================= SUCCESS ================= */
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-center py-8"
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
                <h3 className="text-2xl font-black text-hot-pink mb-2">
                  Registration Successful!
                </h3>
                <p className="text-gray-200">
                  Check your email for the QR pass 🎟️
                </p>
              </motion.div>
            ) : (
              /* ================= FORM ================= */
              <>
                <h3 className="text-3xl font-black text-hot-pink mb-2">
                  Register for {event.title}
                </h3>

                <p className="text-gray-200 mb-5">
                  Join this exciting event hosted by Igniters Club
                </p>

                {!user && (
                  <div className="mb-6 p-4 rounded-xl border border-yellow-400/40 bg-yellow-500/10 text-yellow-300">
                    Please sign in to register for this event.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {[
                    { label: "Full Name", name: "name", placeholder: "Enter your full name" },
                    { label: "Email", name: "email", placeholder: "Enter your email", disabled: true },
                    { label: "Course/Department", name: "course", placeholder: "e.g., Computer Engineering" },
                    { label: "Year", name: "year", placeholder: "FY / SY / TY" },
                  ].map((f) => (
                    <div key={f.name}>
                      <label className="block text-white font-medium mb-2">
                        {f.label} <span className="text-pink-400">*</span>
                      </label>
                      <input
                        name={f.name}
                        value={formData[f.name]}
                        onChange={handleChange}
                        required
                        disabled={f.disabled || !user}
                        placeholder={f.placeholder}
                        className="
                          w-full px-4 py-3 rounded-xl bg-white/10
                          border border-white/20 text-white
                          placeholder-gray-400 focus:ring-2
                          focus:ring-hot-pink disabled:opacity-50
                        "
                      />
                    </div>
                  ))}

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 py-3 rounded-xl bg-white/10 text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!user || loading}
                      className="flex-1 gradient-btn rounded-xl disabled:opacity-50"
                    >
                      {loading ? "Registering..." : "Register"}
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
