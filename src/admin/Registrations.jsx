import React, { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import QRScanner from "../components/QRScanner";

/* =========================================================
   REGISTRATIONS ADMIN SCREEN (UI IMPROVED)
========================================================= */

const Registrations = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanDay, setScanDay] = useState(1);
  const [scanSuccess, setScanSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH EVENTS ================= */
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data } = await supabase
      .from("events")
      .select("id, title")
      .eq("event_type", "igniters")
      .order("event_date", { ascending: true });

    if (data?.length) {
      setEvents(data);
      setSelectedEvent(data[0].id);
    }
  };

  /* ================= FETCH REGISTRATIONS ================= */
  useEffect(() => {
    if (selectedEvent) fetchRegistrations();
  }, [selectedEvent]);

  const fetchRegistrations = async () => {
    setLoading(true);

    const { data: regs } = await supabase
      .from("igniters_registrations")
      .select("*")
      .eq("event_id", selectedEvent)
      .order("registered_at", { ascending: true });

    const { data: att } = await supabase
      .from("event_attendance")
      .select("*")
      .eq("event_id", selectedEvent);

    const attMap = {};
    att?.forEach((a) => {
      if (!attMap[a.registration_id]) attMap[a.registration_id] = {};
      attMap[a.registration_id][a.day] = a.status;
    });

    setRegistrations(regs || []);
    setAttendance(attMap);
    setLoading(false);
  };

  /* ================= MANUAL TOGGLE ================= */
  const toggleAttendance = async (registrationId, day) => {
    const current = attendance?.[registrationId]?.[day];

    await supabase
      .from("event_attendance")
      .upsert(
        {
          registration_id: registrationId,
          event_id: selectedEvent,
          day,
          status: !current,
          scanned_at: new Date().toISOString(),
        },
        { onConflict: "registration_id,event_id,day" }
      );

    fetchRegistrations();
  };

  /* ================= QR SCAN ================= */
  const handleQRScan = async (decodedText) => {
    try {
      const { registration_id, event_id } = JSON.parse(decodedText);

      if (event_id !== selectedEvent) {
        alert("QR does not belong to this event");
        return;
      }

      await supabase
        .from("event_attendance")
        .upsert(
          {
            registration_id,
            event_id,
            day: scanDay,
            status: true,
            scanned_at: new Date().toISOString(),
          },
          { onConflict: "registration_id,event_id,day" }
        );

      setScanSuccess("✅ Attendance marked successfully");
      setScannerOpen(false);
      fetchRegistrations();

      setTimeout(() => setScanSuccess(null), 2000);
    } catch {
      alert("Invalid QR Code");
    }
  };

  /* ================= EXPORT ================= */
  const exportToExcel = () => {
    const rows = registrations.map((r) => ({
      Name: r.name,
      Email: r.email,
      Course: r.course,
      Year: r.year,
      Day1: attendance?.[r.registration_id]?.[1] ? "Present" : "Absent",
      Day2: attendance?.[r.registration_id]?.[2] ? "Present" : "Absent",
      Day3: attendance?.[r.registration_id]?.[3] ? "Present" : "Absent",
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Registrations");

    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buffer]), "event-registrations.xlsx");
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h2 className="text-4xl font-black text-hot-pink">
          Event Registrations
        </h2>

        <div className="flex gap-3">
          <button onClick={exportToExcel} className="gradient-btn">
            Export Excel
          </button>

          <button
            onClick={() => setScannerOpen(true)}
            className="border border-white/30 px-4 py-2 rounded-xl hover:bg-white/10"
          >
            Open QR Scanner
          </button>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="flex flex-wrap gap-4">
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="bg-white/10 p-3 rounded-xl border border-white/20"
        >
          {events.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title}
            </option>
          ))}
        </select>

        <select
          value={scanDay}
          onChange={(e) => setScanDay(Number(e.target.value))}
          className="bg-white/10 p-3 rounded-xl border border-white/20"
        >
          <option value={1}>Day 1</option>
          <option value={2}>Day 2</option>
          <option value={3}>Day 3</option>
        </select>
      </div>

      {/* SUCCESS */}
      {scanSuccess && (
        <div className="bg-green-500/20 text-green-300 p-3 rounded-xl">
          {scanSuccess}
        </div>
      )}

      {/* QR */}
      {scannerOpen && (
        <QRScanner
          onScan={handleQRScan}
          onClose={() => setScannerOpen(false)}
        />
      )}

      {/* TABLE */}
      <div className="glass-card p-6 overflow-x-auto">
        {loading ? (
          <p className="text-gray-400">Loading registrations...</p>
        ) : registrations.length === 0 ? (
          <p className="text-gray-400">No registrations found.</p>
        ) : (
          <table className="w-full min-w-[900px] border-separate border-spacing-y-2">
            <thead>
              <tr className="text-gray-300">
                <th>Name</th>
                <th>Email</th>
                <th>Course</th>
                <th>Year</th>
                {[1, 2, 3].map((d) => (
                  <th key={d} className="text-center">
                    Day {d}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {registrations.map((r) => (
                <tr
                  key={r.id}
                  className="bg-white/5 hover:bg-white/10 transition rounded-xl"
                >
                  <td>{r.name}</td>
                  <td>{r.email}</td>
                  <td>{r.course}</td>
                  <td>{r.year}</td>

                  {[1, 2, 3].map((d) => (
                    <td key={d} className="text-center">
                      <button
                        onClick={() =>
                          toggleAttendance(r.registration_id, d)
                        }
                        className={`
                          w-9 h-9 rounded-full font-bold transition
                          ${
                            attendance?.[r.registration_id]?.[d] === true
                              ? "bg-green-500 text-black"
                              : attendance?.[r.registration_id]?.[d] === false
                              ? "bg-red-500 text-white"
                              : "bg-gray-700 text-gray-300"
                          }
                        `}
                      >
                        {attendance?.[r.registration_id]?.[d] === true
                          ? "✓"
                          : attendance?.[r.registration_id]?.[d] === false
                          ? "✕"
                          : "–"}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Registrations;
