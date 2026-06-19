import React, {
  useEffect,
  useRef,
} from "react";

import {
  Mic,
  MicOff,
  MonitorUp,
  Pin,
  VideoOff,
} from "lucide-react";

import {
  useParticipantTracks,
} from "../../hooks/useParticipantsTrack";

// =====================================================
// VIDEO TILE — PREMIUM REDESIGN
// Only UI/UX changed. ALL RTC logic preserved.
// =====================================================

const VideoTile = ({
  participant,
  isPinned = false,
  onPin,
  isStageView = false,
  isFilmStrip = false,
  isSelfView = false,
}) => {

  // =====================================================
  // REFS — Preserved
  // =====================================================
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  // =====================================================
  // TRACKS — Preserved
  // =====================================================
  const {
    videoTrack,
    audioTrack,
    isMicEnabled,
    isCameraEnabled,
    isScreenSharing,
    isSpeaking,
    isLocal,
  } = useParticipantTracks(participant);

  // =====================================================
  // PARTICIPANT INFO — Preserved
  // =====================================================
  const participantName = participant?.name || participant?.identity || "Participant";

  // =====================================================
  // VIDEO ATTACH — Preserved
  // =====================================================
  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;
    element.srcObject = null;
    if (!videoTrack) return;

    try {
      console.log("[VIDEO ATTACH]", { participant: participantName, source: videoTrack.source });
      videoTrack.attach(element);
    } catch (error) {
      console.error("[VIDEO ATTACH ERROR]", error);
    }

    return () => {
      try {
        videoTrack.detach(element);
        element.srcObject = null;
      } catch (error) {
        console.error("[VIDEO DETACH ERROR]", error);
      }
    };
  }, [videoTrack, participantName]);

  // =====================================================
  // AUDIO ATTACH — Preserved
  // =====================================================
  useEffect(() => {
    const element = audioRef.current;
    if (!element) return;
    element.srcObject = null;
    if (!audioTrack) return;

    try {
      audioTrack.attach(element);
    } catch (error) {
      console.error("[AUDIO ATTACH ERROR]", error);
    }

    return () => {
      try {
        audioTrack.detach(element);
        element.srcObject = null;
      } catch (error) {
        console.error("[AUDIO DETACH ERROR]", error);
      }
    };
  }, [audioTrack]);

  // =====================================================
  // VIDEO MODE — Preserved
  // =====================================================
  const videoFitClass = isScreenSharing
    ? "object-contain bg-black"
    : isStageView
      ? "object-cover"
      : isFilmStrip
        ? "object-cover"
        : isSelfView
          ? "object-cover"
          : "object-cover";

  // =====================================================
  // VIDEO ENABLED — Preserved
  // =====================================================
  const hasVisibleVideo = isScreenSharing || isCameraEnabled;

  // =====================================================
  // RENDER — REDESIGNED UI ONLY
  // =====================================================
  return (
    <div
      className={`
        relative
        group
        w-full
        h-full
        overflow-hidden
        rounded-2xl
        bg-[#0a0a0f]
        border
        transition-all
        duration-300
        ${isSpeaking
          ? "ring-2 ring-emerald-400/50 shadow-[0_0_24px_rgba(16,185,129,0.15)]"
          : ""
        }
        ${isPinned
          ? "border-amber-500/40 shadow-[0_0_16px_rgba(245,158,11,0.1)]"
          : "border-white/[0.06] hover:border-white/[0.1]"
        }
      `}
    >
      {/* AUDIO — Preserved */}
      <audio ref={audioRef} autoPlay />

      {/* VIDEO — Preserved */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className={`
          absolute
          inset-0
          w-full
          h-full
          transition-all
          duration-300
          ${videoFitClass}
          ${hasVisibleVideo ? "block" : "hidden"}
          ${isLocal && !isScreenSharing ? "scale-x-[-1]" : ""}
        `}
      />

      {/* =====================================================
          FALLBACK — REDESIGNED
      ===================================================== */}
      {!hasVisibleVideo && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900/80 to-[#0a0a0f]">
          <div className="
            w-20 h-20 rounded-2xl bg-white/[0.04] border border-white/[0.08]
            flex items-center justify-center mb-4
            shadow-lg shadow-black/20
          ">
            <span className="text-2xl font-bold text-white/40">
              {participantName?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <p className="text-sm font-medium text-white/60">{participantName}</p>
          <div className="
            mt-3 flex items-center gap-2 px-3 py-1.5 rounded-full
            bg-white/[0.04] border border-white/[0.06] text-xs text-white/40
          ">
            <VideoOff className="w-3.5 h-3.5" />
            Camera Off
          </div>
        </div>
      )}

      {/* =====================================================
          SCREEN SHARE LABEL — REDESIGNED
      ===================================================== */}
      {isScreenSharing && (
        <div className="absolute top-3 left-3 z-20">
          <div className="
            inline-flex items-center gap-2 px-3 py-2 rounded-xl
            bg-emerald-500/15 backdrop-blur-xl border border-emerald-400/20
            text-emerald-300 text-xs font-semibold shadow-lg
          ">
            <MonitorUp className="w-3.5 h-3.5" />
            Presenting Screen
          </div>
        </div>
      )}

      {/* =====================================================
          PINNED BADGE — REDESIGNED
          Premium amber badge when pinned
      ===================================================== */}
      {isPinned && (
        <div className="absolute top-3 left-3 z-20">
          <div className="
            inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
            bg-amber-500/15 backdrop-blur-xl border border-amber-400/20
            text-amber-300 text-xs font-semibold shadow-lg
          ">
            <Pin className="w-3 h-3 rotate-45" />
            Pinned
          </div>
        </div>
      )}

      {/* =====================================================
          PIN TOGGLE BUTTON — REDESIGNED
          Premium hover button
      ===================================================== */}
      {!isSelfView && (
        <button
          onClick={() => onPin?.(participant.sid)}
          className={`
            absolute
            top-3
            right-3
            z-20
            transition-all
            duration-200
            w-9
            h-9
            rounded-xl
            backdrop-blur-xl
            border
            flex
            items-center
            justify-center
            shadow-lg
            ${isPinned
              ? `
                opacity-100
                bg-amber-500/20
                border-amber-400/30
                text-amber-400
                scale-100
              `
              : `
                opacity-0
                group-hover:opacity-100
                bg-black/50
                border-white/[0.08]
                text-white/60
                hover:text-white/90
                hover:bg-black/70
                hover:scale-105
              `
            }
          `}
          title={isPinned ? "Unpin participant" : "Pin participant"}
        >
          <Pin
            className={`
              w-4 h-4
              transition-transform duration-200
              ${isPinned ? "rotate-45" : ""}
            `}
          />
        </button>
      )}

      {/* =====================================================
          BOTTOM BAR — REDESIGNED
          Premium glassmorphism bar
      ===================================================== */}
      <div className="
        absolute
        bottom-0
        inset-x-0
        z-20
        p-3
      ">
        {/* Gradient background for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />

        <div className="relative flex items-end justify-between gap-2">
          {/* USER INFO */}
          <div className="
            flex
            items-center
            gap-2
            px-3
            py-2
            rounded-xl
            bg-black/40
            backdrop-blur-xl
            border
            border-white/[0.06]
            max-w-[75%]
          ">
            {/* Speaking dot */}
            <div className={`
              w-2
              h-2
              rounded-full
              shrink-0
              transition-all
              duration-200
              ${isSpeaking
                ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]"
                : "bg-white/20"
              }
            `} />

            {/* Name */}
            <p className="text-sm font-medium text-white/90 truncate">
              {participantName}
            </p>

            {/* You label */}
            {isLocal && (
              <span className="
                text-[10px]
                font-semibold
                text-amber-400/80
                bg-amber-500/10
                px-1.5
                py-0.5
                rounded
                uppercase
                tracking-wider
                shrink-0
              ">
                You
              </span>
            )}
          </div>

          {/* MEDIA INDICATORS */}
          <div className="flex items-center gap-1.5">
            {/* Mic */}
            <div className={`
              w-8
              h-8
              rounded-lg
              backdrop-blur-xl
              border
              flex
              items-center
              justify-center
              transition-colors
              duration-200
              ${isMicEnabled
                ? "bg-black/40 border-white/[0.06] text-white/60"
                : "bg-red-500/20 border-red-400/30 text-red-400"
              }
            `}>
              {isMicEnabled ? (
                <Mic className="w-3.5 h-3.5" />
              ) : (
                <MicOff className="w-3.5 h-3.5" />
              )}
            </div>

            {/* Camera */}
            {!isCameraEnabled && !isScreenSharing && (
              <div className="
                w-8
                h-8
                rounded-lg
                bg-red-500/20
                border
                border-red-400/30
                flex
                items-center
                justify-center
                text-red-400
              ">
                <VideoOff className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(VideoTile);