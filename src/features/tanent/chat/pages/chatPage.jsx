import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";

import { motion, AnimatePresence } from "framer-motion";

import {
  MessageCircle,
  Users,
} from "lucide-react";

import ConversationList from "../components/chatList";
import ChatWindow from "../components/chatWindow";
import ChatTopBar from "../components/ChatTopBar";

export default function ChatPage() {

  const { conversationId } = useParams();

  const navigate = useNavigate();

  const [selectedConversation, setSelectedConversation] =
    useState(null);

  const [isMobile, setIsMobile] =
    useState(false);

  // =====================================================
  // SEARCH + FILTER
  // =====================================================

  const [search, setSearch] =
    useState("");

  const [activeFilter, setActiveFilter] =
    useState("all");

  // =====================================================
  // RESPONSIVE
  // =====================================================

  useEffect(() => {

    const checkScreen = () => {
      setIsMobile(
        window.innerWidth < 768
      );
    };

    checkScreen();

    window.addEventListener(
      "resize",
      checkScreen
    );

    return () => {
      window.removeEventListener(
        "resize",
        checkScreen
      );
    };

  }, []);

  // =====================================================
  // SELECT CONVERSATION
  // =====================================================

  const handleSelectConversation =
    useCallback(
      (conversation) => {

        setSelectedConversation(
          conversation
        );

        navigate(
          `/app/chat/${conversation.id}`
        );
      },
      [navigate]
    );

  // =====================================================
  // MOBILE BACK
  // =====================================================

  const handleBack = useCallback(() => {

    navigate("/app/chat");

  }, [navigate]);

  return (

    <div
      className="
        flex-1 flex min-h-0
        bg-gray-100/50
        rounded-2xl
        border border-gray-200/80
        shadow-sm
        overflow-hidden
        backdrop-blur-sm
      "
    >

      {/* ================================================= */}
      {/* MOBILE */}
      {/* ================================================= */}

      {isMobile ? (

        <AnimatePresence mode="wait">

          {conversationId ? (

            <motion.div
              key="chat"

              initial={{
                opacity: 0,
                x: 20,
              }}

              animate={{
                opacity: 1,
                x: 0,
              }}

              exit={{
                opacity: 0,
                x: 20,
              }}

              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}

              className="
                flex-1 flex flex-col
                min-h-0
                bg-white
              "
            >

              <ChatWindow
                conversationId={conversationId}
                conversation={selectedConversation}
                onBack={handleBack}
              />

            </motion.div>

          ) : (

            <motion.div
              key="list"

              initial={{
                opacity: 0,
                x: -20,
              }}

              animate={{
                opacity: 1,
                x: 0,
              }}

              exit={{
                opacity: 0,
                x: -20,
              }}

              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}

              className="
                flex-1 flex flex-col
                min-h-0
                w-full
                bg-white
              "
            >

              {/* TOP BAR */}

              <div
                className="
                  sticky top-0 z-10
                  bg-white/80
                  backdrop-blur-md
                  border-b border-gray-100
                  shadow-sm
                "
              >

                <ChatTopBar
                  onSelectConversation={
                    handleSelectConversation
                  }
                  search={search}
                  onSearchChange={setSearch}
                  activeFilter={activeFilter}
                  onFilterChange={setActiveFilter}
                />

              </div>

              {/* CONVERSATION LIST */}

              <div
                className="
                  flex-1 overflow-y-auto
                  scrollbar-thin
                  scrollbar-thumb-gray-300
                  scrollbar-track-transparent
                "
              >

                <ConversationList
                  activeId={conversationId}
                  onSelect={
                    handleSelectConversation
                  }
                  search={search}
                  filter={activeFilter}
                />

              </div>

            </motion.div>
          )}

        </AnimatePresence>

      ) : (

        /* ================================================= */
        /* DESKTOP */
        /* ================================================= */

        <div className="flex flex-1 min-h-0 w-full">

          {/* ============================================= */}
          {/* SIDEBAR */}
          {/* ============================================= */}

          <div
            className="
              w-[340px]
              border-r border-gray-200/80
              bg-gray-50/70
              backdrop-blur-sm
              flex flex-col
              min-h-0
            "
          >

            {/* TOP BAR */}

            <div
              className="
                sticky top-0 z-10
                bg-gray-50/90
                backdrop-blur-md
                border-b border-gray-200/60
                shadow-sm
              "
            >

              <ChatTopBar
                onSelectConversation={
                  handleSelectConversation
                }
                search={search}
                onSearchChange={setSearch}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
              />

            </div>

            {/* CONVERSATION LIST */}

            <div
              className="
                flex-1 overflow-y-auto
                scrollbar-thin
                scrollbar-thumb-gray-300
                scrollbar-track-transparent
              "
            >

              <ConversationList
                activeId={conversationId}
                onSelect={
                  handleSelectConversation
                }
                search={search}
                filter={activeFilter}
              />

            </div>
          </div>

          {/* ============================================= */}
          {/* RIGHT CHAT AREA */}
          {/* ============================================= */}

          <div
            className="
              flex-1 min-h-0
              flex flex-col relative
              bg-gradient-to-br
              from-gray-50
              via-white
              to-gray-100/50
            "
          >

            {/* BACKGROUND PATTERN */}

            <div
              className="
                absolute inset-0
                opacity-[0.03]
                pointer-events-none
              "
              style={{
                backgroundImage: `
                  url("data:image/svg+xml,%3Csvg width='60' height='60'
                  viewBox='0 0 60 60'
                  xmlns='http://www.w3.org/2000/svg'%3E
                  %3Cg fill='none' fill-rule='evenodd'%3E
                  %3Cg fill='%23000000' fill-opacity='1'%3E
                  %3Cpath d='
                  M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4z
                  M6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6z
                  M6 4V0H4v4H0v2h4v4h2V6h4V4H6z'
                  /%3E
                  %3C/g%3E
                  %3C/g%3E
                  %3C/svg%3E")
                `,
              }}
            />

            {conversationId ? (

              <div
                className="
                  flex-1 flex flex-col
                  min-h-0
                  animate-fade-slide
                "
              >

                <ChatWindow
                  conversationId={conversationId}
                  conversation={selectedConversation}
                />

              </div>

            ) : (

              <motion.div

                initial={{
                  opacity: 0,
                  scale: 0.95,
                }}

                animate={{
                  opacity: 1,
                  scale: 1,
                }}

                transition={{
                  duration: 0.4,
                  ease: "easeOut",
                }}

                className="
                  flex-1
                  flex items-center justify-center
                  relative z-10
                "
              >

                <div
                  className="
                    text-center
                    space-y-6
                    px-8
                  "
                >

                  {/* ICON */}

                  <div
                    className="
                      relative mx-auto
                      w-24 h-24
                    "
                  >

                    <div
                      className="
                        absolute inset-0
                        bg-blue-100
                        rounded-full
                        animate-pulse
                        opacity-50
                      "
                    />

                    <div
                      className="
                        relative
                        w-24 h-24
                        bg-gradient-to-br
                        from-blue-50
                        to-indigo-50
                        rounded-full
                        flex items-center justify-center
                        border border-blue-100
                        shadow-sm
                      "
                    >

                      <MessageCircle
                        className="
                          w-10 h-10
                          text-blue-400
                        "
                        strokeWidth={1.5}
                      />

                    </div>
                  </div>

                  {/* TEXT */}

                  <div className="space-y-2">

                    <h3
                      className="
                        text-lg
                        font-semibold
                        text-gray-900
                      "
                    >
                      Your Messages
                    </h3>

                    <p
                      className="
                        text-sm
                        text-gray-500
                        max-w-xs mx-auto
                        leading-relaxed
                      "
                    >
                      Select a conversation
                      from the sidebar
                      to start chatting
                      with your team
                    </p>

                  </div>

                  {/* FOOTER */}

                  <div
                    className="
                      flex items-center justify-center
                      gap-2
                      text-xs text-gray-400
                    "
                  >

                    <Users className="w-3.5 h-3.5" />

                    <span>
                      Team conversations appear here
                    </span>

                  </div>

                </div>

              </motion.div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}