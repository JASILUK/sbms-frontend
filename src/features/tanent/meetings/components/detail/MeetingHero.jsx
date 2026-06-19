import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Globe,
  Lock,
  Building2,
  User,
  Tag,
  Radio,
  Pencil,
  XCircle,
  Play,
  Bell,
} from "lucide-react";
import { MEETING_STATUS_CONFIG } from "../../utils/meetingStatus";
import { formatDateTime, getDuration } from "../../utils/meetingFormatters";

const visibilityIcons = {
  public: Globe,
  private: Lock,
  tenant_only: Building2,
  targeted: Tag,
};

const MeetingHero = ({
  meeting,
  permissions,
  onStartSession,
  onJoinSession,
  onEdit,
  onCancel,
}) => {
  const navigate = useNavigate();

  if (!meeting) return null;

  const statusConfig = MEETING_STATUS_CONFIG[meeting.status] || MEETING_STATUS_CONFIG.scheduled;
  const VisibilityIcon = visibilityIcons[meeting.visibility] || Globe;
  const isLive = meeting.status === "live";

  const showStart = permissions.canStart && !isLive;
  const showJoin = permissions.canJoin && isLive;
  const showEdit = permissions.canEdit && !isLive;
  const showCancel = permissions.canCancel && !isLive;

  const totalReminders = Array.isArray(meeting.reminder_minutes) ? meeting.reminder_minutes.length : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="py-3"
    >
      {/* Top row: Back + Actions */}
      <div className="flex items-center justify-between mb-2.5">
        <button
          onClick={() => navigate("/app/meetings")}
          className="group flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-0.5" />
          Meetings
        </button>

        {/* Compact action chips */}
        <div className="flex items-center gap-1.5">
          {showStart && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onStartSession}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm shadow-indigo-500/15 transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Start
            </motion.button>
          )}

          {showJoin && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onJoinSession}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-sm shadow-red-500/15 transition-colors"
            >
              <Radio className="w-3.5 h-3.5" />
              Join
            </motion.button>
          )}

          {showEdit && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onEdit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </motion.button>
          )}

          {showCancel && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCancel}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-medium transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
              Cancel
            </motion.button>
          )}
        </div>
      </div>

      {/* Main content: Title + Meta */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2.5">
        {/* Left: Title + Badges */}
        <div className="min-w-0 flex-1">
          {/* Status rail */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold border ${statusConfig.badge}`}
            >
              {statusConfig.pulse ? (
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
                </span>
              ) : (
                <span className={`h-1 w-1 rounded-full ${statusConfig.dot}`} />
              )}
              {statusConfig.label}
            </span>

            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium border border-slate-200/80 capitalize">
              {meeting.category?.replace("_", " ")}
            </span>

            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium border border-slate-200/80">
              <VisibilityIcon className="w-2.5 h-2.5" />
              {meeting.visibility?.replace("_", " ")}
            </span>

            <span className="px-1.5 py-0.5 bg-indigo-50/80 text-indigo-700 rounded text-[10px] font-medium border border-indigo-100/80 capitalize">
              {meeting.schedule_type}
            </span>

            {totalReminders > 0 && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded text-[10px] font-medium border border-amber-200/60">
                <Bell className="w-2.5 h-2.5" />
                {totalReminders} {totalReminders === 1 ? "Reminder" : "Reminders"}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight truncate">
            {meeting.title}
          </h1>

          {/* Description — truncated, expandable via title attr */}
          {meeting.description && (
            <p
              className="text-xs text-slate-500 mt-0.5 truncate max-w-2xl"
              title={meeting.description}
            >
              {meeting.description}
            </p>
          )}
        </div>

        {/* Right: Metadata rail */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span className="font-medium text-slate-700">
              {formatDateTime(meeting.scheduled_start, meeting.timezone)}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{getDuration(meeting.scheduled_start, meeting.scheduled_end)}</span>
          </div>

          <div className="flex items-center gap-1">
            <Globe className="w-3 h-3 text-slate-400" />
            <span>{meeting.timezone || "UTC"}</span>
          </div>

          <div className="flex items-center gap-1">
            <User className="w-3 h-3 text-slate-400" />
            <span>
              by <span className="font-medium text-slate-700">{meeting.created_by}</span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MeetingHero;