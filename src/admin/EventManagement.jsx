import React, { useState } from "react";
import { motion } from "framer-motion";
import { useEvents } from "../hooks/useEvents";
import GlassCard from "../components/GlassCard";
import { supabase } from "../supabase/client";

const EventManagement = () => {
  const [activeTab, setActiveTab] = useState("unstop");
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_date: "",       // YYYY-MM-DD
    event_time: "",       // HH:mm
    event_type: "igniters",
    registration_status: "active", // active | upcoming | closed
    external_link: "",
    image_url: "",
  });

  const { events, addEvent, updateEvent, deleteEvent } = useEvents();

  /* =========================================================
     IMAGE UPLOAD
  ========================================================= */
  const handleImageUpload = async (file) => {
    if (!file) return;

    try {
      setUploading(true);
      const ext = file.name.split(".").pop();
      const fileName = `event-${Date.now()}.${ext}`;

      const { error } = await supabase.storage
        .from("event-images")
        .upload(fileName, file);

      if (error) throw error;

      const { data } = supabase.storage
        .from("event-images")
        .getPublicUrl(fileName);

      setFormData((prev) => ({
        ...prev,
        image_url: data.publicUrl,
      }));
    } catch (err) {
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* =========================================================
     SUBMIT EVENT
  ========================================================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Combine date + time before saving
    const finalPayload = {
      ...formData,
      event_date:
        formData.event_date && formData.event_time
          ? `${formData.event_date}T${formData.event_time}`
          : null,
    };

    delete finalPayload.event_time;

    if (editingEvent) {
      await updateEvent(editingEvent.id, finalPayload);
    } else {
      await addEvent(finalPayload);
    }

    resetForm();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingEvent(null);
    setFormData({
      title: "",
      description: "",
      event_date: "",
      event_time: "",
      event_type: "igniters",
      registration_status: "active",
      external_link: "",
      image_url: "",
    });
  };

  /* =========================================================
     EDIT EVENT
  ========================================================= */
  const handleEdit = (event) => {
    const [date, time] = event.event_date
      ? event.event_date.split("T")
      : ["", ""];

    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || "",
      event_date: date || "",
      event_time: time?.slice(0, 5) || "",
      event_type: event.event_type,
      registration_status: event.registration_status || "active",
      external_link: event.external_link || "",
      image_url: event.image_url || "",
    });
    setShowForm(true);
  };

  const filteredEvents = events.filter(
    (e) => e.event_type === activeTab
  );

  /* =========================================================
     UI
  ========================================================= */
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black text-white">Event Management</h2>
        <button
          onClick={() => {
            setEditingEvent(null);
            setShowForm(true);
          }}
          className="gradient-btn"
        >
          + Add Event
        </button>
      </div>

      {/* TABS */}
      <div className="flex gap-4">
        {["unstop", "igniters"].map((type) => (
          <button
            key={type}
            onClick={() => setActiveTab(type)}
            className={`px-6 py-3 rounded-xl font-semibold ${
              activeTab === type
                ? "gradient-btn"
                : "bg-white/10 text-gray-300"
            }`}
          >
            {type === "unstop" ? "Unstop Events" : "Igniters Events"}
          </button>
        ))}
      </div>

      {/* ================= MODAL ================= */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={resetForm}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="glass-card p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-hot-pink mb-4">
              {editingEvent ? "Edit Event" : "Create Event"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">

              <FormInput
                label="Event Title"
                value={formData.title}
                onChange={(v) => setFormData({ ...formData, title: v })}
                required
              />

              <FormTextarea
                label="Description"
                value={formData.description}
                onChange={(v) =>
                  setFormData({ ...formData, description: v })
                }
              />

              {/* DATE & TIME (SEPARATE) */}
              <div className="grid md:grid-cols-2 gap-4">
                <FormInput
                  type="date"
                  label="Event Date"
                  value={formData.event_date}
                  onChange={(v) =>
                    setFormData({ ...formData, event_date: v })
                  }
                />

                <FormInput
                  type="time"
                  label="Event Time"
                  value={formData.event_time}
                  onChange={(v) =>
                    setFormData({ ...formData, event_time: v })
                  }
                />
              </div>

              <FormSelect
                label="Registration Status"
                value={formData.registration_status}
                onChange={(v) =>
                  setFormData({ ...formData, registration_status: v })
                }
                options={[
                  { value: "active", label: "Active (Open)" },
                  { value: "upcoming", label: "Upcoming" },
                  { value: "closed", label: "Closed" },
                ]}
              />

              <FormSelect
                label="Event Type"
                value={formData.event_type}
                onChange={(v) =>
                  setFormData({ ...formData, event_type: v })
                }
                options={[
                  { value: "igniters", label: "Igniters Event" },
                  { value: "unstop", label: "Unstop Event" },
                ]}
              />

              {/* IMAGE */}
              <div>
                <label className="text-sm text-white/80">Event Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files[0])}
                  className="w-full mt-1"
                />
                {uploading && (
                  <p className="text-sm text-hot-pink">Uploading...</p>
                )}
              </div>

              <FormInput
                label="External Link (optional)"
                value={formData.external_link}
                onChange={(v) =>
                  setFormData({ ...formData, external_link: v })
                }
              />

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 border border-white/20 rounded-xl py-3"
                >
                  Cancel
                </button>
                <button className="flex-1 gradient-btn">
                  {editingEvent ? "Update Event" : "Create Event"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* ================= EVENTS LIST ================= */}
      <div className="grid gap-6">
        {filteredEvents.map((event) => (
          <GlassCard key={event.id} className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold">{event.title}</h3>
                <p className="text-sm text-gray-400">
                  Status: {event.registration_status}
                </p>
                <p className="text-sm text-gray-400">
                  {event.event_date &&
                    new Date(event.event_date).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(event)}
                  className="bg-blue-500 px-4 py-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteEvent(event.id)}
                  className="bg-red-500 px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

/* ================= REUSABLE INPUTS ================= */

const FormInput = ({ label, onChange, ...props }) => (
  <div>
    <label className="text-sm text-white/80 mb-1 block">{label}</label>
    <input
      {...props}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg"
    />
  </div>
);

const FormTextarea = ({ label, onChange, ...props }) => (
  <div>
    <label className="text-sm text-white/80 mb-1 block">{label}</label>
    <textarea
      {...props}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg"
    />
  </div>
);

const FormSelect = ({ label, options, onChange, ...props }) => (
  <div>
    <label className="text-sm text-white/80 mb-1 block">{label}</label>
    <select
      {...props}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default EventManagement;
