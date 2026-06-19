import React, { useState } from "react";
import { motion } from "framer-motion";
import { useGetMeetingsQuery } from "../api/meetingsApi";
import { useMeetingFilters } from "../hooks/useMeetingFilters";
import MeetingPageHeader from "../components/MeetingPageHeader";
import LiveMeetingsSection from "../components/sections/LiveMeetingsSection";
import TodayMeetingsSection from "../components/sections/TodayMeetingsSection";
import MeetingFilters from "../components/filters/MeetingFilters";
import MeetingsTable from "../components/tables/MeetingsTable";
import { useNavigate } from "react-router-dom";

const MeetingsDashboardPage = () => {

  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    resetFilters,
    hasActiveFilters,
  } = useMeetingFilters();

  // Pass filters to BACKEND via query params
  const {
    data: meetings = [],
    isLoading,
    isFetching,
    error,
  } = useGetMeetingsQuery({
    search: searchQuery || undefined,
    status: statusFilter || undefined,
    ordering: "-scheduled_start",
  });

  // Pass loaded meetings into filter hook
  const {
    liveMeetings,
    todayMeetings,
    filteredMeetings,
  } = useMeetingFilters(meetings);

  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col bg-slate-50/50 overflow-hidden">
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}

            <MeetingPageHeader
              onCreateClick={() =>
                navigate("/app/meetings/create")
              }
            />
          {/* Two-Column Dashboard Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
          >
            {/* Left: Live Meetings (Larger) */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 h-[420px] flex flex-col overflow-hidden">
                <div className="p-5 pb-0 flex-1 flex flex-col min-h-0">
                  <LiveMeetingsSection meetings={liveMeetings} />
                </div>
              </div>
            </div>

            {/* Right: Today's Meetings (Smaller) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 h-[420px] flex flex-col overflow-hidden">
                <div className="p-5 pb-0 flex-1 flex flex-col min-h-0">
                  <TodayMeetingsSection meetings={todayMeetings} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* All Meetings Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
          >
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              {/* Section Header */}
              <div className="px-6 pt-6 pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">All Meetings</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {filteredMeetings.length} total {filteredMeetings.length === 1 ? "meeting" : "meetings"}
                      {isFetching && !isLoading && (
                        <span className="ml-2 text-indigo-500">· Updating...</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="px-6">
                <MeetingFilters
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  statusFilter={statusFilter}
                  onStatusChange={setStatusFilter}
                  onReset={resetFilters}
                  hasActiveFilters={hasActiveFilters}
                />
              </div>

              {/* Table/List */}
              <div className="px-6 pb-6">
                {error ? (
                  <div className="py-12 text-center">
                    <p className="text-sm text-red-500">Failed to load meetings.</p>
                    <p className="text-xs text-slate-400 mt-1">Check console for details.</p>
                  </div>
                ) : (
                  <MeetingsTable
                    meetings={filteredMeetings}
                    isLoading={isLoading}
                  />
                )}
              </div>
            </div>
          </motion.div>

          {/* Bottom spacer so last item isn't stuck to edge */}
          <div className="h-8" />
        </div>
      </div>
    </div>
  );
};

export default MeetingsDashboardPage;