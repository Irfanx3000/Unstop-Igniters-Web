import React from "react";
import { useRegistrations } from "../hooks/useRegistrations";
import { useEvents } from "../hooks/useEvents";
import { useTeam } from "../hooks/useTeam";
import GlassCard from "../components/GlassCard";

import {
  UserGroupIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  StarIcon
} from "@heroicons/react/24/outline";

const Analytics = () => {
  const { registrations } = useRegistrations();
  const { events } = useEvents();
  const { teamMembers } = useTeam();

  const totalRegistrations = registrations.length;
  const totalEvents = events.length;
  const totalTeamMembers = teamMembers.length;

  const recentRegistrations = registrations.filter((reg) => {
    return new Date(reg.registered_at) >=
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  }).length;

  const registrationsByEvent = events
    .map((event) => ({
      name: event.title,
      registrations: registrations.filter((r) => r.event_id === event.id)
        .length,
    }))
    .filter((item) => item.registrations > 0);

  const teamByRole = teamMembers.reduce((acc, member) => {
    acc[member.role] = (acc[member.role] || 0) + 1;
    return acc;
  }, {});

  return (
    <div
      className="
      space-y-10 
      min-h-screen 
      bg-black 
      relative 
      text-white 
      overflow-hidden
      p-2
    "
    >

      {/** 🌌 STARLIGHT BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,122,0,0.15),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,44,165,0.15),transparent_70%)]"></div>

        {/** Tiny stars */}
        <div className="absolute inset-0 bg-[url('/stars.png')] opacity-40 mix-blend-screen"></div>
      </div>

      <div className="relative z-10 space-y-10">

        <h2 className="text-4xl font-extrabold text-white drop-shadow-lg">
          Analytics Dashboard
        </h2>

        {/* === TOP STAT CARDS === */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Total Registrations */}
          <GlassCard className="p-6 text-center bg-white/10 backdrop-blur-xl border border-white/10 shadow-lg shadow-pink-500/10">
            <ChartBarIcon className="w-10 h-10 mx-auto text-pink-300 mb-3" />
            <div className="text-4xl font-extrabold text-pink-200">
              {totalRegistrations}
            </div>
            <p className="text-gray-300 font-medium">Total Registrations</p>
            <p className="text-sm text-green-400 mt-1">
              +{recentRegistrations} this week
            </p>
          </GlassCard>

          {/* Total Events */}
          <GlassCard className="p-6 text-center bg-white/10 backdrop-blur-xl border border-white/10 shadow-lg shadow-orange-500/10">
            <CalendarDaysIcon className="w-10 h-10 mx-auto text-orange-300 mb-3" />
            <div className="text-4xl font-extrabold text-orange-200">
              {totalEvents}
            </div>
            <p className="text-gray-300 font-medium">Total Events</p>
            <p className="text-sm text-gray-400 mt-1">
              {events.filter((e) => e.event_type === "igniters").length} Igniters
            </p>
          </GlassCard>

          {/* Team Members */}
          <GlassCard className="p-6 text-center bg-white/10 backdrop-blur-xl border border-white/10 shadow-lg shadow-blue-500/10">
            <UserGroupIcon className="w-10 h-10 mx-auto text-blue-300 mb-3" />
            <div className="text-4xl font-extrabold text-blue-200">
              {totalTeamMembers}
            </div>
            <p className="text-gray-300 font-medium">Team Members</p>
            <p className="text-sm text-gray-400 mt-1">
              {teamByRole.core || 0} Core members
            </p>
          </GlassCard>

          {/* Popular Event */}
          <GlassCard className="p-6 text-center bg-white/10 backdrop-blur-xl border border-white/10 shadow-lg shadow-yellow-500/10">
            <StarIcon className="w-10 h-10 mx-auto text-yellow-300 mb-3" />
            <div className="text-4xl font-extrabold text-yellow-200">
              {registrationsByEvent.length
                ? Math.max(...registrationsByEvent.map((r) => r.registrations))
                : 0}
            </div>
            <p className="text-gray-300 font-medium">Most Popular Event</p>
            <p className="text-sm text-gray-400 mt-1">
              {registrationsByEvent[0]?.name || "No data"}
            </p>
          </GlassCard>
        </div>

        {/** RECENT + EVENT STATS */}
        <div className="grid lg:grid-cols-2 gap-8">

          {/** RECENT REGISTRATIONS */}
          <GlassCard className="p-6 bg-white/10 backdrop-blur-xl border border-white/10 shadow-xl shadow-purple-500/10">
            <h3 className="text-2xl font-semibold text-white mb-4">
              Recent Registrations
            </h3>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {registrations.length ? (
                registrations.slice(0, 10).map((r) => (
                  <div
                    key={r.id}
                    className="p-4 bg-white/10 rounded-xl text-white backdrop-blur-md hover:bg-white/20 transition"
                  >
                    <p className="font-semibold">{r.name}</p>
                    <p className="text-sm text-gray-300">{r.email}</p>
                    <p className="text-xs text-gray-400">{r.course}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-10">No registrations yet</p>
              )}
            </div>
          </GlassCard>

          {/** EVENT STATS */}
          <GlassCard className="p-6 bg-white/10 backdrop-blur-xl border border-white/10 shadow-xl shadow-blue-500/10">
            <h3 className="text-2xl font-semibold text-white mb-4">
              Registrations by Event
            </h3>

            {registrationsByEvent.length ? (
              <div className="space-y-4">

                {registrationsByEvent.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">{item.name}</span>
                      <span className="font-bold text-hot-pink">
                        {item.registrations}
                      </span>
                    </div>

                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-pink-400 to-orange-400"
                        style={{
                          width: `${
                            (item.registrations /
                              Math.max(
                                ...registrationsByEvent.map((r) => r.registrations)
                              )) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-10">
                No registration data available
              </p>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
