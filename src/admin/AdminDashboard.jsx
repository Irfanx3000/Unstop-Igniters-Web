import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

import {
  ChartBarIcon,
  UsersIcon,
  ShieldCheckIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

import Analytics from "./Analytics";
import EventManagement from "./EventManagement";
import TeamManagement from "./TeamManagement";
import AdminManagement from "./AdminManagement";

const AdminDashboard = ({ onViewUserWebsite }) => {
  const [activeTab, setActiveTab] = useState("analytics");
  const { user, userProfile, signOut } = useAuth();

  const tabs = [
    { id: "analytics", name: "Analytics", icon: ChartBarIcon },
    { id: "events", name: "Events", icon: CalendarDaysIcon },
    { id: "team", name: "Team", icon: UsersIcon },
    { id: "admins", name: "Admins", icon: ShieldCheckIcon },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch {
      alert("Sign-out failed.");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "analytics":
        return <Analytics />;
      case "events":
        return <EventManagement />;
      case "team":
        return <TeamManagement />;
      case "admins":
        return <AdminManagement />;
      default:
        return <Analytics />;
    }
  };

  return (
    <div className="min-h-screen relative flex">

      {/* ⭐ Background (same as login) */}
      <div className="absolute inset-0 bg-black"></div>

      {/* 🌌 Nebula glows */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-pink-500/20 blur-[180px]"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-orange-500/20 blur-[180px]"></div>

      {/* Slight dark overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

      {/* MAIN LAYOUT (unchanged) */}
      <div className="relative z-10 flex w-full">

        {/* SIDEBAR — EXACT SAME STRUCTURE */}
        <motion.nav
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-64 min-h-screen p-6 border-r border-white/10 
                     bg-white/10 backdrop-blur-xl shadow-xl"
        >
          <h1 className="text-2xl font-extrabold text-white mb-1">
            Admin Dashboard
          </h1>

          <p className="text-gray-300 text-sm mb-8">
            Welcome, {userProfile?.name || user?.email}
          </p>

          <div className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all
                  ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-hot-pink to-orange-400 text-white shadow-lg"
                      : "text-gray-300 hover:bg-white/10"
                  }`}
              >
                <tab.icon className="w-6 h-6" />
                <span className="font-semibold">{tab.name}</span>
              </button>
            ))}
          </div>

          <div className="mt-10 space-y-3">
            <button
              onClick={handleSignOut}
              className="w-full py-2 bg-red-500/80 text-white rounded-xl hover:bg-red-600"
            >
              Sign Out
            </button>
            <button
              onClick={onViewUserWebsite}
              className="w-full py-2 bg-white/20 text-white rounded-xl hover:bg-white/30"
            >
              View User Site
            </button>
          </div>
        </motion.nav>

        {/* MAIN CONTENT — SAME STRUCTURE */}
        <motion.main
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 p-8 text-white"
        >
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </motion.main>

      </div>
    </div>
  );
};

export default AdminDashboard;
