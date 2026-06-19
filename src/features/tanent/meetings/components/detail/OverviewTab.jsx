import React from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  List, 
  Calendar, 
  Clock, 
  Globe, 
  RotateCcw, 
  Hash, 
  User,
  ArrowRight,
  Sparkles,
  Bell
} from "lucide-react";
import { formatDateTime, getDuration } from "../../utils/meetingFormatters";
import { formatReminderLabel } from "../../constants/reminderUtils";

const InfoRow = ({ icon: Icon, label, value, isMultiline = false, extraContent = null }) => (
  <div className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0">
    <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 mt-0.5">
      <Icon className="w-4 h-4 text-slate-400" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
      {isMultiline ? (
        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{value || "—"}</p>
      ) : (
        <p className="text-sm text-slate-700 truncate">{value || "—"}</p>
      )}
      {extraContent}
    </div>
  </div>
);

const OverviewTab = ({ meeting }) => {
  if (!meeting) return null;

  const isRecurring = meeting.schedule_type === "recurring";
  const hasReminders = Array.isArray(meeting.reminder_minutes) && meeting.reminder_minutes.length > 0;

  // Helper logic to convert raw recurrence JSON data into human-readable strings
  const getRecurrenceSummary = (rule) => {
    if (!rule || typeof rule !== "object") return null;

    const frequency = rule.frequency || "daily";
    const interval = rule.interval || 1;
    const intervalString = interval > 1 ? `Every ${interval} ` : "Every ";

    let detailText = "";
    if (frequency === "daily") {
      detailText = interval > 1 ? "days" : "Day";
    } else if (frequency === "weekly" && Array.isArray(rule.days)) {
      const formattedDays = rule.days
        .map((d) => d.charAt(0).toUpperCase() + d.slice(1))
        .join(", ");
      detailText = interval > 1 ? `weeks on ${formattedDays}` : `Week on ${formattedDays}`;
    } else if (frequency === "monthly" && rule.day_of_month) {
      detailText = interval > 1 ? `months on day ${rule.day_of_month}` : `Month on day ${rule.day_of_month}`;
    }

    return `${intervalString}${detailText}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }} 
      className="space-y-6"
    >
      {/* Details Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />Details
          </h3>
        </div>
        <div className="px-6 py-2">
          <InfoRow icon={FileText} label="Description" value={meeting.description} isMultiline />
          <InfoRow icon={List} label="Agenda" value={meeting.agenda} isMultiline />
        </div>
      </div>

      {/* Schedule Card with Recurring Support */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />Schedule Timeline
          </h3>
        </div>
        <div className="px-6 py-2">
          <InfoRow 
            icon={Calendar} 
            label={isRecurring ? "Base Start (First Instance)" : "Start"} 
            value={formatDateTime(meeting.scheduled_start, meeting.timezone)} 
          />
          <InfoRow 
            icon={Clock} 
            label={isRecurring ? "Base End (First Instance)" : "End"} 
            value={formatDateTime(meeting.scheduled_end, meeting.timezone)} 
          />
          <InfoRow icon={Clock} label="Duration" value={getDuration(meeting.scheduled_start, meeting.scheduled_end)} />
          <InfoRow icon={Globe} label="Timezone" value={meeting.timezone || "UTC"} />
          
          <InfoRow 
            icon={RotateCcw} 
            label="Schedule Mode" 
            value={meeting.schedule_type} 
            extraContent={
              isRecurring && meeting.recurrence_rule ? (
                <div className="mt-2 border border-indigo-100 bg-indigo-50/40 rounded-xl p-3 space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    Active Recurrence Pattern
                  </div>
                  <p className="text-sm text-indigo-950 font-medium capitalize">
                    {getRecurrenceSummary(meeting.recurrence_rule)}
                  </p>
                  {meeting.recurrence_rule.until && (
                    <p className="text-xs text-slate-400">
                      Terminates on: <span className="font-medium text-slate-600">{formatDateTime(meeting.recurrence_rule.until, meeting.timezone)}</span>
                    </p>
                  )}
                </div>
              ) : null
            }
          />

          {/* Real-Time Next Occurrence Indicator Block */}
          {isRecurring && meeting.next_occurrence && (
            <InfoRow
              icon={ArrowRight}
              label="Next Real-Time Occurrence"
              value={formatDateTime(meeting.next_occurrence, meeting.timezone)}
              extraContent={
                <div className="mt-1.5 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                  Live Tracked Instance
                </div>
              }
            />
          )}
        </div>
      </div>

      {/* Reminder Schedule Configuration Block Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-slate-400" />Meeting Reminders
          </h3>
        </div>
        <div className="px-6 py-4">
          {hasReminders ? (
            <div className="flex flex-wrap gap-2">
              {[...meeting.reminder_minutes]
                .sort((a, b) => a - b)
                .map((minutes) => (
                  <span
                    key={minutes}
                    className="inline-flex items-center px-3 py-1 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded-xl shadow-sm"
                  >
                    {formatReminderLabel(minutes)}
                  </span>
                ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic">
              No reminders configured
            </p>
          )}
        </div>
      </div>

      {/* Metadata Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Hash className="w-4 h-4 text-slate-400" />Metadata
          </h3>
        </div>
        <div className="px-6 py-2">
          <InfoRow icon={Hash} label="Meeting ID" value={meeting.public_id} />
          <InfoRow icon={User} label="Created By" value={meeting.created_by} />
          <InfoRow icon={Calendar} label="Created At" value={formatDateTime(meeting.created_at, meeting.timezone)} />
        </div>
      </div>
    </motion.div>
  );
};

export default OverviewTab;