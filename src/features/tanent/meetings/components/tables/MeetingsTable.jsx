import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Clock, 
  Calendar, 
  ArrowUpRight, 
  Radio, 
  Settings2, 
  RefreshCw 
} from "lucide-react";
import MeetingStatusBadge from "../MeetingStatusBadge";
import EmptyMeetingsState from "../EmptyMeetingsState";
import { formatMeetingTime, formatMeetingDate } from "../../utils/meetingUtils";
import { isMeetingLive } from "../../utils/meetingUtils";
import { useMeetingPermissions } from "../../hooks/useMeetingPermissions";

const MeetingsTable = ({ meetings = [], isLoading = false }) => {
  const navigate = useNavigate();
  const { canUpdate } = useMeetingPermissions();

  if (isLoading) {
    return <MeetingsTableSkeleton />;
  }

  if (meetings.length === 0) {
    return (
      <EmptyMeetingsState
        type="search"
        title="No meetings match your filters"
        description="Try adjusting your search or filter criteria."
      />
    );
  }

  return (
    <div className="space-y-3">
      {meetings.map((meeting, idx) => {
        const isRecurring = meeting.schedule_type === "recurring";
        // Fallback to scheduled_start if next_occurrence isn't resolved yet
        const displayTargetTime = (isRecurring && meeting.next_occurrence) 
          ? meeting.next_occurrence 
          : meeting.scheduled_start;

        return (
          <motion.div
            key={meeting.public_id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03, duration: 0.25 }}
            whileHover={{ y: -1, boxShadow: "0 4px 16px -4px rgba(0,0,0,0.06)" }}
            onClick={() => navigate(`/app/meetings/${meeting.public_id}`)}
            className="
              group cursor-pointer
              bg-white rounded-xl border border-slate-100
              hover:border-slate-200
              transition-all duration-200
              p-4 sm:p-5
            "
          >
            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center gap-4">
              {/* Status */}
              <div className="w-28 shrink-0">
                <MeetingStatusBadge status={meeting.status} />
              </div>

              {/* Title & Category */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                    {meeting.title}
                  </h4>
                  {isRecurring && (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-indigo-50 text-[10px] font-medium text-indigo-600 rounded-md capitalize">
                      <RefreshCw className="w-2.5 h-2.5 animate-spin-slow" />
                      {meeting.recurrence_rule?.frequency || "Recurring"}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-slate-400 capitalize">
                    {meeting.category?.replace("_", " ") || "General"}
                  </span>
                  <span className="text-slate-200">·</span>
                  <span className="text-xs text-slate-400 capitalize">
                    {meeting.visibility?.replace("_", " ") || "Private"}
                  </span>
                  <span className="text-slate-200">·</span>
                  <span className="text-xs text-indigo-400 font-medium capitalize">
                    {meeting.schedule_type}
                  </span>
                </div>
              </div>

              {/* Schedule / Next Occurrence */}
              <div className="w-44 shrink-0 text-xs text-slate-500">
                <div className="flex items-center gap-1 font-medium text-slate-700">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{formatMeetingDate(displayTargetTime, meeting.timezone)}</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5 text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{formatMeetingTime(displayTargetTime, meeting.timezone)}</span>
                  {meeting.timezone && (
                    <span className="text-slate-400 text-[10px] font-mono bg-slate-50 px-1 rounded">
                      {meeting.timezone}
                    </span>
                  )}
                </div>
              </div>

              {/* Participants & Targets */}
              <div className="w-24 shrink-0">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium text-slate-700">{meeting.participant_count || 0}</span>
                  <span className="text-slate-300">/</span>
                  <span className="text-slate-500" title="Target Configuration Count">
                    {meeting.target_count || 0}
                  </span>
                </div>
              </div>

              {/* Created By */}
              <div className="w-28 shrink-0 text-xs text-slate-500 truncate" title={`Created by ${meeting.created_by}`}>
                {meeting.created_by || "System"}
              </div>

              {/* Actions */}
              <div className="w-24 shrink-0 flex items-center justify-end gap-1">
                {isMeetingLive(meeting) && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/app/meetings/${meeting.public_id}`);
                    }}
                    className="
                      px-2.5 py-1.5
                      bg-red-600 hover:bg-red-700 text-white
                      rounded-lg text-xs font-medium
                      transition-colors
                      flex items-center gap-1
                    "
                  >
                    <Radio className="w-3 h-3" />
                    Join
                  </motion.button>
                )}
                {canUpdate && !isMeetingLive(meeting) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/app/meetings/${meeting.public_id}/edit`);
                    }}
                    className="
                      p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50
                      rounded-lg transition-colors
                    "
                  >
                    <Settings2 className="w-4 h-4" />
                  </button>
                )}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/app/meetings/${meeting.public_id}`);
                  }}
                  className="
                    p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50
                    rounded-lg transition-colors
                  "
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="sm:hidden">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <MeetingStatusBadge status={meeting.status} />
                    {isRecurring && (
                      <span className="px-1.5 py-0.5 bg-indigo-50 text-[10px] font-medium text-indigo-600 rounded capitalize">
                        {meeting.recurrence_rule?.frequency}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 mt-1 truncate">
                    {meeting.title}
                  </h4>
                </div>
                {isMeetingLive(meeting) && (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/app/meetings/${meeting.public_id}`);
                    }}
                    className="
                      px-3 py-1.5
                      bg-red-600 text-white
                      rounded-lg text-xs font-medium
                      flex items-center gap-1
                      ml-2
                    "
                  >
                    <Radio className="w-3 h-3" />
                    Join
                  </motion.button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{formatMeetingDate(displayTargetTime, meeting.timezone)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{formatMeetingTime(displayTargetTime, meeting.timezone)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{meeting.participant_count || 0} / {meeting.target_count || 0}</span>
                </div>
                <div className="flex items-center gap-1 min-w-0">
                  <span className="text-slate-400 shrink-0">by</span>
                  <span className="text-slate-700 font-medium truncate">{meeting.created_by || "System"}</span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

const MeetingsTableSkeleton = () => {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-slate-100 p-5 animate-pulse"
        >
          <div className="hidden sm:flex items-center gap-4">
            <div className="w-20 h-6 bg-slate-100 rounded-full" />
            <div className="flex-1">
              <div className="w-48 h-4 bg-slate-100 rounded" />
              <div className="w-24 h-3 bg-slate-100 rounded mt-2" />
            </div>
            <div className="w-32">
              <div className="w-full h-3 bg-slate-100 rounded" />
              <div className="w-20 h-3 bg-slate-100 rounded mt-2" />
            </div>
            <div className="w-16 h-4 bg-slate-100 rounded" />
            <div className="w-20 h-4 bg-slate-100 rounded" />
            <div className="w-16 h-8 bg-slate-100 rounded-lg" />
          </div>
          <div className="sm:hidden">
            <div className="w-16 h-5 bg-slate-100 rounded-full mb-2" />
            <div className="w-full h-4 bg-slate-100 rounded mb-3" />
            <div className="grid grid-cols-2 gap-2">
              <div className="h-3 bg-slate-100 rounded" />
              <div className="h-3 bg-slate-100 rounded" />
              <div className="h-3 bg-slate-100 rounded" />
              <div className="h-3 bg-slate-100 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MeetingsTable;