import React from "react";
import { useAuth } from "../context/AuthContext";

const DebugInfo = () => {
  const { user, isAdmin, loading } = useAuth();

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900/90 text-white p-4 rounded-lg shadow-lg text-xs z-50 space-y-1 border border-gray-700">
      <div>
        <span className="font-semibold text-gray-300">User:</span>{" "}
        {user ? user.email : "None"}
      </div>

      <div>
        <span className="font-semibold text-gray-300">Admin:</span>{" "}
        <span className={`px-2 py-0.5 rounded text-[10px] ${
          isAdmin ? "bg-green-600" : "bg-red-600"
        }`}>
          {isAdmin ? "YES" : "NO"}
        </span>
      </div>

      <div>
        <span className="font-semibold text-gray-300">Loading:</span>{" "}
        <span className={`px-2 py-0.5 rounded text-[10px] ${
          loading ? "bg-yellow-600" : "bg-green-700"
        }`}>
          {loading ? "LOADING" : "DONE"}
        </span>
      </div>
    </div>
  );
};

export default DebugInfo;
