import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";

import StageView from "./StageView";
import FilmStrip from "./FilmStrip";
import SelfView from "./SelfView";
import ParticipantDrawer from "./ParticipantDrawer";

import {
  usePinnedParticipant,
} from "../../hooks/usePineedParticipant";

import {
  useActiveSpeaker,
} from "../../hooks/useActiveSpeaker";

import {
  useScreenShareTrack,
} from "../../hooks/useScreenShareTrack";

// =====================================================
// PREMIUM CONFERENCING LAYOUT — FINAL
// World-class RTC UI: Zoom × Google Meet × Linear
// =====================================================

const MeetingLayout = ({
  room,
  participants = [],
}) => {

  // =====================================================
  // DRAWER STATE
  // =====================================================
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  // =====================================================
  // LOCAL PARTICIPANT
  // =====================================================

  const localParticipant =
    useMemo(() => {
      return participants.find(
        (participant) =>
          participant.isLocal
      );
    }, [participants]);

  // =====================================================
  // REMOTE PARTICIPANTS
  // =====================================================

  const remoteParticipants =
    useMemo(() => {
      return participants.filter(
        (participant) =>
          !participant.isLocal
      );
    }, [participants]);

  // =====================================================
  // PINNED PARTICIPANT
  // =====================================================

  const {
    pinnedParticipant,
    togglePinParticipant,
    isPinned,
  } =
    usePinnedParticipant(
      remoteParticipants
    );

  // =====================================================
  // ACTIVE SPEAKER
  // =====================================================

  const {
    activeSpeaker,
    priorityParticipant,
  } = useActiveSpeaker(
    room,
    pinnedParticipant
  );

  // =====================================================
  // SCREEN SHARE
  // =====================================================

  const {
    screenShareParticipant,
    hasScreenShare,
  } =
    useScreenShareTrack(
      room,
      participants
    );

  // =====================================================
  // MAIN STAGE PARTICIPANT
  // =====================================================

  const [
  stableStageParticipant,
  setStableStageParticipant,
] = useState(null);

useEffect(() => {

  let nextParticipant = null;

  // SCREEN SHARE PRIORITY
  if (
    hasScreenShare &&
    screenShareParticipant
  ) {

    nextParticipant =
      screenShareParticipant;
  }

  // PINNED / ACTIVE SPEAKER
  else if (
    priorityParticipant
  ) {

    nextParticipant =
      priorityParticipant;
  }

  // REMOTE FALLBACK
  else if (
    remoteParticipants.length > 0
  ) {

    nextParticipant =
      remoteParticipants[0];
  }

  // LOCAL FALLBACK
  else {

    nextParticipant =
      localParticipant;
  }

  if (
    nextParticipant?.sid !==
    stableStageParticipant?.sid
  ) {

    setStableStageParticipant(
      nextParticipant
    );
  }

}, [
  hasScreenShare,
  screenShareParticipant,
  priorityParticipant,
  remoteParticipants,
  localParticipant,
  
]);

  // =====================================================
  // FILM STRIP PARTICIPANTS
  // =====================================================

  const stripParticipants =
  useMemo(() => {
    return remoteParticipants.filter(
      (participant) =>
        participant.sid !==
        stableStageParticipant?.sid
    );
  }, [
    remoteParticipants,
    stableStageParticipant,
  ]);

  // =====================================================
  // OVERFLOW PARTICIPANTS
  // =====================================================

  const MAX_VISIBLE_STRIP = 6;

  const visibleStripParticipants =
    useMemo(() => {
      return stripParticipants.slice(0, MAX_VISIBLE_STRIP);
    }, [stripParticipants]);

  const hiddenStripCount =
    useMemo(() => {
      return Math.max(
        0,
        stripParticipants.length - MAX_VISIBLE_STRIP
      );
    }, [stripParticipants]);

  // =====================================================
  // SINGLE PARTICIPANT MODE
  // =====================================================

  if (remoteParticipants.length === 0) {
    return (
      <div className="
        relative
        h-full
        w-full
        bg-[#0a0a0f]
        overflow-hidden
      ">
        {/* Ambient background */}
        <div className="
          absolute
          inset-0
          bg-gradient-to-br
          from-slate-900/40
          via-[#0a0a0f]
          to-slate-950/60
          pointer-events-none
        " />

        {/* Main stage */}
        <div className="
          relative
          h-full
          w-full
          p-3
          sm:p-4
          lg:p-5
          xl:p-6
        ">
          <div className="
            h-full
            w-full
            rounded-2xl
            overflow-hidden
            bg-slate-950/80
            border
            border-white/[0.06]
            shadow-2xl
            shadow-black/40
          ">
            <StageView
              participants={participants}
              priorityParticipant={localParticipant}
              onPinParticipant={togglePinParticipant}
              isPinned={isPinned}
            />
          </div>
        </div>

        {/* SelfView is FIXED positioned — renders itself, no wrapper needed */}
        <SelfView
          participant={localParticipant}
          onPinParticipant={togglePinParticipant}
          isPinned={isPinned}
        />

        {/* Drawer */}
        <ParticipantDrawer
          participants={participants}
          isOpen={isDrawerOpen}
          onClose={closeDrawer}
          onPinParticipant={togglePinParticipant}
          isPinned={isPinned}
          localParticipant={localParticipant}
        />
      </div>
    );
  }

  // =====================================================
  // MULTI-PARTICIPANT MODE
  // =====================================================

  return (
    <div className="
      relative
      h-full
      w-full
      bg-[#0a0a0f]
      overflow-hidden
      isolate
    ">
      {/* Ambient background */}
      <div className="
        absolute
        inset-0
        bg-gradient-to-br
        from-slate-900/30
        via-[#0a0a0f]
        to-slate-950/50
        pointer-events-none
      " />

      {/* Grid pattern */}
      <div className="
        absolute
        inset-0
        opacity-[0.015]
        pointer-events-none
        bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)]
        bg-[length:24px_24px]
      " />

      {/* Main layout */}
      <div className="
        relative
        h-full
        w-full
        flex
        flex-col
        lg:flex-row
        gap-2
        sm:gap-3
        lg:gap-4
        p-2
        sm:p-3
        lg:p-4
        xl:p-5
        overflow-hidden
        ">
        {/* Stage */}
        <div className="
        flex-1
        min-w-0
        min-h-0
        lg:flex-[1.2]
        xl:flex-[1.4]
        2xl:flex-[1.6]
        ">
          <div className="
            relative
            h-full
            min-h-0
            rounded-2xl
            overflow-hidden
            bg-slate-950/80
            border
            border-white/[0.06]
            shadow-2xl
            shadow-black/40
          ">
            <StageView
              participants={participants}
                priorityParticipant={stableStageParticipant}
              onPinParticipant={togglePinParticipant}
              isPinned={isPinned}
            />
          </div>
        </div>

        {/* Film strip sidebar */}
        <div className="
            w-full
            lg:w-[240px]
            xl:w-[280px]
            2xl:w-[320px]
            min-w-0
            flex
            flex-col
            gap-2
            lg:gap-3
            ">
          <div className="
            flex-1
            min-h-0
            rounded-2xl
            overflow-hidden
            bg-slate-950/60
            border
            border-white/[0.06]
            shadow-xl
            shadow-black/30
            backdrop-blur-xl
            flex
            flex-col
          ">
            {/* Header */}
            <div className="
              flex
              items-center
              justify-between
              px-4
              py-3
              border-b
              border-white/[0.04]
              shrink-0
            ">
              <button
                type="button"
                onClick={openDrawer}
                className="
                  flex
                  items-center
                  gap-2
                  text-[11px]
                  font-semibold
                  tracking-wider
                  uppercase
                  text-white/40
                  hover:text-white/60
                  transition-colors
                "
              >
                <span>Participants</span>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <span className="text-[11px] font-medium text-white/30 tabular-nums">
                {stripParticipants.length}
              </span>
            </div>

            {/* Film strip */}
            <div className="
              flex-1
              min-h-0
              overflow-x-auto
            overflow-y-hidden
            lg:overflow-y-auto
            lg:overflow-x-hidden
              p-2
              space-y-2
              scrollbar-thin
            ">
              <FilmStrip
                participants={visibleStripParticipants}
                priorityParticipant={stableStageParticipant}
                onPinParticipant={togglePinParticipant}
                isPinned={isPinned}
              />
            </div>

            {/* Overflow — opens drawer */}
            {hiddenStripCount > 0 && (
              <div className="
                shrink-0
                px-4
                py-2.5
                border-t
                border-white/[0.04]
                bg-white/[0.02]
              ">
                <button
                  type="button"
                  onClick={openDrawer}
                  className="
                    w-full
                    flex
                    items-center
                    justify-center
                    gap-2
                    px-3
                    py-2
                    rounded-xl
                    bg-white/[0.04]
                    hover:bg-white/[0.08]
                    border
                    border-white/[0.06]
                    transition-all
                    group/btn
                  "
                >
                  <span className="text-xs font-medium text-white/50 group-hover/btn:text-white/70">
                    +{hiddenStripCount} more
                  </span>
                  <svg className="w-3.5 h-3.5 text-white/30 group-hover/btn:text-white/50 group-hover/btn:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SelfView — FIXED positioned, handles its own placement + drag */}
      <SelfView
        participant={localParticipant}
        onPinParticipant={togglePinParticipant}
        isPinned={isPinned}
      />

      {/* Active speaker badge */}
      {activeSpeaker && (
        <div className="absolute top-4 left-4 sm:top-5 sm:left-5 z-30">
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-black/40 backdrop-blur-2xl border border-white/[0.08] shadow-xl">
            <div className="flex items-end gap-[2px] h-3.5">
              <span className="w-[3px] h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="w-[3px] h-2.5 bg-emerald-400 rounded-full animate-pulse [animation-delay:0.1s]" />
              <span className="w-[3px] h-3 bg-emerald-400 rounded-full animate-pulse [animation-delay:0.2s]" />
            </div>
            <span className="text-xs font-medium text-white/80">
              Speaking: <span className="text-emerald-400">{activeSpeaker.identity}</span>
            </span>
          </div>
        </div>
      )}

      {/* Screen share badge */}
      {hasScreenShare && screenShareParticipant && (
        <div className="absolute top-4 right-4 sm:top-5 sm:right-5 z-30">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500/10 backdrop-blur-2xl border border-emerald-400/20 shadow-xl">
            <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-semibold text-emerald-300">
              {screenShareParticipant.identity} is presenting
            </span>
          </div>
        </div>
      )}

      {/* Participant Drawer */}
      <ParticipantDrawer
        participants={participants}
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        onPinParticipant={togglePinParticipant}
        isPinned={isPinned}
        localParticipant={localParticipant}
      />
    </div>
  );
};

export default React.memo(
  MeetingLayout
);