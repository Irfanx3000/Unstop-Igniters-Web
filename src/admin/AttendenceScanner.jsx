import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { supabase } from "../supabase/client";

const AttendanceScanner = () => {
  const videoRef = useRef(null);
  const codeReader = useRef(null);

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedDay, setSelectedDay] = useState(1);
  const [status, setStatus] = useState("");

  /* 🔹 Fetch Igniters Events */
  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase
        .from("events")
        .select("id, title")
        .eq("type", "igniters");

      setEvents(data || []);
    };

    fetchEvents();
  }, []);

  /* 🔹 Start QR Scanner */
  useEffect(() => {
    if (!videoRef.current) return;

    codeReader.current = new BrowserMultiFormatReader();

    codeReader.current.decodeFromVideoDevice(
      null,
      videoRef.current,
      async (result, error) => {
        if (result) {
          await handleScan(result.getText());
        }
      }
    );

    return () => {
      codeReader.current?.reset();
    };
  }, [selectedEvent, selectedDay]);

  /* 🔹 Handle QR Scan */
  const handleScan = async (text) => {
    try {
      const parsed = JSON.parse(text);
      const registrationId = parsed.registration_id;

      if (!registrationId || !selectedEvent) return;

      // 🔒 Prevent duplicate for same day
      const { data: existing } = await supabase
        .from("event_attendance")
        .select("id")
        .eq("registration_id", registrationId)
        .eq("day", selectedDay)
        .maybeSingle();

      if (existing) {
        setStatus("⚠ Already marked for this day");
        return;
      }

      // ✅ Insert attendance
      const { error } = await supabase.from("event_attendance").insert([
        {
          registration_id: registrationId,
          event_id: selectedEvent,
          day: selectedDay,
          status: true,
        },
      ]);

      if (error) throw error;

      setStatus("✅ Attendance marked successfully");
    } catch (err) {
      console.error(err);
      setStatus("❌ Invalid QR code");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      <h1 className="text-3xl font-black text-hot-pink mb-6">
        Attendance Scanner
      </h1>

      {/* CONTROLS */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Event Selector */}
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl"
        >
          <option value="">Select Event</option>
          {events.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title}
            </option>
          ))}
        </select>

        {/* Day Selector */}
        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(Number(e.target.value))}
          className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl"
        >
          <option value={1}>Day 1</option>
          <option value={2}>Day 2</option>
          <option value={3}>Day 3</option>
        </select>
      </div>

      {/* CAMERA */}
      <div className="max-w-md rounded-2xl overflow-hidden border border-white/20">
        <video ref={videoRef} className="w-full h-auto" />
      </div>

      {/* STATUS */}
      {status && (
        <div className="mt-4 text-lg font-semibold">{status}</div>
      )}

      <p className="mt-6 text-gray-400 text-sm">
        📸 Keep QR inside camera frame. Attendance is auto-marked.
      </p>
    </div>
  );
};

export default AttendanceScanner;
