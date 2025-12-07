import React, { useState } from "react";
import { motion } from "framer-motion";
import { useEvents } from "../hooks/useEvents";
import GlassCard from "../components/GlassCard";
import { supabase } from "../supabase/client"; // REQUIRED for image upload

const EventManagement = () => {
  const [activeTab, setActiveTab] = useState("unstop");
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_date: "",
    event_type: "igniters",
    external_link: "",
    image_url: "",
  });

  const { events, addEvent, updateEvent, deleteEvent } = useEvents();

  /* ============================================================
     IMAGE UPLOAD → SUPABASE BUCKET (event-images)
  ============================================================ */
  const handleImageUpload = async (file) => {
    if (!file) return;

    try {
      setUploading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `event-${Date.now()}.${fileExt}`;

      const { error: uploadErr } = await supabase.storage
        .from("event-images")
        .upload(fileName, file);

      if (uploadErr) throw uploadErr;

      const { data: publicUrlData } = supabase.storage
        .from("event-images")
        .getPublicUrl(fileName);

      setFormData((prev) => ({
        ...prev,
        image_url: publicUrlData.publicUrl,
      }));
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      alert("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  /* ============================================================
     SUBMIT EVENT
  ============================================================ */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, formData);
      } else {
        await addEvent(formData);
      }

      // Reset & close
      setShowForm(false);
      setEditingEvent(null);
      setFormData({
        title: "",
        description: "",
        event_date: "",
        event_type: "igniters",
        external_link: "",
        image_url: "",
      });
    } catch (error) {
      console.log(error);
      alert("Error saving event.");
    }
  };

  /* ============================================================
     EDIT EVENT
  ============================================================ */
  const handleEdit = (event) => {
    setEditingEvent(event);

    setFormData({
      title: event.title,
      description: event.description || "",
      event_date: event.event_date ? event.event_date.slice(0, 16) : "",
      event_type: event.event_type,
      external_link: event.external_link || "",
      image_url: event.image_url || "",
    });

    setShowForm(true);
  };

  /* ============================================================
     DELETE EVENT
  ============================================================ */
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      await deleteEvent(id);
    } catch (err) {
      alert("Error deleting event.");
    }
  };

  const filteredEvents = events.filter((e) => e.event_type === activeTab);

  /* ============================================================
     UI
  ============================================================ */
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
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === type
                ? "gradient-btn text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            {type === "unstop" ? "Unstop Events" : "Igniters Events"}
          </button>
        ))}
      </div>

      {/* ================= FORM MODAL ================= */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowForm(false);
            setEditingEvent(null);
          }}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="glass-card p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-hot-pink mb-4">
              {editingEvent ? "Edit Event" : "Create New Event"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* TITLE */}
              <FormInput
                label="Event Title"
                value={formData.title}
                onChange={(v) => setFormData({ ...formData, title: v })}
                required
              />

              {/* DESCRIPTION */}
              <FormTextarea
                label="Description"
                value={formData.description}
                onChange={(v) => setFormData({ ...formData, description: v })}
              />

              <div className="grid md:grid-cols-2 gap-4">
                {/* DATE */}
                <FormInput
                  type="datetime-local"
                  label="Event Date & Time"
                  value={formData.event_date}
                  onChange={(v) =>
                    setFormData({ ...formData, event_date: v })
                  }
                />

                {/* EVENT TYPE */}
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
              </div>

              {/* IMAGE UPLOAD */}
              <div>
                <label className="block text-sm text-white/80 mb-1">
                  Event Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files[0])}
                  className="w-full bg-white/10 text-white border border-white/20 rounded-lg p-2"
                />

                {uploading && (
                  <p className="text-hot-pink text-sm mt-1">
                    Uploading image...
                  </p>
                )}

                {/* URL */}
                <input
                  type="text"
                  placeholder="Or paste image URL"
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                  className="w-full px-4 py-2 mt-2 bg-white/10 text-white border border-white/20 rounded-lg"
                />

                {/* PREVIEW */}
                {formData.image_url && (
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-full mt-3 rounded-xl border border-white/20"
                  />
                )}
              </div>

              {/* EXTERNAL LINK */}
              <FormInput
                label="External Link (optional)"
                value={formData.external_link}
                onChange={(v) =>
                  setFormData({ ...formData, external_link: v })
                }
              />

              {/* BUTTONS */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingEvent(null);
                  }}
                  className="flex-1 border border-white/20 rounded-xl py-3"
                >
                  Cancel
                </button>

                <button type="submit" className="flex-1 gradient-btn">
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
          <GlassCard key={event.id} className="p-6 bg-white/10 border border-white/20">
            <div className="flex justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">{event.title}</h3>

                {event.image_url && (
                  <img
                    src={event.image_url}
                    className="w-48 h-32 object-cover mt-3 rounded-lg border border-white/10"
                    alt="event"
                  />
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(event)}
                  className="px-4 py-2 bg-blue-500 rounded-lg"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(event.id)}
                  className="px-4 py-2 bg-red-500 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <GlassCard className="p-12 text-center text-gray-300 bg-white/10 border border-white/20">
          No {activeTab} events found.
        </GlassCard>
      )}
    </div>
  );
};

/* ============================================================
   SMALL REUSABLE INPUT COMPONENTS
============================================================ */

const FormInput = ({ label, onChange, ...props }) => (
  <div>
    <label className="block text-sm text-white/80 mb-1">{label}</label>
    <input
      {...props}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg"
    />
  </div>
);

const FormTextarea = ({ label, onChange, ...props }) => (
  <div>
    <label className="block text-sm text-white/80 mb-1">{label}</label>
    <textarea
      {...props}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg"
    />
  </div>
);

const FormSelect = ({ label, options, onChange, ...props }) => (
  <div>
    <label className="block text-sm text-white/80 mb-1">{label}</label>
    <select
      {...props}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg"
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
