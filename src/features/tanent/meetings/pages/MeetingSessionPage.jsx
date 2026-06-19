import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import SessionHeader from "../components/session/SessionHeader";

import SessionVideoGrid from "../components/session/SessionVideoGrid";

import SessionSidebar from "../components/session/SessionSideBar";

import SessionControls from "../components/session/SessionControle";

import {
  useGetMeetingDetailQuery,
} from "../api/meetingsApi";

import {
  useMeetingSessionActions,
} from "../hooks/useMeetingSessionActions";

import {
  useLiveKitRoom,
} from "../hooks/useLivekitRoom";

import {
  MeetingRealtimeProvider,
} from "../realtime/MeetingRealtimeContext";

import {
  useMeetingRealtime,
} from "../realtime/useMeetingRealtime";

import MeetingSocketListener from "../realtime/MeetingSocketLister";

// =====================================================
// SESSION CONTENT
// =====================================================

const MeetingSessionContent =
  () => {

    // =================================================
    // PARAMS
    // =================================================

    const { meetingId } =
      useParams();

    const navigate =
      useNavigate();

    // =================================================
    // REALTIME
    // =================================================

    const {

      onlineParticipantIds,

    } =
      useMeetingRealtime();

    // =================================================
    // REFS
    // =================================================

    const hasJoinedRef =
      useRef(false);

    const hasLeavingRef =
      useRef(false);

    // =================================================
    // DATA
    // =================================================

    const {
      data: meeting,
      isLoading,
      error,
    } =
      useGetMeetingDetailQuery(
        meetingId
      );

    // =================================================
    // SESSION ACTIONS
    // =================================================

    const {

      handleJoinSession,

      handleLeaveSession,

      handleEndSession,

    } =
      useMeetingSessionActions(
        meetingId
      );

    // =================================================
    // RTC CONNECTION
    // =================================================

    const [
      rtcConnection,
      setRtcConnection,
    ] = useState(null);

    const [
      isJoining,
      setIsJoining,
    ] = useState(true);

    // =================================================
    // UI STATE
    // =================================================

    const [
      activeSidebar,
      setActiveSidebar,
    ] = useState(
      "participants"
    );

    const [
      sidebarOpen,
      setSidebarOpen,
    ] = useState(true);

    // =================================================
    // JOIN SESSION
    // =================================================

    useEffect(() => {

      if (
        !meetingId ||
        hasJoinedRef.current
      ) {
        return;
      }

      hasJoinedRef.current =
        true;

      const joinSession =
        async () => {

          try {

            setIsJoining(true);

            console.log(
              "[SESSION] JOINING..."
            );

            const response =
              await handleJoinSession();

            const rtc =
              response?.rtc ||
              response?.data?.rtc;

            if (!rtc) {

              throw new Error(
                "RTC connection missing."
              );
            }

            console.log(
              "[RTC TOKEN RECEIVED]",
              rtc
            );

            setRtcConnection(
              rtc
            );

          } catch (error) {

            console.error(
              "[JOIN SESSION ERROR]",
              error
            );

            navigate(
              `/app/meetings/${meetingId}`
            );

          } finally {

            setIsJoining(false);
          }
        };

      joinSession();

    }, [
      meetingId,
      handleJoinSession,
      navigate,
    ]);

    // =================================================
    // LIVEKIT ROOM
    // =================================================

    const {

      room,

      participants,

      localParticipant,

      isConnected,

      isConnecting,

      disconnectRoom,

    } =
      useLiveKitRoom({

        wsUrl:
          rtcConnection?.ws_url,

        token:
          rtcConnection?.token,
      });

    // =================================================
    // STABLE RTC PARTICIPANTS
    // =================================================

    const stableParticipants =
      useMemo(
        () =>
          participants.filter(
            Boolean
          ),
        [participants]
      );

    // =================================================
    // MERGED PARTICIPANTS
    // =================================================

    const mergedParticipants =
      useMemo(() => {

        // =============================================
        // RTC MAP
        // =============================================

        const rtcMap =
          new Map();

        stableParticipants.forEach(
          (participant) => {

            const identity =
              participant.identity;

            if (!identity) {
              return;
            }

            rtcMap.set(
              String(identity),
              participant
            );
          }
        );

        // =============================================
        // MERGE
        // =============================================

        return (
          meeting?.participants || []
        ).map(
          (participant) => {

            const membershipId =
              String(
                participant.membership_id
              );

            const rtcParticipant =
              rtcMap.get(
                membershipId
              );

            const isOnline =
              onlineParticipantIds.includes(
                participant.membership_id
              );

            return {

              ...participant,

              // =======================================
              // REALTIME PRESENCE
              // =======================================

              presenceStatus:
                isOnline
                  ? "connected"
                  : "not_joined",

              is_present:
                isOnline,

              // =======================================
              // RTC
              // =======================================

              rtcConnected:
                Boolean(
                  rtcParticipant
                ),

              micEnabled:
                rtcParticipant
                  ? rtcParticipant.isMicrophoneEnabled
                  : false,

              cameraEnabled:
                rtcParticipant
                  ? rtcParticipant.isCameraEnabled
                  : false,

              isSpeaking:
                rtcParticipant
                  ? rtcParticipant.isSpeaking
                  : false,
            };
          }
        );

      }, [
        meeting,
        stableParticipants,
        onlineParticipantIds,
      ]);

    // =================================================
    // LEAVE SESSION
    // =================================================

    const handleLeave =
      useCallback(
        async () => {

          if (
            hasLeavingRef.current
          ) {
            return;
          }

          hasLeavingRef.current =
            true;

          try {

            console.log(
              "[SESSION] LEAVING..."
            );

            await disconnectRoom();

            await handleLeaveSession();

          } catch (error) {

            console.error(
              "[LEAVE SESSION ERROR]",
              error
            );

          } finally {

            navigate(
              `/app/meetings/${meetingId}`
            );
          }
        },
        [
          disconnectRoom,
          handleLeaveSession,
          navigate,
          meetingId,
        ]
      );

    // =================================================
    // END SESSION
    // =================================================

    const handleMeetingEnd =
      useCallback(
        async () => {

          try {

            console.log(
              "[SESSION] ENDING..."
            );

            await disconnectRoom();

            await handleEndSession();

          } catch (error) {

            console.error(
              "[END SESSION ERROR]",
              error
            );

          } finally {

            navigate(
              `/app/meetings/${meetingId}`
            );
          }
        },
        [
          disconnectRoom,
          handleEndSession,
          navigate,
          meetingId,
        ]
      );

    // =================================================
    // LOADING
    // =================================================

    if (
      isLoading ||
      isJoining
    ) {

      return (
        <div className="h-screen bg-slate-950 flex items-center justify-center">

          <div className="text-center">

            <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />

            <p className="text-sm text-slate-400">

              Connecting to meeting...

            </p>

          </div>

        </div>
      );
    }

    // =================================================
    // ERROR
    // =================================================

    if (
      error ||
      !meeting
    ) {

      return (
        <div className="h-screen bg-slate-950 flex items-center justify-center">

          <div className="text-center">

            <h2 className="text-lg font-semibold text-white">

              Session unavailable

            </h2>

            <p className="text-sm text-slate-400 mt-2">

              Unable to access this meeting session.

            </p>

          </div>

        </div>
      );
    }

    // =================================================
    // RENDER
    // =================================================

    return (

      <div className="h-screen bg-slate-950 flex flex-col overflow-hidden">

        <SessionHeader
          meeting={meeting}
          isConnected={isConnected}
          participantCount={
            stableParticipants.length
          }
        />

        <div className="flex-1 flex overflow-hidden min-h-0">

          <div className="flex-1 min-w-0 overflow-hidden">

            <SessionVideoGrid
              participants={
                stableParticipants
              }
              localParticipant={
                localParticipant
              }
            />

          </div>

          {/* MOBILE SIDEBAR */}
          {sidebarOpen && (

            <div
              className="
                fixed
                inset-0
                z-50
                bg-black/60
                backdrop-blur-sm
                lg:hidden
              "
              onClick={() =>
                setSidebarOpen(false)
              }
            >

              <div
                className="
                  absolute
                  inset-y-0
                  right-0
                  w-full
                  h-full
                "
                onClick={(e) =>
                  e.stopPropagation()
                }
              >

                <SessionSidebar
                  activeTab={activeSidebar}
                  onChangeTab={setActiveSidebar}
                  participants={mergedParticipants}
                  meetingId={meetingId}
                  currentUserId={
                    meeting?.current_membership_id
                  }
                  mobile={true}
                  onClose={() =>
                    setSidebarOpen(false)
                  }
                />

              </div>

            </div>
          )}

          {/* DESKTOP SIDEBAR */}
          {sidebarOpen && (

            <div className="hidden lg:flex">

              <SessionSidebar
                activeTab={
                  activeSidebar
                }
                onChangeTab={
                  setActiveSidebar
                }
                participants={
                  mergedParticipants
                }
                meetingId={meetingId}
                currentUserId={
                  meeting?.current_membership_id
                }
              />

            </div>
          )}

        </div>

        <SessionControls
          permissions={{
            canEnd:
              meeting?.can_end_session,
          }}
          room={room}
          sidebarOpen={
            sidebarOpen
          }
          onToggleSidebar={() =>
            setSidebarOpen(
              (prev) => !prev
            )
          }
          onLeave={
            handleLeave
          }
          onEndSession={
            handleMeetingEnd
          }
        />

        {/* RECONNECTING */}
        {isConnecting && (

          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

            <div className="px-6 py-4 rounded-2xl bg-slate-900 border border-slate-800">

              <p className="text-sm text-slate-300">

                Reconnecting...

              </p>

            </div>

          </div>

        )}

      </div>
    );
  };

// =====================================================
// PAGE WRAPPER
// =====================================================

const MeetingSessionPage =
  () => {

    const { meetingId } =
      useParams();

    return (

      <MeetingRealtimeProvider>

        <MeetingSocketListener
          meetingId={meetingId}
        />

        <MeetingSessionContent />

      </MeetingRealtimeProvider>
    );
  };

export default React.memo(
  MeetingSessionPage
);