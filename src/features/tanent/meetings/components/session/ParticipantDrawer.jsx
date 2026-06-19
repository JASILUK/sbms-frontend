import React, {
  useMemo,
} from "react";

import VideoTile from "./VideoTile";

// =====================================================
// PREMIUM FILM STRIP — CINEMATIC REDESIGN
// World-class participant rail: Zoom × Meet × Teams × Linear
// =====================================================

const FilmStrip = ({
  participants = [],
  priorityParticipant = null,
  onPinParticipant,
  isPinned,
}) => {

  // =====================================================
  // STRIP PARTICIPANTS (Orchestration Preserved)
  // Excludes priorityParticipant from strip
  // =====================================================
  const stripParticipants = useMemo(() => {
    if (!priorityParticipant) {
      return participants;
    }
    return participants.filter(
      (participant) => participant.sid !== priorityParticipant.sid
    );
  }, [participants, priorityParticipant]);

  // =====================================================
  // EMPTY STATE (Preserved)
  // =====================================================
  if (stripParticipants.length === 0) {
    return null;
  }

  // =====================================================
  // OVERFLOW MATH (Constraints Maintained)
  // =====================================================
  const MAX_VISIBLE = 6;
  const visibleParticipants = stripParticipants.slice(0, MAX_VISIBLE);
  const remainingCount = Math.max(0, stripParticipants.length - MAX_VISIBLE);

  // =====================================================
  // RENDER
  // Premium Responsive Navigation System
  // 
  // CRITICAL FIX: Do NOT add onClick handlers on tile wrappers.
  // VideoTile handles pin clicks internally via its onPin prop.
  // Adding wrapper onClick causes double-firing (toggle on then off).
  // =====================================================
  return (
    <div className="
      relative
      h-full
      w-full
      select-none
      isolate
    ">
      {/* =====================================================
          INTELLIGENT SCROLL CONTAINER
          Horizontal on mobile, vertical on desktop
          Snap scrolling for tactile feel
      ===================================================== */}
      <div
        className="
          flex
          h-full
          w-full
          content-start
          gap-2
          sm:gap-2.5
          overflow-x-auto
          overflow-y-hidden
          pb-1.5
          sm:pb-0
          sm:pr-1
          sm:flex-col
          sm:overflow-x-hidden
          sm:overflow-y-auto
          scroll-smooth
          snap-x
          snap-mandatory
          sm:snap-y
          sm:snap-mandatory
          scrollbar-none
        "
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* PARTICIPANT TILES */}
        {visibleParticipants.map((participant, index) => {
          const isSpeaking = participant.isSpeaking;
          const pinnedStatus = isPinned?.(participant.sid) || false;
          const identity = participant.identity || participant.name || "Guest";

          return (
            <div
              key={participant.sid}
              className={`
                group/tile
                relative
                shrink-0
                overflow-hidden
                rounded-xl
                bg-[#0a0a0f]
                transition-all
                duration-300
                ease-out
                snap-start
                snap-always

                /* Mobile: horizontal strip tiles */
                w-[152px]
                aspect-[16/10]

                /* Desktop: vertical sidebar tiles */
                sm:w-full
                sm:aspect-auto
                sm:h-[100px]
                md:h-[110px]
                lg:h-[120px]
                xl:h-[128px]

                /* Border treatment */
                border
                ${isSpeaking
                  ? "border-emerald-500/40 shadow-[0_0_16px_rgba(16,185,129,0.12)]"
                  : pinnedStatus
                    ? "border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.08)]"
                    : "border-white/[0.06] hover:border-white/[0.1]"
                }

                /* Hover lift */
                hover:shadow-lg
                hover:shadow-black/30
                hover:-translate-y-0.5
                sm:hover:translate-y-0
                sm:hover:scale-[1.02]
              `}
            >
              {/* =====================================================
                  VIDEO CONTENT

                  CRITICAL: Pass onPinParticipant DIRECTLY.
                  VideoTile handles click internally.
              ===================================================== */}
              <div className="
                absolute
                inset-0
                z-0
              ">
                <VideoTile
                  participant={participant}
                  isPinned={pinnedStatus}
                  onPin={onPinParticipant}
                  isFilmStrip={true}
                  className="
                    w-full
                    h-full
                    object-cover
                  "
                />
              </div>

              {/* =====================================================
                  CINEMATIC VIGNETTE OVERLAY
                  Bottom gradient for text readability
              ===================================================== */}
              <div className="
                pointer-events-none
                absolute
                inset-x-0
                bottom-0
                h-16
                bg-gradient-to-t
                from-black/70
                via-black/30
                to-transparent
                z-10
                transition-opacity
                duration-300
                opacity-80
                group-hover/tile:opacity-100
              " />

              {/* Top edge subtle vignette */}
              <div className="
                pointer-events-none
                absolute
                inset-x-0
                top-0
                h-8
                bg-gradient-to-b
                from-black/30
                to-transparent
                z-10
                opacity-0
                group-hover/tile:opacity-100
                transition-opacity
                duration-300
              " />

              {/* =====================================================
                  ACTIVE SPEAKER RING
                  Elegant glow around tile when speaking
              ===================================================== */}
              {isSpeaking && (
                <div className="
                  absolute
                  inset-0
                  rounded-xl
                  z-20
                  pointer-events-none
                  ring-1
                  ring-emerald-500/30
                  ring-inset
                ">
                  {/* Animated pulse ring */}
                  <div className="
                    absolute
                    inset-0
                    rounded-xl
                    ring-1
                    ring-emerald-500/20
                    animate-pulse
                  " />
                </div>
              )}

              {/* =====================================================
                  PINNED INDICATOR
                  Top-left, clean and minimal
              ===================================================== */}
              {pinnedStatus && (
                <div className="
                  absolute
                  top-2
                  left-2
                  z-30
                  flex
                  items-center
                  gap-1
                  px-2
                  py-1
                  rounded-lg
                  bg-black/50
                  backdrop-blur-md
                  border
                  border-white/[0.08]
                  shadow-sm
                ">
                  <svg
                    className="w-3 h-3 text-amber-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
                  </svg>
                  <span className="
                    text-[9px]
                    font-semibold
                    text-white/70
                    uppercase
                    tracking-wider
                  ">
                    Pinned
                  </span>
                </div>
              )}

              {/* =====================================================
                  PARTICIPANT IDENTITY
                  Bottom overlay, clean typography
              ===================================================== */}
              <div className="
                absolute
                inset-x-0
                bottom-0
                z-30
                p-2.5
                sm:p-3
              ">
                <div className="
                  flex
                  items-center
                  justify-between
                  gap-2
                ">
                  {/* Name */}
                  <p className="
                    text-[11px]
                    sm:text-xs
                    font-medium
                    text-white/90
                    truncate
                    leading-none
                  ">
                    {identity}
                  </p>

                  {/* Status indicators */}
                  <div className="
                    flex
                    items-center
                    gap-1.5
                    shrink-0
                  ">
                    {/* Speaking indicator */}
                    {isSpeaking && (
                      <div className="
                        flex
                        items-end
                        gap-[1.5px]
                        h-2.5
                      ">
                        <span className="
                          w-[2px]
                          h-1
                          bg-emerald-400
                          rounded-full
                          animate-pulse
                        " />
                        <span className="
                          w-[2px]
                          h-1.5
                          bg-emerald-400
                          rounded-full
                          animate-pulse
                          [animation-delay:0.1s]
                        " />
                        <span className="
                          w-[2px]
                          h-2
                          bg-emerald-400
                          rounded-full
                          animate-pulse
                          [animation-delay:0.2s]
                        " />
                      </div>
                    )}

                    {/* Live dot */}
                    <span className={`
                      w-1.5
                      h-1.5
                      rounded-full
                      ${isSpeaking
                        ? "bg-emerald-500"
                        : "bg-white/20"
                      }
                      ${isSpeaking
                        ? "shadow-[0_0_4px_rgba(16,185,129,0.6)]"
                        : ""
                      }
                    `} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* =====================================================
            OVERFLOW TOKEN
            Elegant +N more with drawer-ready structure
        ===================================================== */}
        {remainingCount > 0 && (
          <button
            type="button"
            className="
              group/overflow
              relative
              flex
              shrink-0
              flex-col
              items-center
              justify-center
              rounded-xl
              bg-[#0a0a0f]
              border
              border-white/[0.06]
              transition-all
              duration-300
              ease-out
              cursor-pointer
              snap-start
              snap-always
              hover:border-white/[0.12]
              hover:bg-white/[0.02]
              hover:shadow-lg
              hover:shadow-black/30
              active:scale-[0.97]

              /* Mobile sizing */
              w-[152px]
              aspect-[16/10]

              /* Desktop sizing */
              sm:w-full
              sm:aspect-auto
              sm:h-[100px]
              md:h-[110px]
              lg:h-[120px]
              xl:h-[128px]
              sm:flex-row
              sm:gap-3
              sm:px-4
              sm:justify-start
            "
            onClick={() => {
              /* Drawer expansion trigger — ready for implementation */
              console.log("Expand participant drawer:", remainingCount);
            }}
          >
            {/* Subtle ambient glow */}
            <div className="
              absolute
              inset-0
              rounded-xl
              bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.015),transparent_70%)]
              transition-opacity
              duration-300
              opacity-0
              group-hover/overflow:opacity-100
            " />

            {/* Count circle */}
            <div className="
              relative
              z-10
              flex
              h-9
              w-9
              sm:h-10
              sm:w-10
              items-center
              justify-center
              rounded-full
              bg-white/[0.04]
              border
              border-white/[0.08]
              transition-colors
              duration-200
              group-hover/overflow:bg-white/[0.08]
              group-hover/overflow:border-white/[0.12]
              shrink-0
            ">
              <span className="
                text-xs
                sm:text-sm
                font-bold
                text-white/70
                tabular-nums
                group-hover/overflow:text-white/90
                transition-colors
                duration-200
              ">
                +{remainingCount}
              </span>
            </div>

            {/* Label */}
            <div className="
              relative
              z-10
              mt-2
              text-center
              sm:mt-0
              sm:text-left
            ">
              <p className="
                text-[11px]
                sm:text-xs
                font-semibold
                text-white/50
                group-hover/overflow:text-white/70
                transition-colors
                duration-200
              ">
                More
              </p>
              <p className="
                hidden
                sm:block
                text-[10px]
                text-white/25
                mt-0.5
              ">
                {remainingCount} {remainingCount === 1 ? "participant" : "participants"} hidden
              </p>
            </div>

            {/* Expand icon */}
            <svg
              className="
                absolute
                bottom-2.5
                right-2.5
                sm:static
                sm:ml-auto
                w-4
                h-4
                text-white/20
                group-hover/overflow:text-white/40
                transition-all
                duration-200
                sm:translate-x-0
                group-hover/overflow:translate-x-0.5
              "
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>

      {/* =====================================================
          EDGE FADE GRADIENTS
          Directional based on scroll orientation
          Prevents harsh scroll cutoffs
      ===================================================== */}

      {/* Mobile: right edge fade (horizontal scroll) */}
      <div className="
        pointer-events-none
        absolute
        inset-y-0
        right-0
        z-20
        w-10
        bg-gradient-to-l
        from-[#0a0a0f]/80
        via-[#0a0a0f]/40
        to-transparent
        sm:hidden
      " />

      {/* Mobile: left edge fade */}
      <div className="
        pointer-events-none
        absolute
        inset-y-0
        left-0
        z-20
        w-6
        bg-gradient-to-r
        from-[#0a0a0f]/60
        to-transparent
        sm:hidden
      " />

      {/* Desktop: bottom edge fade (vertical scroll) */}
      <div className="
        pointer-events-none
        absolute
        inset-x-0
        bottom-0
        z-20
        hidden
        sm:block
        h-10
        bg-gradient-to-t
        from-[#0a0a0f]/80
        via-[#0a0a0f]/40
        to-transparent
      " />

      {/* Desktop: top edge fade */}
      <div className="
        pointer-events-none
        absolute
        inset-x-0
        top-0
        z-20
        hidden
        sm:block
        h-6
        bg-gradient-to-b
        from-[#0a0a0f]/60
        to-transparent
      " />
    </div>
  );
};

export default React.memo(
  FilmStrip
);