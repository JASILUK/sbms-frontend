import React, { useMemo } from "react";
import VideoTile from "./VideoTile";

// =====================================================
// STAGE VIEW — ULTRA CLEAN
// VideoTile handles ALL participant UI (name, live, pin, mic, camera)
// StageView only adds: count badge + screen share indicator
// =====================================================

const StageView = ({
  priorityParticipant = null,
  participants = [],
  onPinParticipant,
  isPinned,
}) => {

  const stageParticipant = useMemo(() => {
    if (priorityParticipant) return priorityParticipant;
    return participants[0] || null;
  }, [priorityParticipant, participants]);

  const participantCount = participants.length;

  const isScreenShare = useMemo(() => {
    return (
      stageParticipant?.isScreenShare ||
      stageParticipant?.videoTrack?.source === "screen_share" ||
      stageParticipant?.screenShareEnabled ||
      false
    );
  }, [stageParticipant]);

  const pinnedState = useMemo(() => {
    if (!stageParticipant) return false;
    return isPinned?.(stageParticipant.sid) || false;
  }, [stageParticipant, isPinned]);

  if (!stageParticipant) {
    return (
      <div className="relative h-full w-full flex items-center justify-center bg-[#0a0a0f] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-[#0a0a0f] to-slate-950/60" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-slate-800/20 blur-[120px] animate-pulse" />
        <div className="relative text-center px-6 max-w-md">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-2 border-white/[0.06] animate-[spin_8s_linear_infinite]" />
            <div className="absolute inset-3 rounded-full border border-white/[0.08] animate-[spin_6s_linear_infinite_reverse]" />
            <div className="absolute inset-6 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center backdrop-blur-sm">
              <svg className="w-7 h-7 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-white/90 tracking-tight mb-3">Waiting for others</h3>
          <p className="text-sm text-white/35 leading-relaxed max-w-xs mx-auto">Participants will appear here once they join the meeting.</p>
          <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.05]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 animate-pulse" />
            <span className="text-xs text-white/30">Room is active</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0a0a0f] isolate">
      {/* Ambient background for screen share */}
      {isScreenShare && (
        <div className="absolute inset-0 bg-slate-950 flex items-center justify-center">
          <div className="w-full h-full opacity-30 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-[#0a0a0f]" />
        </div>
      )}

      {/* VideoTile — handles ALL participant UI internally */}
      <div className={`absolute inset-0 ${isScreenShare ? "flex items-center justify-center p-4 sm:p-6 lg:p-8" : ""}`}>
        <div className={`relative w-full h-full ${isScreenShare ? "max-w-[1920px] mx-auto" : ""}`}>
          <VideoTile
            participant={stageParticipant}
            isPinned={pinnedState}
            onPin={onPinParticipant}
            isStageView={true}
            className={`w-full h-full ${isScreenShare ? "object-contain rounded-xl" : "object-cover"}`}
          />
        </div>
      </div>

      {/* =====================================================
          STAGEVIEW ONLY ADDS:
          1. Count badge (top-right)
          2. Screen share indicator (top-left)
          NOTHING ELSE — VideoTile handles name/live/pin/mic/camera
      ===================================================== */}

      {/* Count badge — top right */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/40 backdrop-blur-xl border border-white/[0.06] shadow-lg">
          <svg className="w-3 h-3 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="text-[11px] font-semibold text-white/50 tabular-nums">{participantCount}</span>
        </div>
      </div>

      {/* Screen share indicator — top left */}
      {isScreenShare && (
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 backdrop-blur-2xl border border-emerald-400/15 shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-semibold text-emerald-300/90">Screen Share Active</span>
          </div>
        </div>
      )}

      {/* Corner border */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none z-40 border border-white/[0.04]" />
    </div>
  );
};

export default React.memo(StageView);