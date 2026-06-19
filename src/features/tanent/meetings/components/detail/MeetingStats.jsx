import React from "react";
import { motion } from "framer-motion";
import { Users, Target, Clock, Video, Shield } from "lucide-react";
import { getDuration } from "../../utils/meetingFormatters";

const StatItem = ({ icon: Icon, label, value, subtext, color = "slate", delay = 0 }) => {
  const dotColors = {
    slate: "bg-slate-400",
    blue: "bg-blue-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    red: "bg-red-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.25 }}
      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50/80 transition-colors cursor-default group"
    >
      <div className="relative">
        <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
        <span className={`absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full ${dotColors[color]} ring-2 ring-white`} />
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-sm font-semibold text-slate-900 tabular-nums">{value}</span>
        <span className="text-[11px] text-slate-500">{label}</span>
      </div>
      {subtext && (
        <span className="text-[10px] text-slate-400 hidden sm:inline">· {subtext}</span>
      )}
    </motion.div>
  );
};

const MeetingStats = ({ meeting }) => {
  if (!meeting) return null;

  const participants = meeting.participants?.length || 0;
  const targets = meeting.targets?.length || 0;
  const duration = getDuration(meeting.scheduled_start, meeting.scheduled_end);

  return (
    <div className="flex flex-wrap items-center gap-1 py-1.5 -mx-1">
      <StatItem
        icon={Users}
        label="Participants"
        value={participants}
        subtext={`max ${meeting.max_participants || 100}`}
        color="blue"
        delay={0.05}
      />
      <div className="hidden sm:block w-px h-4 bg-slate-200 mx-1" />
      <StatItem
        icon={Target}
        label="Targets"
        value={targets}
        color="emerald"
        delay={0.1}
      />
      <div className="hidden sm:block w-px h-4 bg-slate-200 mx-1" />
      <StatItem
        icon={Clock}
        label="Duration"
        value={duration || "—"}
        color="amber"
        delay={0.15}
      />
      <div className="hidden sm:block w-px h-4 bg-slate-200 mx-1" />
      <StatItem
        icon={Video}
        label="Recording"
        value={meeting.recording_enabled ? "On" : "Off"}
        subtext={meeting.recording_enabled ? "Auto" : null}
        color={meeting.recording_enabled ? "emerald" : "slate"}
        delay={0.2}
      />
      <div className="hidden sm:block w-px h-4 bg-slate-200 mx-1" />
      <StatItem
        icon={Shield}
        label="Waiting Room"
        value={meeting.waiting_room_enabled ? "On" : "Off"}
        color={meeting.waiting_room_enabled ? "amber" : "slate"}
        delay={0.25}
      />
    </div>
  );
};

export default MeetingStats;