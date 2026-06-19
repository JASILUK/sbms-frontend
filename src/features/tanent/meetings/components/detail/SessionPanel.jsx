import React from "react";
import { motion } from "framer-motion";
import { Radio, Video, Clock, Hash, Play, LogIn, Square, Circle } from "lucide-react";
import { formatRelativeTime } from "../../utils/meetingFormatters";
import { isMeetingLive } from "../../utils/meetingStatus";

const SessionInfoRow = ({ icon: Icon, label, value, highlight = false }) => (
  <div className="flex items-center gap-3 py-2.5">
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${highlight ? "bg-red-50 border border-red-100" : "bg-slate-50 border border-slate-100"}`}>
      <Icon className={`w-4 h-4 ${highlight ? "text-red-500" : "text-slate-400"}`} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-slate-400">{label}</p>
      <p className={`text-sm font-medium truncate ${highlight ? "text-red-700" : "text-slate-700"}`}>{value || "—"}</p>
    </div>
  </div>
);

const SessionPanel = ({ meeting, onStartSession, onJoinSession, onEndSession, canManage }) => {
  if (!meeting) return null;
  const live = isMeetingLive(meeting.status);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Radio className="w-4 h-4 text-slate-400" />Session Status
          </h3>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${live ? "bg-red-100 text-red-700 border border-red-200" : "bg-slate-100 text-slate-600 border border-slate-200"}`}>
            {live ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
                Live
              </>
            ) : (
              <><Circle className="w-2 h-2" />{meeting.status}</>
            )}
          </span>
        </div>
        <div className="px-6 py-3">
          <SessionInfoRow icon={Hash} label="Room ID" value={meeting.public_id} />
          <SessionInfoRow icon={Video} label="Recording" value={meeting.recording_enabled ? "Enabled" : "Disabled"} highlight={meeting.recording_enabled} />
          <SessionInfoRow icon={Clock} label="Started" value={meeting.started_at ? formatRelativeTime(meeting.started_at) : "Not started"} />
          <SessionInfoRow icon={Clock} label="Ended" value={meeting.ended_at ? formatRelativeTime(meeting.ended_at) : "—"} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">Quick Actions</h3>
        </div>
        <div className="px-6 py-4 flex flex-wrap gap-3">
          {canManage && !live && meeting.status !== "completed" && meeting.status !== "cancelled" && (
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onStartSession}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-all">
              <Play className="w-4 h-4" />Start Session
            </motion.button>
          )}
          {live && (
            <>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onJoinSession}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-red-500/20 transition-all">
                <LogIn className="w-4 h-4" />Join Session
              </motion.button>
              {canManage && (
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onEndSession}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-semibold transition-all">
                  <Square className="w-4 h-4" />End Session
                </motion.button>
              )}
            </>
          )}
          {!live && meeting.status === "completed" && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium border border-emerald-200">
              <Circle className="w-4 h-4" />Session completed
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SessionPanel;
