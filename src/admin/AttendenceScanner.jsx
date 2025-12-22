import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { supabase } from "../supabase/client";

/* =========================================================
   ATTENDANCE SCANNER (BACKWARD COMPATIBLE & SAFE)
========================================================= */

const AttendanceScanner = () => {
  const videoRef = useRef(null);
  const readerRef = useRef(null);
  const scanningLock = useRef(false);

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedDay, setSelectedDay] = useState(1);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= FETCH EVENTS ================= */
  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("id, title")
        .eq("event_type", "igniters")
        .order("event_date", { ascending: true });

      if (!error) setEvents(data || []);
    };

    fetchEvents();
  }, []);

  /* ================= START SCANNER ================= */
  useEffect(() => {
    if (!videoRef.current || !selectedEvent) return;

    readerRef.current = new BrowserMultiFormatReader();

    readerRef.current.decodeFromVideoDevice(
      null,
      videoRef.current,
      async (result, err) => {
        if (result && !scanningLock.current) {
          scanningLock.current = true;
          await handleScan(result.getText());
          setTimeout(() => (scanningLock.current = false), 2000);
        }
      }
    );

    return () => {
      readerRef.current?.reset();
    };
  }, [selectedEvent, selectedDay]);

  /* ================= HANDLE QR ================= */
  const handleScan = async (qrText) => {
    try {
      setLoading(true);
      setStatus("");

      const parsed = JSON.parse(qrText);
      let registrationId = null;

      /* 🔁 OLD QR SUPPORT */
      if (parsed.registration_id) {
        const { data } = await supabase
          .from("igniters_registrations")
          .select("id")
          .eq("registration_id", parsed.registration_id)
          .single();

        registrationId = data?.id;
      }

      /* 🔁 NEW QR SUPPORT */
      if (parsed.id) {
        registrationId = parsed.id;
      }

      if (!registrationId) {
        setStatus("❌ Invalid QR Code");
        return;
      }

      /* 🔒 PREVENT DUPLICATE */
      const { data: existing } = await supabase
        .from("event_attendance")
        .select("id")
        .eq("registration_id", registrationId)
        .eq("event_id", selectedEvent)
        .eq("day", selectedDay)
        .maybeSingle();

      if (existing) {
        setStatus("⚠ Attendance already marked");
        return;
      }

      /* ✅ INSERT ATTENDANCE */
      const { error } = await supabase.from("event_attendance").insert({
        registration_id: registrationId,
        event_id: selectedEvent,
        day: selectedDay,
        status: true,
      });

      if (error) throw error;

      setStatus("✅ Attendance marked successfully");
    } catch (err) {
      console.error(err);
      setStatus("❌ QR Scan Failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#050505] text-white p-6">
      <h1 className="text-3xl font-black text-hot-pink mb-6">
        Attendance Scanner
      </h1>

      {/* CONTROLS */}
      <div className="flex flex-wrap gap-4 mb-6">
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
      {selectedEvent && (
        <div className="max-w-md rounded-2xl overflow-hidden border border-white/20">
          <video ref={videoRef} className="w-full h-auto" />
        </div>
      )}

      {/* STATUS */}
      {status && (
        <div
          className={`mt-4 text-lg font-semibold ${
            status.includes("✅")
              ? "text-green-400"
              : status.includes("⚠")
              ? "text-yellow-400"
              : "text-red-400"
          }`}
        >
          {status}
        </div>
      )}

      {loading && (
        <p className="mt-3 text-sm text-gray-400">Processing scan...</p>
      )}

      <p className="mt-6 text-gray-400 text-sm">
        📸 Keep QR inside the frame. Scan is automatic.
      </p>
    </div>
  );
};

export default AttendanceScanner;
