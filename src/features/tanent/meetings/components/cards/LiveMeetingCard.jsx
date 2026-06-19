import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Users, Clock, ArrowRight, Radio } from "lucide-react";
import MeetingStatusBadge from "../MeetingStatusBadge";
import { formatMeetingTime, formatRelativeTime } from "../../utils/meetingUtils";
import { MEETING_STATUS } from "../../constants/meetingConstants";

const LiveMeetingCard = ({ meeting, index = 0 }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.35 }}
      whileHover={{ scale: 1.01, y: -2 }}
      onClick={() => navigate(`/app/meetings/${meeting.public_id}`)}
      className="
        group relative cursor-pointer
        bg-white rounded-xl border border-red-100
        shadow-sm hover:shadow-md hover:border-red-200
        transition-all duration-200
        p-4 mb-3
        overflow-hidden
      "
    >
      {/* Live gradient accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-400 to-red-600 rounded-l-xl" />

      <div className="pl-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-slate-900 truncate pr-2">
              {meeting.title}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <MeetingStatusBadge status={MEETING_STATUS.LIVE} />
              <span className="text-xs text-slate-500">
                {formatRelativeTime(meeting.scheduled_start)}
              </span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/app/meetings/${meeting.public_id}`);
            }}
            className="
              flex items-center gap-1.5 px-3 py-1.5
              bg-red-600 hover:bg-red-700 text-white
              rounded-lg text-xs font-medium
              transition-colors
              shadow-sm shadow-red-200
            "
          >
            <Radio className="w-3 h-3" />
            Join
          </motion.button>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium text-slate-700">
              {meeting.participant_count}
            </span>
            <span>participants</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatMeetingTime(meeting.scheduled_start, meeting.timezone)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LiveMeetingCard;
