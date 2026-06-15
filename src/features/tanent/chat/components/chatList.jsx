import {
  MessageCircle,
  Users,
  Building2,
  FolderKanban,
} from "lucide-react";

import { useGetConversationsQuery } from "../chatApi";

export default function ConversationList({
  activeId,
  onSelect,
  search = "",
  filter = "all",
}) {

  const {
    data,
    isLoading,
    isError,
  } = useGetConversationsQuery();

  // =====================================================
  // LOADING
  // =====================================================

  if (isLoading) {

    return (
      <div className="p-4 text-sm text-gray-400">
        Loading conversations...
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (isError) {

    return (
      <div className="p-4 text-sm text-red-500">
        Failed to load conversations
      </div>
    );
  }

  const conversations = data?.data || [];

  // =====================================================
  // FILTER + SEARCH
  // =====================================================

  const filteredConversations =
    conversations.filter((conversation) => {

      // -----------------------------------------
      // SEARCH
      // -----------------------------------------

      const searchValue =
        search.trim().toLowerCase();

      const matchesSearch =
        !searchValue ||
        conversation.display_name
          ?.toLowerCase()
          .includes(searchValue);

      if (!matchesSearch) {
        return false;
      }

      // -----------------------------------------
      // TYPE FILTER
      // -----------------------------------------

      switch (filter) {

        case "direct":
          return (
            conversation.type === "direct"
          );

        case "group":
          return (
            conversation.type === "group"
          );

        case "department":
          return (
            conversation.type === "department"
          );

        case "project":
          return (
            conversation.type === "project"
          );

        default:
          return true;
      }
    });

  // =====================================================
  // EMPTY STATE
  // =====================================================

  if (!filteredConversations.length) {

    return (
      <div
        className="
          flex flex-col items-center justify-center
          py-16 px-6
          text-center
        "
      >

        <div
          className="
            w-14 h-14
            rounded-2xl
            bg-gray-100
            flex items-center justify-center
            mb-4
          "
        >

          <MessageCircle
            className="w-6 h-6 text-gray-400"
          />

        </div>

        <h3
          className="
            text-sm font-semibold
            text-gray-900
            mb-1
          "
        >
          No conversations found
        </h3>

        <p
          className="
            text-xs text-gray-500
            max-w-[220px]
          "
        >
          Try changing your search
          or conversation filter
        </p>

      </div>
    );
  }

  // =====================================================
  // ICONS
  // =====================================================

  const getConversationIcon = (type) => {

    switch (type) {

      case "group":
        return (
          <Users className="w-4 h-4" />
        );

      case "department":
        return (
          <Building2 className="w-4 h-4" />
        );

      case "project":
        return (
          <FolderKanban className="w-4 h-4" />
        );

      default:
        return (
          <MessageCircle className="w-4 h-4" />
        );
    }
  };

  // =====================================================
  // TIME FORMAT
  // =====================================================

  const formatTime = (date) => {

    if (!date) {
      return "";
    }

    return new Date(date)
      .toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
  };

  return (

    <div className="flex flex-col h-full">

      <div
        className="
          flex-1 overflow-y-auto
          px-2 py-2
          space-y-1
        "
      >

        {filteredConversations.map((conversation) => {

          const isActive =
            String(activeId) ===
            String(conversation.id);

          return (

            <button
              key={conversation.id}
              type="button"

              onClick={() => {
                onSelect(conversation);
              }}

              className={`
                w-full
                flex items-center gap-3
                p-3
                rounded-xl
                text-left
                transition-all duration-200
                group

                hover:bg-white
                hover:shadow-sm

                ${
                  isActive
                    ? `
                      bg-white
                      shadow-sm
                      ring-1 ring-blue-100
                    `
                    : ""
                }
              `}
            >

              {/* ================================= */}
              {/* AVATAR */}
              {/* ================================= */}

              <div
                className="
                  relative
                  w-11 h-11
                  rounded-full
                  shrink-0
                  overflow-hidden
                  bg-gradient-to-br
                  from-blue-100
                  to-indigo-100
                  flex items-center justify-center
                  text-blue-600
                "
              >

                {conversation.avatar ? (

                  <img
                    src={conversation.avatar}
                    alt={conversation.display_name}
                    className="
                      w-full h-full
                      object-cover
                    "
                  />

                ) : (

                  getConversationIcon(
                    conversation.type
                  )
                )}

              </div>

              {/* ================================= */}
              {/* CONTENT */}
              {/* ================================= */}

              <div
                className="
                  flex-1
                  min-w-0
                "
              >

                {/* TOP */}

                <div
                  className="
                    flex items-start justify-between
                    gap-2
                  "
                >

                  <div
                    className="
                      min-w-0 flex-1
                    "
                  >

                    <div
                      className="
                        font-medium
                        text-gray-900
                        truncate
                      "
                    >
                      {conversation.display_name}
                    </div>

                    <div
                      className="
                        mt-0.5
                        flex items-center gap-1
                      "
                    >

                      <span
                        className="
                          text-[10px]
                          px-1.5 py-0.5
                          rounded-full
                          bg-gray-100
                          text-gray-500
                          capitalize
                        "
                      >
                        {conversation.type}
                      </span>

                    </div>
                  </div>

                  <div
                    className="
                      text-[10px]
                      text-gray-400
                      whitespace-nowrap
                      shrink-0
                    "
                  >
                    {formatTime(
                      conversation.updated_at
                    )}
                  </div>
                </div>

                {/* BOTTOM */}

                <div
                  className="
                    flex items-center justify-between
                    gap-2
                    mt-1
                  "
                >

                  <div
                    className="
                      text-xs
                      text-gray-500
                      truncate
                    "
                  >

                    {conversation.last_message ||
                      "Start a conversation"}

                  </div>

                  {conversation.unread_count > 0 && (

                    <div
                      className="
                        min-w-[18px]
                        h-[18px]
                        px-1
                        rounded-full
                        bg-blue-500
                        text-white
                        text-[10px]
                        font-semibold
                        flex items-center justify-center
                        shrink-0
                      "
                    >

                      {conversation.unread_count}

                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}