import React, {
  useMemo,
} from "react";

import VideoTile from "./VideoTile";

const VideoGrid = ({
  participants = [],
  pinnedParticipant = null,
  onPinParticipant,
}) => {

  // =====================================================
  // STABLE PARTICIPANTS
  // =====================================================

  const stableParticipants =
    useMemo(() => {

      if (
        !pinnedParticipant
      ) {
        return participants;
      }

      // ===============================================
      // PINNED FIRST
      // ===============================================

      const pinned =
        participants.find(
          (participant) =>
            participant.sid ===
            pinnedParticipant.sid
        );

      const others =
        participants.filter(
          (participant) =>
            participant.sid !==
            pinnedParticipant.sid
        );

      return pinned
        ? [
            pinned,
            ...others,
          ]
        : participants;

    }, [
      participants,
      pinnedParticipant,
    ]);

  // =====================================================
  // GRID LAYOUT
  // =====================================================

  const gridLayout =
    useMemo(() => {

      const count =
        stableParticipants.length;

      // ===============================================
      // PINNED MODE
      // ===============================================

      if (
        pinnedParticipant
      ) {

        return (
          "grid-cols-1 " +
          "lg:grid-cols-4"
        );
      }

      // ===============================================
      // 1 PARTICIPANT
      // ===============================================

      if (count === 1) {

        return (
          "grid-cols-1 " +
          "max-w-6xl " +
          "mx-auto"
        );
      }

      // ===============================================
      // 2 - 4
      // ===============================================

      if (count <= 4) {

        return (
          "grid-cols-1 " +
          "md:grid-cols-2"
        );
      }

      // ===============================================
      // 5 - 9
      // ===============================================

      if (count <= 9) {

        return (
          "grid-cols-2 " +
          "xl:grid-cols-3"
        );
      }

      // ===============================================
      // 10+
      // ===============================================

      return (
        "grid-cols-2 " +
        "lg:grid-cols-3 " +
        "2xl:grid-cols-4"
      );

    }, [
      stableParticipants.length,
      pinnedParticipant,
    ]);

  // =====================================================
  // EMPTY
  // =====================================================

  if (
    stableParticipants.length === 0
  ) {

    return (
      <div className="h-full flex items-center justify-center p-6">

        <div className="text-center">

          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 mx-auto mb-4 flex items-center justify-center">

            <span className="text-2xl">
              🎥
            </span>

          </div>

          <h3 className="text-base font-semibold text-white">

            Waiting for participants

          </h3>

          <p className="text-sm text-slate-400 mt-1">

            Participants will appear here once they join.

          </p>

        </div>
      </div>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="h-full overflow-hidden">

      <div
        className={`
          h-full
          grid
          ${gridLayout}
          gap-4
          p-4
          auto-rows-fr
          place-items-stretch
        `}
      >

        {stableParticipants.map(
          (
            participant,
            index
          ) => {

            const isPinned =
              pinnedParticipant?.sid ===
              participant.sid;

            return (

              <div
                key={
                  participant.sid
                }
                className={`
                  min-h-0
                  min-w-0
                  transition-all
                  duration-300
                  ${
                    isPinned
                      ? `
                          lg:col-span-3
                          lg:row-span-2
                        `
                      : ""
                  }
                `}
              >

                <VideoTile
                  participant={
                    participant
                  }
                  isPinned={
                    isPinned
                  }
                  onPin={
                    onPinParticipant
                  }
                  priority={
                    index <= 3
                  }
                />

              </div>
            );
          }
        )}

      </div>
    </div>
  );
};

export default React.memo(
  VideoGrid
);