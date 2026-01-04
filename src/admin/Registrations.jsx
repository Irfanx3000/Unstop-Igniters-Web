// import React, { useEffect, useState } from "react";
// import { supabase } from "../supabase/client";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import QRScanner from "../components/QRScanner";

// /* =========================================================
//    REGISTRATIONS ADMIN SCREEN (UI IMPROVED)
// ========================================================= */

// const Registrations = () => {
//   const [events, setEvents] = useState([]);
//   const [selectedEvent, setSelectedEvent] = useState("");
//   const [registrations, setRegistrations] = useState([]);
//   const [attendance, setAttendance] = useState({});
//   const [scannerOpen, setScannerOpen] = useState(false);
//   const [scanDay, setScanDay] = useState(1);
//   const [scanSuccess, setScanSuccess] = useState(null);
//   const [loading, setLoading] = useState(false);

//   /* ================= FETCH EVENTS ================= */
//   useEffect(() => {
//     fetchEvents();
//   }, []);

//   const fetchEvents = async () => {
//     const { data } = await supabase
//       .from("events")
//       .select("id, title")
//       .eq("event_type", "igniters")
//       .order("event_date", { ascending: true });

//     if (data?.length) {
//       setEvents(data);
//       setSelectedEvent(data[0].id);
//     }
//   };

//   /* ================= FETCH REGISTRATIONS ================= */
//   useEffect(() => {
//     if (selectedEvent) fetchRegistrations();
//   }, [selectedEvent]);

//   const fetchRegistrations = async () => {
//     setLoading(true);

//     const { data: regs } = await supabase
//       .from("igniters_registrations")
//       .select("*")
//       .eq("event_id", selectedEvent)
//       .order("registered_at", { ascending: true });

//     const { data: att } = await supabase
//       .from("event_attendance")
//       .select("*")
//       .eq("event_id", selectedEvent);

//     const attMap = {};
//     att?.forEach((a) => {
//       if (!attMap[a.registration_id]) attMap[a.registration_id] = {};
//       attMap[a.registration_id][a.day] = a.status;
//     });

//     setRegistrations(regs || []);
//     setAttendance(attMap);
//     setLoading(false);
//   };

//   /* ================= MANUAL TOGGLE ================= */
//   const toggleAttendance = async (registrationId, day) => {
//     const current = attendance?.[registrationId]?.[day];

//     await supabase
//       .from("event_attendance")
//       .upsert(
//         {
//           registration_id: registrationId,
//           event_id: selectedEvent,
//           day,
//           status: !current,
//           scanned_at: new Date().toISOString(),
//         },
//         { onConflict: "registration_id,event_id,day" }
//       );

//     fetchRegistrations();
//   };

//   /* ================= QR SCAN ================= */
//   const handleQRScan = async (decodedText) => {
//     try {
//       const { registration_id, event_id } = JSON.parse(decodedText);

//       if (event_id !== selectedEvent) {
//         alert("QR does not belong to this event");
//         return;
//       }

//       await supabase
//         .from("event_attendance")
//         .upsert(
//           {
//             registration_id,
//             event_id,
//             day: scanDay,
//             status: true,
//             scanned_at: new Date().toISOString(),
//           },
//           { onConflict: "registration_id,event_id,day" }
//         );

//       setScanSuccess("✅ Attendance marked successfully");
//       setScannerOpen(false);
//       fetchRegistrations();

//       setTimeout(() => setScanSuccess(null), 2000);
//     } catch {
//       alert("Invalid QR Code");
//     }
//   };

//   /* ================= EXPORT ================= */
//   const exportToExcel = () => {
//     const rows = registrations.map((r) => ({
//       Name: r.name,
//       Email: r.email,
//       Course: r.course,
//       Year: r.year,
//       Day1: attendance?.[r.registration_id]?.[1] ? "Present" : "Absent",
//       Day2: attendance?.[r.registration_id]?.[2] ? "Present" : "Absent",
//       Day3: attendance?.[r.registration_id]?.[3] ? "Present" : "Absent",
//     }));

//     const ws = XLSX.utils.json_to_sheet(rows);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Registrations");

//     const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//     saveAs(new Blob([buffer]), "event-registrations.xlsx");
//   };

//   /* ================= UI ================= */
//   return (
//     <div className="space-y-6 p-6">
//       {/* HEADER */}
//       <div className="flex flex-wrap justify-between items-center gap-4">
//         <h2 className="text-4xl font-black text-hot-pink">
//           Event Registrations
//         </h2>

//         <div className="flex gap-3">
//           <button onClick={exportToExcel} className="gradient-btn">
//             Export Excel
//           </button>

//           <button
//             onClick={() => setScannerOpen(true)}
//             className="border border-white/30 px-4 py-2 rounded-xl hover:bg-white/10"
//           >
//             Open QR Scanner
//           </button>
//         </div>
//       </div>

//       {/* CONTROLS */}
//       <div className="flex flex-wrap gap-4">
//         <select
//           value={selectedEvent}
//           onChange={(e) => setSelectedEvent(e.target.value)}
//           className="bg-white/10 p-3 rounded-xl border border-white/20"
//         >
//           {events.map((e) => (
//             <option key={e.id} value={e.id}>
//               {e.title}
//             </option>
//           ))}
//         </select>

//         <select
//           value={scanDay}
//           onChange={(e) => setScanDay(Number(e.target.value))}
//           className="bg-white/10 p-3 rounded-xl border border-white/20"
//         >
//           <option value={1}>Day 1</option>
//           <option value={2}>Day 2</option>
//           <option value={3}>Day 3</option>
//         </select>
//       </div>

//       {/* SUCCESS */}
//       {scanSuccess && (
//         <div className="bg-green-500/20 text-green-300 p-3 rounded-xl">
//           {scanSuccess}
//         </div>
//       )}

//       {/* QR */}
//       {scannerOpen && (
//         <QRScanner
//           onScan={handleQRScan}
//           onClose={() => setScannerOpen(false)}
//         />
//       )}

//       {/* TABLE */}
//       <div className="glass-card p-6 overflow-x-auto">
//         {loading ? (
//           <p className="text-gray-400">Loading registrations...</p>
//         ) : registrations.length === 0 ? (
//           <p className="text-gray-400">No registrations found.</p>
//         ) : (
//           <table className="w-full min-w-[900px] border-separate border-spacing-y-2">
//             <thead>
//               <tr className="text-gray-300">
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Course</th>
//                 <th>Year</th>
//                 {[1, 2, 3].map((d) => (
//                   <th key={d} className="text-center">
//                     Day {d}
//                   </th>
//                 ))}
//               </tr>
//             </thead>

//             <tbody>
//               {registrations.map((r) => (
//                 <tr
//                   key={r.id}
//                   className="bg-white/5 hover:bg-white/10 transition rounded-xl"
//                 >
//                   <td>{r.name}</td>
//                   <td>{r.email}</td>
//                   <td>{r.course}</td>
//                   <td>{r.year}</td>

//                   {[1, 2, 3].map((d) => (
//                     <td key={d} className="text-center">
//                       <button
//                         onClick={() =>
//                           toggleAttendance(r.registration_id, d)
//                         }
//                         className={`
//                           w-9 h-9 rounded-full font-bold transition
//                           ${
//                             attendance?.[r.registration_id]?.[d] === true
//                               ? "bg-green-500 text-black"
//                               : attendance?.[r.registration_id]?.[d] === false
//                               ? "bg-red-500 text-white"
//                               : "bg-gray-700 text-gray-300"
//                           }
//                         `}
//                       >
//                         {attendance?.[r.registration_id]?.[d] === true
//                           ? "✓"
//                           : attendance?.[r.registration_id]?.[d] === false
//                           ? "✕"
//                           : "–"}
//                       </button>
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Registrations;
import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabase/client";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import QRScanner from "../components/QRScanner";

/* =========================================================
   REGISTRATIONS – FINAL WITH RESET (NEUTRAL) OPTION
========================================================= */

const Registrations = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [history, setHistory] = useState({});
  const [scanDay, setScanDay] = useState(1);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [attendanceFeedback, setAttendanceFeedback] = useState(null);

  /* ================= FETCH EVENTS ================= */
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data } = await supabase
      .from("events")
      .select("id, title")
      .eq("event_type", "igniters")
      .order("event_date");

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
      .order("registered_at");

    const { data: att } = await supabase
      .from("event_attendance")
      .select("*")
      .eq("event_id", selectedEvent);

    const attMap = {};
    const histMap = {};

    att?.forEach((a) => {
      if (!attMap[a.registration_id]) attMap[a.registration_id] = {};
      attMap[a.registration_id][a.day] = a.status;

      if (!histMap[a.registration_id]) histMap[a.registration_id] = [];
      histMap[a.registration_id].push(a);
    });

    setRegistrations(regs || []);
    setAttendance(attMap);
    setHistory(histMap);
    setLoading(false);
  };

  /* ================= AUTO DISMISS FEEDBACK ================= */
  useEffect(() => {
    if (!attendanceFeedback) return;
    const t = setTimeout(() => setAttendanceFeedback(null), 2500);
    return () => clearTimeout(t);
  }, [attendanceFeedback]);

  /* ================= MARK ATTENDANCE ================= */
  const markAttendance = async (registrationId, day, status) => {
    const existing = attendance?.[registrationId]?.[day];

    if (existing === status) {
      setAttendanceFeedback({
        type: "warning",
        name: "Already Marked",
        message: `Attendance already marked for Day ${day}`,
      });
      return;
    }

    await supabase.from("event_attendance").upsert(
      {
        registration_id: registrationId,
        event_id: selectedEvent,
        day,
        status,
        scanned_at: new Date().toISOString(),
      },
      { onConflict: "registration_id,event_id,day" }
    );

    const student = registrations.find(
      (r) => r.registration_id === registrationId
    );

    setAttendanceFeedback({
      type: "success",
      name: student?.name || "Student",
      message: `Marked ${status ? "Present" : "Absent"} for Day ${day}`,
    });

    fetchRegistrations();
  };

  /* ================= RESET TO NEUTRAL ================= */
  const resetAttendance = async (registrationId, day) => {
    await supabase
      .from("event_attendance")
      .delete()
      .eq("registration_id", registrationId)
      .eq("event_id", selectedEvent)
      .eq("day", day);

    const student = registrations.find(
      (r) => r.registration_id === registrationId
    );

    setAttendanceFeedback({
      type: "warning",
      name: student?.name || "Student",
      message: `Attendance reset to pending for Day ${day}`,
    });

    fetchRegistrations();
  };

  /* ================= QR SCAN ================= */
  const handleQRScan = async (decodedText) => {
    try {
      const { registration_id, event_id } = JSON.parse(decodedText);

      if (event_id !== selectedEvent) {
        setAttendanceFeedback({
          type: "warning",
          name: "Invalid QR",
          message: "QR does not belong to this event",
        });
        return;
      }

      await markAttendance(registration_id, scanDay, true);
      setScannerOpen(false);
    } catch {
      setAttendanceFeedback({
        type: "warning",
        name: "Invalid QR",
        message: "Unable to read QR code",
      });
    }
  };

  /* ================= FILTER ================= */
  const filteredRegistrations = useMemo(() => {
    if (filter === "all") return registrations;
    return registrations.filter((r) => {
      const s = attendance?.[r.registration_id]?.[scanDay];
      if (filter === "present") return s === true;
      if (filter === "absent") return s === false;
      if (filter === "pending") return s === undefined;
      return true;
    });
  }, [registrations, attendance, filter, scanDay]);

  /* ================= ROW COLOR ================= */
  const rowStyle = (status) => {
    if (status === true) return "bg-green-500/15 border-green-500/30";
    if (status === false) return "bg-red-500/15 border-red-500/30";
    return "bg-white/5 border-white/10";
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-4xl font-black text-hot-pink">
          Event Registrations
        </h2>

        <button
          onClick={() => setScannerOpen(true)}
          className="border border-white/30 px-4 py-2 rounded-xl hover:bg-white/10"
        >
          Open QR Scanner
        </button>
      </div>

      {/* DAY SELECT */}
      <select
        value={scanDay}
        onChange={(e) => setScanDay(Number(e.target.value))}
        className="bg-white/10 p-3 rounded-xl border border-white/20 w-fit"
      >
        <option value={1}>Day 1</option>
        <option value={2}>Day 2</option>
        <option value={3}>Day 3</option>
      </select>

      {/* FILTERS */}
      <div className="flex gap-3">
        {["all", "present", "absent", "pending"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full capitalize text-sm ${
              filter === f
                ? "bg-gradient-to-r from-pink-500 to-orange-400 text-black"
                : "bg-white/10 text-gray-300"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="glass-card p-6 overflow-x-auto">
        {loading ? (
          <p className="text-gray-400">Loading registrations...</p>
        ) : (
          <table className="w-full min-w-[900px] border-separate border-spacing-y-2">
            <thead>
              <tr className="text-gray-300">
                <th>Name</th>
                <th>Email</th>
                <th>Course</th>
                <th>Year</th>
                <th className="text-center">Day {scanDay}</th>
              </tr>
            </thead>

            <tbody>
              {filteredRegistrations.map((r) => {
                const s = attendance?.[r.registration_id]?.[scanDay];
                return (
                  <tr
                    key={r.id}
                    onClick={() => setSelectedStudent(r)}
                    className={`cursor-pointer border transition ${rowStyle(s)}`}
                  >
                    <td className="font-semibold">{r.name}</td>
                    <td>{r.email}</td>
                    <td>{r.course}</td>
                    <td>{r.year}</td>
                    <td className="text-center font-bold">
                      {s === true
                        ? "Present"
                        : s === false
                        ? "Absent"
                        : "Pending"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* STUDENT CARD */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-end">
          <div className="w-full sm:w-[420px] bg-[#0b0b0b] p-6 rounded-l-2xl">
            <h3 className="text-xl font-bold">{selectedStudent.name}</h3>
            <p className="text-sm text-gray-400">{selectedStudent.email}</p>

            <div className="mt-4 space-y-2 text-sm">
              <p>Course: {selectedStudent.course}</p>
              <p>Year: {selectedStudent.year}</p>
              <p>Day: {scanDay}</p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() =>
                  markAttendance(selectedStudent.registration_id, scanDay, true)
                }
                className="flex-1 py-2 bg-green-500 text-black rounded-lg"
              >
                Present
              </button>

              <button
                onClick={() =>
                  markAttendance(
                    selectedStudent.registration_id,
                    scanDay,
                    false
                  )
                }
                className="flex-1 py-2 bg-red-500 text-white rounded-lg"
              >
                Absent
              </button>

              <button
                onClick={() =>
                  resetAttendance(selectedStudent.registration_id, scanDay)
                }
                className="flex-1 py-2 bg-gray-600 text-white rounded-lg"
              >
                Neutral
              </button>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">
                Attendance History
              </h4>
              {history?.[selectedStudent.registration_id]?.map((h, i) => (
                <p key={i} className="text-xs text-gray-400">
                  Day {h.day}: {h.status ? "Present" : "Absent"}
                </p>
              ))}
            </div>

            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* FEEDBACK CARD */}
      {attendanceFeedback && (
        <div className="fixed bottom-6 right-6 z-50">
          <div
            className={`p-4 rounded-xl border ${
              attendanceFeedback.type === "success"
                ? "bg-green-500/20 border-green-500/40 text-green-300"
                : "bg-yellow-500/20 border-yellow-500/40 text-yellow-300"
            }`}
          >
            <p className="font-semibold">{attendanceFeedback.name}</p>
            <p className="text-sm">{attendanceFeedback.message}</p>
          </div>
        </div>
      )}

      {/* QR SCANNER */}
      {scannerOpen && (
        <QRScanner
          onScan={handleQRScan}
          onClose={() => setScannerOpen(false)}
        />
      )}
    </div>
  );
};

export default Registrations;
