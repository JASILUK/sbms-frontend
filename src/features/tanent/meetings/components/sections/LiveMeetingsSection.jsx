import React from "react";
import { motion } from "framer-motion";
import { Radio } from "lucide-react";
import LiveMeetingCard from "../cards/LiveMeetingCard";
import EmptyMeetingsState from "../EmptyMeetingsState";

const LiveMeetingsSection = ({ meetings = [] }) => {
  return (
    <div className="flex flex-col h-full">
      {/* Section Header */}
      <div className="flex items-center gap-2 px-1 mb-4">
        <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center">
          <Radio className="w-4 h-4 text-red-500" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Live Now</h2>
          <p className="text-xs text-slate-500">
            {meetings.length} ongoing {meetings.length === 1 ? "meeting" : "meetings"}
          </p>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pr-1 -mr-1 min-h-0">
        {meetings.length === 0 ? (
          <EmptyMeetingsState
            type="live"
            title="No live meetings"
            description="When a meeting starts, it will appear here."
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {meetings.map((meeting, idx) => (
              <LiveMeetingCard
                key={meeting.public_id}
                meeting={meeting}
                index={idx}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LiveMeetingsSection;
