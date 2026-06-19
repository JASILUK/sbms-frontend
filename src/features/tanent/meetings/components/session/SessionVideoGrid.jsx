import React, { useMemo } from "react";
import MeetingLayout from "./MeetingLayout";

// =====================================================
// SESSION VIDEO GRID — PREMIUM REDESIGN
// Orchestration preserved. UI/UX only.
// =====================================================

const SessionVideoGrid = ({
  room,
  participants = [],
}) => {

  // =====================================================
  // STABLE PARTICIPANTS (Preserved)
  // =====================================================
  const stableParticipants = useMemo(() => {
    return participants.filter(Boolean);
  }, [participants]);

  // =====================================================
  // EMPTY STATE — Premium cinematic waiting room
  // =====================================================
  if (stableParticipants.length === 0) {
    return (
      <div className="
        relative
        h-full
        w-full
        bg-[#0a0a0f]
        overflow-hidden
        flex
        items-center
        justify-center
        isolate
      ">
        {/* Ambient background layers */}
        <div className="
          absolute
          inset-0
          bg-gradient-to-br
          from-slate-900/40
          via-[#0a0a0f]
          to-slate-950/60
          pointer-events-none
        " />

        {/* Subtle grid pattern */}
        <div className="
          absolute
          inset-0
          opacity-[0.015]
          pointer-events-none
          bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)]
          bg-[length:32px_32px]
        " />

        {/* Animated ambient glow */}
        <div className="
          absolute
          top-1/2
          left-1/2
          -translate-x-1/2
          -translate-y-1/2
          w-[600px]
          h-[600px]
          rounded-full
          bg-slate-800/10
          blur-[140px]
          animate-pulse
          pointer-events-none
        " />

        {/* Content */}
        <div className="relative text-center px-6 max-w-md z-10">
          {/* Icon container */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="
              absolute
              inset-0
              rounded-3xl
              border
              border-white/[0.06]
              animate-[spin_12s_linear_infinite]
            " />
            <div className="
              absolute
              inset-3
              rounded-2xl
              border
              border-white/[0.08]
              animate-[spin_8s_linear_infinite_reverse]
            " />
            <div className="
              absolute
              inset-6
              rounded-xl
              bg-white/[0.03]
              border
              border-white/[0.06]
              flex
              items-center
              justify-center
              backdrop-blur-sm
            ">
              <svg
                className="w-8 h-8 text-white/20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          <h3 className="
            text-xl
            font-semibold
            text-white/90
            tracking-tight
            mb-3
          ">
            Waiting for others
          </h3>

          <p className="
            text-sm
            text-white/35
            leading-relaxed
            max-w-xs
            mx-auto
          ">
            Participants will appear here once they join the meeting.
          </p>

          {/* Live status badge */}
          <div className="
            mt-8
            inline-flex
            items-center
            gap-2.5
            px-4
            py-2.5
            rounded-full
            bg-white/[0.03]
            border
            border-white/[0.06]
            backdrop-blur-xl
          ">
            <span className="
              relative
              flex
              h-2
              w-2
            ">
              <span className="
                animate-ping
                absolute
                inline-flex
                h-full
                w-full
                rounded-full
                bg-emerald-400
                opacity-40
              " />
              <span className="
                relative
                inline-flex
                rounded-full
                h-2
                w-2
                bg-emerald-500
              " />
            </span>
            <span className="text-xs text-white/40 font-medium">
              Room is active
            </span>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN RENDER — Delegates to MeetingLayout
  // =====================================================
  return (
    <div className="
      relative
      h-full
      w-full
      overflow-hidden
      bg-[#0a0a0f]
      isolate
    ">
      <MeetingLayout
        room={room}
        participants={stableParticipants}
      />
    </div>
  );
};

export default React.memo(SessionVideoGrid);