import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  ChartBarIcon,
  UsersIcon,
  ShieldCheckIcon,
  CalendarDaysIcon,
  Bars3Icon,
  XMarkIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

import Analytics from "./Analytics";
import EventManagement from "./EventManagement";
import TeamManagement from "./TeamManagement";
import AdminManagement from "./AdminManagement";
import Registrations from "./Registrations";

const AdminDashboard = ({ onViewUserWebsite }) => {
  const [activeTab, setActiveTab] = useState("analytics");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, userProfile, signOut } = useAuth();

  const tabs = [
    { id: "analytics", name: "Analytics", icon: ChartBarIcon },
    { id: "events", name: "Events", icon: CalendarDaysIcon },
    { id: "registrations", name: "Registrations", icon: ClipboardDocumentListIcon },
    { id: "team", name: "Team", icon: UsersIcon },
    { id: "admins", name: "Admins", icon: ShieldCheckIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "analytics":
        return <Analytics />;
      case "events":
        return <EventManagement />;
      case "registrations":
        return <Registrations />;
      case "team":
        return <TeamManagement />;
      case "admins":
        return <AdminManagement />;
      default:
        return <Analytics />;
    }
  };

  return (
    <div className="h-screen bg-black text-white flex overflow-hidden">

      {/* ================= MOBILE TOP BAR ================= */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-black/80 backdrop-blur border-b border-white/10">
        <button onClick={() => setMobileMenuOpen(true)}>
          <Bars3Icon className="w-7 h-7 text-white" />
        </button>
        <h1 className="font-bold text-lg">Admin Dashboard</h1>
      </div>

      {/* ================= SIDEBAR (DESKTOP) ================= */}
      <aside className="hidden md:flex w-64 flex-col p-6 bg-white/10 backdrop-blur-xl border-r border-white/10">
        <SidebarContent
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          signOut={signOut}
          onViewUserWebsite={onViewUserWebsite}
          userProfile={userProfile}
          user={user}
        />
      </aside>

      {/* ================= MOBILE DRAWER ================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur"
          >
            <div className="w-72 h-full bg-[#0b0b0b] p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-xl">Menu</h2>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <SidebarContent
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={(id) => {
                  setActiveTab(id);
                  setMobileMenuOpen(false);
                }}
                signOut={signOut}
                onViewUserWebsite={onViewUserWebsite}
                userProfile={userProfile}
                user={user}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= CONTENT ================= */}
      <main className="flex-1 overflow-y-auto pt-16 md:pt-0 p-4 md:p-8">
        {renderContent()}
      </main>
    </div>
  );
};

/* ================= SIDEBAR CONTENT ================= */

const SidebarContent = ({
  tabs,
  activeTab,
  setActiveTab,
  signOut,
  onViewUserWebsite,
  userProfile,
  user,
}) => (
  <>
    <h1 className="text-2xl font-extrabold mb-1">Admin Dashboard</h1>
    <p className="text-sm text-gray-400 mb-8">
      {userProfile?.name || user?.email}
    </p>

    <div className="space-y-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${
            activeTab === tab.id
              ? "bg-gradient-to-r from-hot-pink to-orange-400 text-white"
              : "text-gray-300 hover:bg-white/10"
          }`}
        >
          <tab.icon className="w-5 h-5" />
          {tab.name}
        </button>
      ))}
    </div>

    <div className="mt-auto space-y-3 pt-6">
      <button
        onClick={signOut}
        className="w-full py-2 bg-red-500 rounded-xl"
      >
        Sign Out
      </button>

      <button
        onClick={onViewUserWebsite}
        className="w-full py-2 bg-white/20 rounded-xl"
      >
        View User Site
      </button>
    </div>
  </>
);

export default AdminDashboard;
