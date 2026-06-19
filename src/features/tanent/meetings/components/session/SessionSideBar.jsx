import React from "react";

import {
  X,
  MessageSquare,
  Users,
} from "lucide-react";

import ParticipantsPanel from "./ParticipantsPanel";
import ChatPanel from "./ChatPanel";

const SessionSidebar = ({
  activeTab,
  onChangeTab,
  participants,
  meetingId,
  currentUserId,
  onClose,
  mobile = false,
}) => {

  return (

    <div
      className={`
        h-full
        flex
        flex-col
       bg-slate-950
         border-slate-800
        overflow-hidden
        touch-pan-y
        ${
          mobile
        ? `
            w-full
            h-full
            bg-slate-950
            `
            : `
                w-[340px]
                border-l
                shadow-2xl
                backdrop-blur-xl
              `
        }
      `}
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className="
          shrink-0
          h-16
          border-b
          border-slate-800
          px-4
          flex
          items-center
          justify-between
          bg-slate-900/80
          backdrop-blur-xl
        "
      >

        {/* TITLE */}
        <div>

          <h2 className="text-sm font-semibold text-white">

            Meeting Panel

          </h2>

          <p className="text-xs text-slate-400 mt-0.5">

            Chat & Participants

          </p>

        </div>

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="
            md:hidden
            w-10
            h-10
            rounded-2xl
            bg-slate-800
            hover:bg-slate-700
            transition-colors
            flex
            items-center
            justify-center
          "
        >

          <X className="w-5 h-5 text-white" />

        </button>

      </div>

      {/* =================================================
          TABS
      ================================================= */}

      <div
        className="
          shrink-0
          px-4
          py-3
          border-b
          border-slate-800
          bg-slate-950
        "
      >

        <div
          className="
            grid
            grid-cols-2
            gap-2
            p-1
            rounded-2xl
            bg-slate-900
            border
            border-slate-800
          "
        >

          {/* PARTICIPANTS */}
          <button
            onClick={() =>
              onChangeTab(
                "participants"
              )
            }
            className={`
              h-11
              rounded-xl
              text-sm
              font-medium
              transition-all
              flex
              items-center
              justify-center
              gap-2
              ${
                activeTab ===
                "participants"

                  ? `
                      bg-slate-800
                      text-white
                      shadow-lg
                    `

                  : `
                      text-slate-400
                      hover:text-white
                      hover:bg-slate-800/50
                    `
              }
            `}
          >

            <Users className="w-4 h-4" />

            Participants

          </button>

          {/* CHAT */}
          <button
            onClick={() =>
              onChangeTab(
                "chat"
              )
            }
            className={`
              h-11
              rounded-xl
              text-sm
              font-medium
              transition-all
              flex
              items-center
              justify-center
              gap-2
              ${
                activeTab ===
                "chat"

                  ? `
                      bg-slate-800
                      text-white
                      shadow-lg
                    `

                  : `
                      text-slate-400
                      hover:text-white
                      hover:bg-slate-800/50
                    `
              }
            `}
          >

            <MessageSquare className="w-4 h-4" />

            Chat

          </button>

        </div>

      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div
        className="
          flex-1
          min-h-0
          overflow-hidden
          bg-slate-950
        "
      >

        {activeTab ===
          "participants" && (

          <ParticipantsPanel
            participants={
              participants
            }
          />

        )}

        {activeTab === "chat" && (
          <ChatPanel
            meetingId={meetingId}
            currentUserId={currentUserId}
          />
        )}

      </div>

    </div>
  );
};

export default React.memo(
  SessionSidebar
);