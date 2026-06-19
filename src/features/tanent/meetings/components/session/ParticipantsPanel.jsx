import React from "react";

import {
  Crown,
  Mic,
  MicOff,
  Video,
  VideoOff,
} from "lucide-react";

const ParticipantsPanel = ({
  participants = [],
}) => {

  return (

    <div
      className="
        h-full
        overflow-y-auto
        px-3
        py-3
        space-y-2
      "
    >

      {participants.map(
        (participant) => {

          const isConnected =
            participant.presenceStatus ===
            "connected";

          return (

            <div
              key={
                participant.membership_id
              }
              className={`
                relative
                flex
                items-center
                justify-between
                gap-3
                p-3
                rounded-2xl
                border
                transition-all
                duration-200
                ${
                  isConnected

                    ? `
                        bg-slate-800/90
                        border-slate-700
                      `

                    : `
                        bg-slate-900/70
                        border-slate-800
                        opacity-70
                      `
                }
              `}
            >

              {/* =====================================
                  LEFT
              ===================================== */}

              <div
                className="
                  flex
                  items-center
                  gap-3
                  min-w-0
                  flex-1
                "
              >

                {/* AVATAR */}
                <div
                  className="
                    relative
                    shrink-0
                  "
                >

                  <div
                    className={`
                      w-11
                      h-11
                      rounded-2xl
                      flex
                      items-center
                      justify-center
                      text-sm
                      font-semibold
                      text-white
                      ${
                        isConnected

                          ? `
                              bg-indigo-600
                            `

                          : `
                              bg-slate-700
                            `
                      }
                    `}
                  >

                    {participant.username
                      ?.charAt(0)
                      ?.toUpperCase()}

                  </div>

                  {/* ONLINE DOT */}
                  <div
                    className={`
                      absolute
                      -bottom-0.5
                      -right-0.5
                      w-3.5
                      h-3.5
                      rounded-full
                      border-2
                      border-slate-950
                      ${
                        isConnected
                          ? `
                              bg-emerald-500
                            `
                          : `
                              bg-slate-500
                            `
                      }
                    `}
                  />

                </div>

                {/* USER INFO */}
                <div
                  className="
                    min-w-0
                    flex-1
                  "
                >

                  {/* NAME */}
                  <div
                    className="
                      flex
                      items-center
                      gap-1.5
                    "
                  >

                    <p
                      className="
                        text-sm
                        font-semibold
                        text-white
                        truncate
                      "
                    >

                      {participant.username}

                    </p>

                    {participant.role ===
                      "host" && (

                      <Crown
                        className="
                          w-3.5
                          h-3.5
                          text-amber-400
                          shrink-0
                        "
                      />

                    )}

                  </div>

                  {/* STATUS */}
                  <div
                    className="
                      mt-1
                      flex
                      items-center
                      gap-2
                      flex-wrap
                    "
                  >

                    {/* ROLE */}
                    <span
                      className="
                        text-[11px]
                        text-slate-400
                        capitalize
                      "
                    >

                      {participant.role}

                    </span>

                    {/* STATUS */}
                    <span
                      className={`
                        text-[11px]
                        font-medium
                        ${
                          isConnected

                            ? `
                                text-emerald-400
                              `

                            : `
                                text-slate-500
                              `
                        }
                      `}
                    >

                      {isConnected
                        ? "Connected"
                        : "Not Joined"}

                    </span>

                    {/* SPEAKING */}
                    {participant.isSpeaking && (

                      <span
                        className="
                          text-[11px]
                          font-medium
                          text-indigo-400
                          animate-pulse
                        "
                      >

                        Speaking

                      </span>

                    )}

                  </div>

                </div>

              </div>

              {/* =====================================
                  RIGHT
              ===================================== */}

              <div
                className="
                  flex
                  items-center
                  gap-2
                  shrink-0
                "
              >

                {/* MIC */}
                <div
                  className={`
                    w-8
                    h-8
                    rounded-xl
                    flex
                    items-center
                    justify-center
                    ${
                      participant.micEnabled

                        ? `
                            bg-slate-700
                            text-white
                          `

                        : `
                            bg-red-500/15
                            text-red-400
                          `
                    }
                  `}
                >

                  {participant.micEnabled ? (

                    <Mic className="w-4 h-4" />

                  ) : (

                    <MicOff className="w-4 h-4" />

                  )}

                </div>

                {/* CAMERA */}
                <div
                  className={`
                    w-8
                    h-8
                    rounded-xl
                    flex
                    items-center
                    justify-center
                    ${
                      participant.cameraEnabled

                        ? `
                            bg-slate-700
                            text-white
                          `

                        : `
                            bg-slate-800
                            text-slate-500
                          `
                    }
                  `}
                >

                  {participant.cameraEnabled ? (

                    <Video className="w-4 h-4" />

                  ) : (

                    <VideoOff className="w-4 h-4" />

                  )}

                </div>

              </div>

            </div>
          );
        }
      )}

      {/* EMPTY */}
      {!participants.length && (

        <div
          className="
            h-full
            flex
            items-center
            justify-center
            text-center
            px-6
          "
        >

          <div>

            <p
              className="
                text-sm
                text-slate-400
              "
            >

              No participants yet

            </p>

          </div>

        </div>

      )}

    </div>
  );
};

export default React.memo(
  ParticipantsPanel
);