import React, { useState } from "react";
import Starfield from "../components/StarField";

const JoinUs = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    github: "",
    course: "",
    year: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // SEND EMAIL
    const body = `
      Name: ${form.name}
      Email: ${form.email}
      Phone: ${form.phone}
      GitHub: ${form.github}
      Course: ${form.course}
      Year: ${form.year}
      Message: ${form.message}
    `;

    try {
      await fetch("https://formsubmit.co/ajax/irfanshaikhx3@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: body,
        }),
      });

      setStatus("success");
      setForm({
        name: "",
        email: "",
        phone: "",
        github: "",
        course: "",
        year: "",
        message: "",
      });
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <section
      id="joinus"
      className="relative py-24 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* 🌌 Shooting Stars Background */}
      <Starfield />

      {/* Background glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-pink-600/20 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-500/20 blur-[150px] rounded-full"></div>

      {/* Content Wrapper */}
      <div className="relative z-10 w-full px-6">
        <h2 className="text-4xl font-black text-center mb-10">
          Join the <span className="text-hot-pink">Igniters Club</span>
        </h2>

        {/* FORM CARD */}
        <div
          className="
            max-w-3xl mx-auto p-10 rounded-3xl 
            bg-white/5 backdrop-blur-xl shadow-[0_0_45px_rgba(255,77,166,0.15)]
            border border-white/10
          "
        >
          {status === "success" && (
            <p className="mb-5 text-center text-green-400 font-semibold">
              🎉 Thank you! Your application has been sent.
            </p>
          )}

          {status === "error" && (
            <p className="mb-5 text-center text-red-400 font-semibold">
              ❌ Something went wrong. Please try again.
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <input
              type="text"
              name="name"
              required
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 
                text-white placeholder-gray-300 focus:ring-2 focus:ring-hot-pink"
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              required
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 
                text-white placeholder-gray-300 focus:ring-2 focus:ring-hot-pink"
            />

            {/* Phone */}
            <input
              type="text"
              name="phone"
              required
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 
                text-white placeholder-gray-300 focus:ring-2 focus:ring-hot-pink"
            />

            {/* GitHub */}
            <input
              type="url"
              name="github"
              placeholder="GitHub Profile Link"
              value={form.github}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 
                text-white placeholder-gray-300 focus:ring-2 focus:ring-hot-pink"
            />

            {/* Course */}
            <input
              type="text"
              name="course"
              placeholder="Course (e.g., BTech AIML)"
              value={form.course}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 
                text-white placeholder-gray-300 focus:ring-2 focus:ring-hot-pink"
            />

            {/* Year */}
            <input
              type="text"
              name="year"
              placeholder="Year (e.g., Second Year)"
              value={form.year}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 
                text-white placeholder-gray-300 focus:ring-2 focus:ring-hot-pink"
            />

            {/* Message */}
            <textarea
              name="message"
              rows="4"
              placeholder="Message (Optional)"
              value={form.message}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 
                text-white placeholder-gray-300 focus:ring-2 focus:ring-hot-pink"
            />

            <button
              type="submit"
              className="w-full gradient-btn py-4 rounded-xl text-lg font-bold shadow-lg"
            >
              Submit Application
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default JoinUs;
