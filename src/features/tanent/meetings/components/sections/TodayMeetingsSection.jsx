import React from "react";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import MeetingCard from "../cards/MeetingCard";
import EmptyMeetingsState from "../EmptyMeetingsState";

const TodayMeetingsSection = ({ meetings = [] }) => {
  return (
    <div className="flex flex-col h-full">
      {/* Section Header */}
      <div className="flex items-center gap-2 px-1 mb-4">
        <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
          <CalendarDays className="w-4 h-4 text-blue-500" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Today</h2>
          <p className="text-xs text-slate-500">
            {meetings.length} scheduled {meetings.length === 1 ? "meeting" : "meetings"}
          </p>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pr-1 -mr-1 min-h-0">
        {meetings.length === 0 ? (
          <EmptyMeetingsState
            type="today"
            title="Nothing scheduled"
            description="Your calendar is clear for today."
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {meetings.map((meeting, idx) => (
              <MeetingCard
                key={meeting.public_id}
                meeting={meeting}
                index={idx}
                compact
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TodayMeetingsSection;
