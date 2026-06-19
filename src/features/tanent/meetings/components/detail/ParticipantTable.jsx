
import React, {
  useMemo,
  useState,
} from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  Search,
  MoreVertical,
  Shield,
  User,
  Crown,
  UserCheck,
  UserX,
  UserMinus,
  Clock3,
  Activity,
} from "lucide-react";

import {
  formatRelativeTime,
  formatParticipantRole,
  formatParticipantStatus,
} from "../../utils/meetingFormatters";

// =====================================================
// ROLE ICONS
// =====================================================

const roleIcons = {
  host: Crown,
  co_host: Shield,
  participant: User,
  viewer: User,
};

// =====================================================
// STATUS ICONS
// =====================================================

const statusIcons = {
  invited: User,
  accepted: UserCheck,
  joined: UserCheck,
  declined: UserX,
  left: UserMinus,
  no_show: UserMinus,
};

// =====================================================
// ATTENDANCE COLORS
// =====================================================

const attendanceColors = {

  full_attendance:
    "text-emerald-700 bg-emerald-50 border-emerald-200",

  present:
    "text-green-700 bg-green-50 border-green-200",

  partial:
    "text-amber-700 bg-amber-50 border-amber-200",

  absent:
    "text-red-700 bg-red-50 border-red-200",
};

// =====================================================
// HELPERS
// =====================================================

const formatDuration = (
  seconds = 0
) => {

  if (!seconds) {
    return "—";
  }

  const minutes =
    Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours =
    Math.floor(minutes / 60);

  const remaining =
    minutes % 60;

  return `${hours}h ${remaining}m`;
};

// =====================================================
// COMPONENT
// =====================================================

const ParticipantTable = ({
  participants = [],
  canManage,
  onUpdateRole,
  onRemove,
  isLoading,
}) => {

  // ===================================================
  // STATE
  // ===================================================

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    openMenuId,
    setOpenMenuId,
  ] = useState(null);

  // ===================================================
  // FILTERED PARTICIPANTS
  // ===================================================

  const filtered =
    useMemo(() => {

      return participants.filter(
        (participant) =>

          participant.username
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )

          ||

          participant.role
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

    }, [
      participants,
      search,
    ]);

  // ===================================================
  // LOADING
  // ===================================================

  if (isLoading) {

    return (

      <div className="space-y-2">

        {Array.from({
          length: 4,
        }).map((_, i) => (

          <div
            key={i}
            className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-100 animate-pulse"
          >

            <div className="w-8 h-8 rounded-full bg-slate-100" />

            <div className="flex-1 space-y-1.5">

              <div className="w-28 h-3.5 bg-slate-100 rounded" />

              <div className="w-16 h-2.5 bg-slate-100 rounded" />

            </div>

          </div>
        ))}

      </div>
    );
  }

  // ===================================================
  // RENDER
  // ===================================================

  return (

    <div className="space-y-3">

      {/* ============================================= */}
      {/* SEARCH */}
      {/* ============================================= */}

      <div className="flex items-center gap-2">

        <div className="relative flex-1">

          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Search participants..."
            className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-colors"
          />

        </div>

      </div>

      {/* ============================================= */}
      {/* TABLE */}
      {/* ============================================= */}

      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b border-slate-100 bg-slate-50/60">

                <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  User
                </th>

                <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Role
                </th>

                <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>

                <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Presence
                </th>

                <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Attendance
                </th>

                <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                  Duration
                </th>

                <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                  Joined
                </th>

                <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">
                  Left
                </th>

                {canManage && (
                  <th className="w-8" />
                )}

              </tr>

            </thead>

            <tbody>

              {filtered.map(
                (
                  participant,
                  idx
                ) => {

                  const RoleIcon =
                    roleIcons[
                      participant.role
                    ] || User;

                  const StatusIcon =
                    statusIcons[
                      participant.status
                    ] || User;

                  const presenceColor =
                    participant.is_present
                      ? "text-emerald-600 bg-emerald-50 border-emerald-100"
                      : "text-slate-500 bg-slate-100 border-slate-200";

                  const attendanceColor =
                    attendanceColors[
                      participant.attendance_status
                    ] ||
                    attendanceColors.absent;

                  return (

                    <motion.tr
                      key={participant.id}
                      initial={{
                        opacity: 0,
                      }}
                      animate={{
                        opacity: 1,
                      }}
                      transition={{
                        delay: idx * 0.02,
                      }}
                      className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors"
                    >

                      {/* USER */}

                      <td className="px-4 py-2.5">

                        <div className="flex items-center gap-2.5">

                          <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">

                            <span className="text-[10px] font-bold text-slate-500">

                              {
                                participant.username
                                  ?.charAt(0)
                                  ?.toUpperCase()
                              }

                            </span>

                          </div>

                          <div className="min-w-0">

                            <p className="text-xs font-medium text-slate-900 truncate">
                              {participant.username}
                            </p>

                            <p className="text-[10px] text-slate-400">
                              ID: {participant.membership_id}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* ROLE */}

                      <td className="px-4 py-2.5">

                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200/80">

                          <RoleIcon className="w-2.5 h-2.5" />

                          {
                            formatParticipantRole(
                              participant.role
                            )
                          }

                        </span>

                      </td>

                      {/* STATUS */}

                      <td className="px-4 py-2.5">

                        <span className="inline-flex items-center gap-1 text-[11px]">

                          <StatusIcon className="w-3 h-3 text-slate-400" />

                          <span className="text-slate-600">

                            {
                              formatParticipantStatus(
                                participant.status
                              )
                            }

                          </span>

                        </span>

                      </td>

                      {/* PRESENCE */}

                      <td className="px-4 py-2.5">

                        <span
                          className={`
                            inline-flex
                            items-center
                            px-1.5
                            py-0.5
                            rounded-full
                            text-[10px]
                            font-semibold
                            border
                            ${presenceColor}
                          `}
                        >
                          {
                            participant.is_present
                              ? "Present"
                              : "Absent"
                          }
                        </span>

                      </td>

                      {/* ATTENDANCE */}

                      <td className="px-4 py-2.5">

                        <div className="flex flex-col gap-1">

                          <span
                            className={`
                              inline-flex
                              items-center
                              w-fit
                              px-1.5
                              py-0.5
                              rounded-full
                              text-[10px]
                              font-semibold
                              border
                              ${attendanceColor}
                            `}
                          >

                            <Activity className="w-2.5 h-2.5 mr-1" />

                            {
                              participant
                                .attendance_status
                                ?.replaceAll("_", " ")
                            }

                          </span>

                          <span className="text-[10px] text-slate-500 font-medium">

                            {
                              participant.attendance_percentage || 0
                            }
                            %

                          </span>

                        </div>

                      </td>

                      {/* DURATION */}

                      <td className="px-4 py-2.5 hidden lg:table-cell">

                        <div className="flex items-center gap-1 text-[11px] text-slate-500">

                          <Clock3 className="w-3 h-3" />

                          {
                            formatDuration(
                              participant.attendance_duration_seconds
                            )
                          }

                        </div>

                      </td>

                      {/* JOINED */}

                      <td className="px-4 py-2.5 text-[11px] text-slate-500 hidden sm:table-cell">

                        {
                          participant.joined_at
                            ? formatRelativeTime(
                                participant.joined_at
                              )
                            : "—"
                        }

                      </td>

                      {/* LEFT */}

                      <td className="px-4 py-2.5 text-[11px] text-slate-500 hidden md:table-cell">

                        {
                          participant.left_at
                            ? formatRelativeTime(
                                participant.left_at
                              )
                            : "—"
                        }

                      </td>

                      {/* ACTIONS */}

                      {canManage && (

                        <td className="px-4 py-2.5 relative">

                          <button
                            onClick={() =>
                              setOpenMenuId(
                                openMenuId === participant.id
                                  ? null
                                  : participant.id
                              )
                            }
                            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                          >

                            <MoreVertical className="w-3.5 h-3.5" />

                          </button>

                          <AnimatePresence>

                            {
                              openMenuId === participant.id && (

                                <motion.div
                                  initial={{
                                    opacity: 0,
                                    scale: 0.95,
                                    y: -2,
                                  }}
                                  animate={{
                                    opacity: 1,
                                    scale: 1,
                                    y: 0,
                                  }}
                                  exit={{
                                    opacity: 0,
                                    scale: 0.95,
                                    y: -2,
                                  }}
                                  transition={{
                                    duration: 0.15,
                                  }}
                                  className="absolute right-3 top-8 z-30 w-40 bg-white rounded-lg border border-slate-200 shadow-lg shadow-slate-200/50 py-1"
                                >

                                  {
                                    participant.role !== "host" && (
                                      <>

                                        <button
                                          onClick={() => {
                                            onRemove?.(
                                              participant.id
                                            );

                                            setOpenMenuId(
                                              null
                                            );
                                          }}
                                          className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                          Remove
                                        </button>

                                      </>
                                    )
                                  }

                                </motion.div>
                              )
                            }

                          </AnimatePresence>

                        </td>
                      )}

                    </motion.tr>
                  );
                }
              )}

            </tbody>

          </table>

        </div>

        {/* EMPTY */}

        {filtered.length === 0 && (

          <div className="py-10 text-center">

            <p className="text-xs text-slate-500">
              No participants found
            </p>

          </div>
        )}

      </div>

    </div>
  );
};

export default ParticipantTable;

