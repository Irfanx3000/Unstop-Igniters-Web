import React, { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import QRScanner from "../components/QRScanner";

/* =========================================================
   REGISTRATIONS ADMIN SCREEN
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
    const { data, error } = await supabase
      .from("events")
      .select("id, title")
      .eq("event_type", "igniters")
      .order("event_date", { ascending: true });

    if (!error && data?.length) {
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

  /* ================= MANUAL ATTENDANCE ================= */
  const toggleAttendance = async (registrationId, day) => {
    const current = attendance?.[registrationId]?.[day] || false;

    await supabase.from("event_attendance").upsert({
      registration_id: registrationId,
      event_id: selectedEvent,
      day,
      status: !current,
      marked_at: new Date(),
    });

    fetchRegistrations();
  };

  /* ================= QR SCAN HANDLER ================= */
  const handleQRScan = async (decodedText) => {
    try {
      const { registration_id, event_id } = JSON.parse(decodedText);

      if (event_id !== selectedEvent) {
        alert("QR does not belong to this event");
        return;
      }

      await supabase.from("event_attendance").upsert({
        registration_id,
        event_id,
        day: scanDay,
        status: true,
        marked_at: new Date(),
      });

      setScanSuccess("Attendance marked successfully");
      setScannerOpen(false);
      fetchRegistrations();

      setTimeout(() => setScanSuccess(null), 2000);
    } catch {
      alert("Invalid QR Code");
    }
  };

  /* ================= EXPORT TO EXCEL ================= */
  const exportToExcel = () => {
    const rows = registrations.map((r) => ({
      Name: r.name,
      Email: r.email,
      Course: r.course,
      Year: r.year,
      Day1: attendance?.[r.id]?.[1] ? "Present" : "Absent",
      Day2: attendance?.[r.id]?.[2] ? "Present" : "Absent",
      Day3: attendance?.[r.id]?.[3] ? "Present" : "Absent",
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Registrations");

    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buffer]), "event-registrations.xlsx");
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h2 className="text-3xl md:text-4xl font-black text-hot-pink">
          Event Registrations
        </h2>

        <div className="flex gap-3">
          <button onClick={exportToExcel} className="gradient-btn">
            Export Excel
          </button>

          <button
            onClick={() => setScannerOpen(true)}
            className="bg-white/10 px-4 py-2 rounded-xl"
          >
            Open QR Scanner
          </button>
        </div>
      </div>

      {/* EVENT SELECT */}
      <select
        value={selectedEvent}
        onChange={(e) => setSelectedEvent(e.target.value)}
        className="bg-white/10 p-3 rounded-xl border border-white/20 w-full md:w-1/3"
      >
        {events.map((e) => (
          <option key={e.id} value={e.id}>
            {e.title}
          </option>
        ))}
      </select>

      {/* SUCCESS POPUP */}
      {scanSuccess && (
        <div className="bg-green-500/20 text-green-300 p-3 rounded-xl">
          {scanSuccess}
        </div>
      )}

      {/* QR SCANNER */}
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
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="border-b border-white/10">
                <th>Name</th>
                <th>Email</th>
                <th>Course</th>
                <th>Year</th>
                {[1, 2, 3].map((d) => (
                  <th key={d}>Day {d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {registrations.map((r) => (
                <tr key={r.id} className="border-b border-white/5">
                  <td>{r.name}</td>
                  <td>{r.email}</td>
                  <td>{r.course}</td>
                  <td>{r.year}</td>
                  {[1, 2, 3].map((d) => (
                    <td key={d}>
                      <input
                        type="checkbox"
                        checked={attendance?.[r.id]?.[d] || false}
                        onChange={() => toggleAttendance(r.id, d)}
                      />
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
