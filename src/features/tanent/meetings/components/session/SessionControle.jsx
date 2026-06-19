import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

import {
  ParticipantEvent,
} from "livekit-client";

import {
  Mic,
  MicOff,
  Video,
 VideoOff,
  MonitorUp,
  MonitorX,
  MessageSquare,
  Users,
  PhoneOff,
} from "lucide-react";

const SessionControls = ({
  permissions,
  room,
  sidebarOpen,
  onToggleSidebar,
  onLeave,
  onEndSession,
}) => {

  // =====================================================
  // LOCAL PARTICIPANT
  // =====================================================

  const localParticipant =
    room?.localParticipant;

  // =====================================================
  // STATE
  // =====================================================

  const [
    mediaState,
    setMediaState,
  ] = useState({

    isMicEnabled: false,

    isCameraEnabled: false,

    isScreenSharing: false,

    isBusy: false,
  });

  // =====================================================
  // SYNC MEDIA STATE
  // =====================================================

  useEffect(() => {

    if (!localParticipant) {
      return;
    }

    const syncState = () => {

      setMediaState(
        (prev) => {

          const next = {

            ...prev,

            isMicEnabled:
              localParticipant.isMicrophoneEnabled,

            isCameraEnabled:
              localParticipant.isCameraEnabled,

            isScreenSharing:
              localParticipant.isScreenShareEnabled,
          };

          // =============================================
          // PREVENT USELESS RERENDERS
          // =============================================

          const unchanged =

            prev.isMicEnabled ===
              next.isMicEnabled &&

            prev.isCameraEnabled ===
              next.isCameraEnabled &&

            prev.isScreenSharing ===
              next.isScreenSharing;

          return unchanged
            ? prev
            : next;
        }
      );
    };

    // ===================================================
    // INITIAL
    // ===================================================

    syncState();

    // ===================================================
    // EVENTS
    // ===================================================

    localParticipant.on(
      ParticipantEvent.TrackMuted,
      syncState
    );

    localParticipant.on(
      ParticipantEvent.TrackUnmuted,
      syncState
    );

    localParticipant.on(
      ParticipantEvent.LocalTrackPublished,
      syncState
    );

    localParticipant.on(
      ParticipantEvent.LocalTrackUnpublished,
      syncState
    );

    // ===================================================
    // CLEANUP
    // ===================================================

    return () => {

      localParticipant.off(
        ParticipantEvent.TrackMuted,
        syncState
      );

      localParticipant.off(
        ParticipantEvent.TrackUnmuted,
        syncState
      );

      localParticipant.off(
        ParticipantEvent.LocalTrackPublished,
        syncState
      );

      localParticipant.off(
        ParticipantEvent.LocalTrackUnpublished,
        syncState
      );
    };

  }, [localParticipant]);

  // =====================================================
  // SAFE ACTION WRAPPER
  // =====================================================

  const runMediaAction =
    useCallback(
      async (callback) => {

        if (
          !localParticipant ||
          mediaState.isBusy
        ) {
          return;
        }

        try {

          setMediaState(
            (prev) => ({
              ...prev,
              isBusy: true,
            })
          );

          await callback();

        } catch (error) {

          console.error(
            "[MEDIA ACTION ERROR]",
            error
          );

        } finally {

          setTimeout(() => {

            setMediaState(
              (prev) => ({
                ...prev,
                isBusy: false,
              })
            );

          }, 200);
        }
      },
      [
        localParticipant,
        mediaState.isBusy,
      ]
    );

  // =====================================================
  // MIC
  // =====================================================

  const handleToggleMic =
    useCallback(
      async () => {

        await runMediaAction(
          async () => {

            await localParticipant.setMicrophoneEnabled(
              !mediaState.isMicEnabled
            );
          }
        );

      },
      [
        localParticipant,
        mediaState.isMicEnabled,
        runMediaAction,
      ]
    );

  // =====================================================
  // CAMERA
  // =====================================================

  const handleToggleCamera =
    useCallback(
      async () => {

        await runMediaAction(
          async () => {

            await localParticipant.setCameraEnabled(
              !mediaState.isCameraEnabled
            );
          }
        );

      },
      [
        localParticipant,
        mediaState.isCameraEnabled,
        runMediaAction,
      ]
    );

  // =====================================================
  // SCREEN SHARE
  // =====================================================

  const handleToggleScreenShare =
    useCallback(
      async () => {

        await runMediaAction(
          async () => {

            await localParticipant.setScreenShareEnabled(
              !mediaState.isScreenSharing
            );
          }
        );

      },
      [
        localParticipant,
        mediaState.isScreenSharing,
        runMediaAction,
      ]
    );

  // =====================================================
  // SIDEBAR ICON
  // =====================================================

  const SidebarIcon =
    useMemo(
      () => (
        sidebarOpen
          ? MessageSquare
          : Users
      ),
      [sidebarOpen]
    );

  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div
      className="
        shrink-0
        border-t
        border-slate-800
        bg-slate-950/95
        backdrop-blur-xl
        px-3
        py-3
        pb-[max(12px,env(safe-area-inset-bottom))]
      "
    >

      <div
        className="
          mx-auto
          flex
          w-full
          max-w-4xl
          items-center
          justify-center
        "
      >

        <div
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            overflow-x-auto
            rounded-3xl
            border
            border-slate-800
            bg-slate-900/90
            p-2
            shadow-2xl
            backdrop-blur-xl

            sm:w-auto
            sm:gap-3
            sm:px-4
            sm:py-3
          "
        >

          {/* MIC */}
          <ControlButton
            active={
              mediaState.isMicEnabled
            }
            activeIcon={Mic}
            inactiveIcon={MicOff}
            onClick={
              handleToggleMic
            }
            disabled={
              !localParticipant ||
              mediaState.isBusy
            }
          />

          {/* CAMERA */}
          <ControlButton
            active={
              mediaState.isCameraEnabled
            }
            activeIcon={Video}
            inactiveIcon={VideoOff}
            onClick={
              handleToggleCamera
            }
            disabled={
              !localParticipant ||
              mediaState.isBusy
            }
          />

          {/* SCREEN SHARE */}
          <ControlButton
            active={
              mediaState.isScreenSharing
            }
            activeIcon={MonitorUp}
            inactiveIcon={MonitorX}
            onClick={
              handleToggleScreenShare
            }
            disabled={
              !localParticipant ||
              mediaState.isBusy
            }
          />

          {/* SIDEBAR */}
          <button
            onClick={
              onToggleSidebar
            }
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-slate-800
              transition-all
              hover:bg-slate-700

              sm:h-12
              sm:w-12
            "
          >

            <SidebarIcon className="h-5 w-5 text-white" />

          </button>

          {/* LEAVE */}
          <button
            onClick={onLeave}
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-red-600
              shadow-lg
              shadow-red-900/30
              transition-all
              hover:bg-red-700

              sm:h-14
              sm:w-14
            "
          >

            <PhoneOff className="h-5 w-5 text-white" />

          </button>

          {/* END SESSION */}
          {permissions?.canEnd && (

            <button
              onClick={
                onEndSession
              }
              className="
                hidden
                h-12
                shrink-0
                items-center
                justify-center
                rounded-2xl
                border
                border-red-800
                bg-red-950
                px-4
                text-sm
                font-semibold
                text-red-200
                transition-all
                hover:bg-red-900

                lg:flex
              "
            >

              End Meeting

            </button>

          )}

        </div>

      </div>

    </div>
  );
};

// =====================================================
// CONTROL BUTTON
// =====================================================

const ControlButton = React.memo(
  ({
    active,
    activeIcon: ActiveIcon,
    inactiveIcon: InactiveIcon,
    onClick,
    disabled = false,
  }) => {

    const Icon =
      active
        ? ActiveIcon
        : InactiveIcon;

    return (

      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          rounded-2xl
          transition-all
          duration-200

          sm:h-12
          sm:w-12

          ${
            active
              ? "bg-slate-800 hover:bg-slate-700"
              : "bg-red-950 hover:bg-red-900"
          }

          ${
            disabled
              ? "cursor-not-allowed opacity-50"
              : ""
          }
        `}
      >

        <Icon
          className={`
            h-5
            w-5
            ${
              active
                ? "text-white"
                : "text-red-300"
            }
          `}
        />

      </button>
    );
  }
);

export default React.memo(
  SessionControls
);