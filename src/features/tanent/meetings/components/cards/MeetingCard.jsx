import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Users, Clock, Calendar, ArrowUpRight, Globe, Lock, Building2 } from "lucide-react";
import MeetingStatusBadge from "../MeetingStatusBadge";
import { formatMeetingTime, formatMeetingDate } from "../../utils/meetingUtils";
import { MEETING_VISIBILITY } from "../../constants/meetingConstants";

const visibilityIcons = {
  [MEETING_VISIBILITY.PUBLIC]: Globe,
  [MEETING_VISIBILITY.PRIVATE]: Lock,
  [MEETING_VISIBILITY.TENANT_ONLY]: Building2,
};

const MeetingCard = ({ meeting, index = 0, compact = false }) => {
  const navigate = useNavigate();
  const VisibilityIcon = visibilityIcons[meeting.visibility] || Globe;

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ scale: 1.01 }}
        onClick={() => navigate(`/app/meetings/${meeting.public_id}`)}
        className="
          group cursor-pointer
          bg-white rounded-lg border border-slate-100
          hover:border-slate-200 hover:shadow-sm
          transition-all duration-200
          p-3 mb-2
        "
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-slate-900 truncate">
              {meeting.title}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <MeetingStatusBadge status={meeting.status} />
              <span className="text-xs text-slate-400">
                {formatMeetingTime(meeting.scheduled_start, meeting.timezone)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500 ml-2">
            <Users className="w-3 h-3" />
            <span>{meeting.participant_count}</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -2, boxShadow: "0 4px 20px -4px rgba(0,0,0,0.08)" }}
      onClick={() => navigate(`/app/meetings/${meeting.public_id}`)}
      className="
        group cursor-pointer
        bg-white rounded-xl border border-slate-100
        hover:border-slate-200
        transition-all duration-200
        p-5
      "
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <MeetingStatusBadge status={meeting.status} />
            <span className="text-xs text-slate-400 capitalize">
              {meeting.category?.replace("_", " ")}
            </span>
          </div>
          <h3 className="text-base font-semibold text-slate-900 truncate pr-4 group-hover:text-indigo-600 transition-colors">
            {meeting.title}
          </h3>
        </div>
        <div className="flex items-center gap-1 text-slate-400 group-hover:text-indigo-500 transition-colors">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs text-slate-500 mb-3">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{formatMeetingDate(meeting.scheduled_start, meeting.timezone)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{formatMeetingTime(meeting.scheduled_start, meeting.timezone)}</span>
          {meeting.timezone && (
            <span className="text-slate-300">· {meeting.timezone}</span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-slate-400" />
          <span>
            <span className="font-medium text-slate-700">{meeting.participant_count}</span>
            {" / "}
            <span className="text-slate-400">{meeting.target_count}</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <VisibilityIcon className="w-3.5 h-3.5 text-slate-400" />
          <span className="capitalize">{meeting.visibility?.replace("_", " ")}</span>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
        <span className="text-xs text-slate-400">
          by <span className="text-slate-600 font-medium">{meeting.created_by}</span>
        </span>
        {meeting.schedule_type && (
          <span className="text-xs px-2 py-0.5 bg-slate-50 text-slate-500 rounded-md border border-slate-100 capitalize">
            {meeting.schedule_type}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default MeetingCard;
