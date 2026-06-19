import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";

import {
  Pin,
  Minimize2,
  Maximize2,
  GripVertical,
} from "lucide-react";

import VideoTile from "./VideoTile";

// =====================================================
// SELF VIEW — FINAL FIXED VERSION
// Clean minimized badge + proper expanded + working pin
// =====================================================

const SelfView = ({
  participant = null,
  onPinParticipant,
  isPinned,
  minimized: externalMinimized = false,
}) => {

  // =====================================================
  // EARLY EXIT
  // =====================================================
  if (!participant) {
    return null;
  }

  // =====================================================
  // DRAG STATE
  // =====================================================
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 });

  // =====================================================
  // MINIMIZE STATE
  // =====================================================
  const [isMinimized, setIsMinimized] = useState(externalMinimized);

  useEffect(() => {
    setIsMinimized(externalMinimized);
  }, [externalMinimized]);

  // =====================================================
  // PIN STATE
  // =====================================================
  const pinnedState = isPinned?.(participant.sid) || false;

  // =====================================================
  // PIN HANDLER — Works for self
  // =====================================================
  const handlePin = useCallback(() => {
    onPinParticipant?.(participant);
  }, [participant, onPinParticipant]);

  // =====================================================
  // DRAG LOGIC
  // =====================================================
  const handleDragStart = useCallback((e) => {
    if (e.target.closest("button")) return;

    const clientX = e.touches?.[0]?.clientX ?? e.clientX;
    const clientY = e.touches?.[0]?.clientY ?? e.clientY;

    dragStart.current = {
      x: clientX,
      y: clientY,
      posX: position.x,
      posY: position.y,
    };

    setIsDragging(true);
  }, [position]);

  const handleDragMove = useCallback((e) => {
    if (!isDragging) return;

    const clientX = e.touches?.[0]?.clientX ?? e.clientX;
    const clientY = e.touches?.[0]?.clientY ?? e.clientY;

    const deltaX = clientX - dragStart.current.x;
    const deltaY = clientY - dragStart.current.y;

    setPosition({
      x: dragStart.current.posX + deltaX,
      y: dragStart.current.posY + deltaY,
    });
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    window.addEventListener("mousemove", handleDragMove);
    window.addEventListener("mouseup", handleDragEnd);
    window.addEventListener("touchmove", handleDragMove, { passive: false });
    window.addEventListener("touchend", handleDragEnd);

    return () => {
      window.removeEventListener("mousemove", handleDragMove);
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("touchmove", handleDragMove);
      window.removeEventListener("touchend", handleDragEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  const toggleMinimize = useCallback(() => {
    setIsMinimized((prev) => !prev);
  }, []);

  // =====================================================
  // PARTICIPANT INFO
  // =====================================================
  const identity = participant?.identity || participant?.name || "You";
  const isMuted = !participant?.audioTrack || participant?.isMuted;
  const isCameraOff = !participant?.videoTrack || participant?.isCameraOff;

  // =====================================================
  // MINIMIZED MODE — Clean "You" badge (no tiny video)
  // =====================================================
  if (isMinimized) {
    return (
      <div
        className="
          group/mini
          fixed
          z-40
          cursor-pointer
        "
        style={{
        right: `${16 - position.x}px`,
        bottom: `calc(90px - ${position.y}px)`,
        maxWidth: "calc(100vw - 32px)",
        }}
        onClick={toggleMinimize}
      >
        <div className={`
          flex
          items-center
          gap-2
          px-3
          py-2
          rounded-xl
          bg-[#0a0a0f]/90
          border
          shadow-xl
          shadow-black/50
          backdrop-blur-xl
          transition-all
          duration-200
          hover:scale-105
          active:scale-95
          ${pinnedState
            ? "border-amber-500/40"
            : "border-white/[0.12]"
          }
        `}>
          {/* Avatar initial */}
          <div className="
            w-7
            h-7
            rounded-lg
            bg-white/[0.08]
            border
            border-white/[0.1]
            flex
            items-center
            justify-center
            shrink-0
          ">
            <span className="text-xs font-semibold text-white/70">
              {identity.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Name */}
          <span className="text-xs font-medium text-white/80">
            You
          </span>

          {/* Status dot */}
          <span className={`
            w-2
            h-2
            rounded-full
            shrink-0
            ${isMuted
              ? "bg-red-500"
              : "bg-emerald-500"
            }
          `} />
        </div>

        {/* Expand hint */}
        <div className="
          absolute
          -top-7
          left-1/2
          -translate-x-1/2
          px-2
          py-0.5
          rounded
          bg-black/70
          text-[10px]
          text-white/60
          whitespace-nowrap
          opacity-0
          group-hover/mini:opacity-100
          transition-opacity
          pointer-events-none
        ">
          Click to expand
        </div>
      </div>
    );
  }

  // =====================================================
  // EXPANDED MODE — Proper video with clean controls
  // =====================================================
  return (
    <div
      className={`
        group/self
        fixed
        z-40
        max-w-[calc(100vw-24px)]
        ${isDragging ? "cursor-grabbing" : "cursor-grab"}
        select-none
        `}
      style={{
        right: `${16 - position.x}px`,
        bottom: `calc(96px - ${position.y}px)`,
        maxWidth: "calc(100vw - 24px)",
        touchAction: "none",
        }}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
    >
      <div className={`
        relative
        rounded-2xl
        overflow-hidden
        bg-[#0a0a0f]
        border
        shadow-2xl
        shadow-black/50
        backdrop-blur-xl
        transition-all
        duration-300
        ${pinnedState
          ? "border-amber-500/30"
          : "border-white/[0.08] hover:border-white/[0.12]"
        }
        w-36
        h-40
        sm:w-44
        sm:h-28
        md:w-48
        md:h-30
        lg:w-56
        lg:h-32
        xl:w-60
        xl:h-36
      `}>
        {/* Video — VideoTile handles name + pin internally */}
        <div className="absolute inset-0">
          <VideoTile
            participant={participant}
            isPinned={pinnedState}
            onPin={handlePin}
            isLocal={true}
            isSelfView={true}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Hover controls — only buttons, no duplicate text */}
        <div className="
          absolute
          inset-0
          z-30
          opacity-0
          group-hover/self:opacity-100
          transition-opacity
          duration-200
          pointer-events-none
        ">
          {/* Top bar */}
          <div className="
            absolute
            top-0
            inset-x-0
            h-8
            bg-gradient-to-b
            from-black/50
            to-transparent
            pointer-events-auto
            flex
            items-center
            justify-between
            px-2
          ">
            {/* Drag grip */}
            <div className="flex items-center text-white/30 hover:text-white/60">
              <GripVertical className="w-3.5 h-3.5" />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1">
              {/* Pin self */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePin();
                }}
                className={`
                  w-6
                  h-6
                  rounded-md
                  flex
                  items-center
                  justify-center
                  transition-all
                  duration-200
                  ${pinnedState
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-black/40 text-white/50 hover:text-white/80"
                  }
                `}
                title={pinnedState ? "Unpin yourself" : "Pin yourself"}
              >
                <Pin className="w-3 h-3" />
              </button>

              {/* Minimize */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMinimize();
                }}
                className="
                  w-6
                  h-6
                  rounded-md
                  flex
                  items-center
                  justify-center
                  bg-black/40
                  text-white/50
                  hover:text-white/80
                  transition-all
                  duration-200
                "
                title="Minimize"
              >
                <Minimize2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Pinned ring */}
        {pinnedState && (
          <div className="
            absolute
            inset-0
            rounded-2xl
            z-20
            pointer-events-none
            ring-1
            ring-amber-500/20
            ring-inset
          " />
        )}
      </div>
    </div>
  );
};

export default React.memo(
  SelfView
);