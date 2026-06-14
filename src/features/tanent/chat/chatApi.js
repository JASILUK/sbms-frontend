// src/features/chat/api/chatApi.js

import { baseApi } from "../../../services/baseApi";

export const chatApi = baseApi.injectEndpoints({

  endpoints: (builder) => ({

    // =====================================================
    // CONVERSATIONS
    // =====================================================

    getConversations: builder.query({

      query: ({
        search = "",
        type = "all",
      } = {}) => {

        const params = new URLSearchParams();

        if (search?.trim()) {
          params.append(
            "search",
            search.trim(),
          );
        }

        if (
          type &&
          type !== "all"
        ) {
          params.append(
            "type",
            type,
          );
        }

        const queryString =
          params.toString();

        return queryString
          ? `/chat/v1/conversations/?${queryString}`
          : "/chat/v1/conversations/";
      },

      providesTags: [
        {
          type: "Conversations",
          id: "LIST",
        },
      ],
    }),

    // =====================================================
    // DIRECT CHAT
    // =====================================================

    createDirectConversation:
      builder.mutation({

        query: (body) => ({
          url: "/chat/v1/direct/",
          method: "POST",
          body,
        }),

        invalidatesTags: [
          {
            type: "Conversations",
            id: "LIST",
          },
        ],
      }),

    // =====================================================
    // MARK READ
    // =====================================================

    markAsRead: builder.mutation({

      query: (conversationId) => ({
        url: `/chat/v1/conversations/${conversationId}/read/`,
        method: "POST",
      }),

      invalidatesTags: [
        {
          type: "Conversations",
          id: "LIST",
        },
      ],
    }),

    // =====================================================
    // MESSAGES
    // =====================================================

    getMessages: builder.query({

      query: ({
        conversationId,
        cursor = null,
      }) => {

        const params =
          new URLSearchParams();

        if (cursor) {
          params.append(
            "cursor",
            cursor,
          );
        }

        const queryString =
          params.toString();

        return queryString
          ? `/chat/v1/conversations/${conversationId}/messages/?${queryString}`
          : `/chat/v1/conversations/${conversationId}/messages/`;
      },
    }),

    sendMessage: builder.mutation({

      query: (body) => ({
        url: "/chat/v1/messages/send/",
        method: "POST",
        body,
      }),

      invalidatesTags: [
        {
          type: "Conversations",
          id: "LIST",
        },
      ],
    }),

    editMessage: builder.mutation({

      query: ({
        messageId,
        content,
      }) => ({
        url: `/chat/v1/messages/${messageId}/`,
        method: "PATCH",
        body: {
          content,
        },
      }),
    }),

    deleteMessage: builder.mutation({

      query: (messageId) => ({
        url: `/chat/v1/messages/${messageId}/`,
        method: "DELETE",
      }),

      invalidatesTags: [
        {
          type: "Conversations",
          id: "LIST",
        },
      ],
    }),

    getMessageInfo: builder.query({

      query: (messageId) => ({
        url: `/chat/v1/messages/${messageId}/info/`,
      }),
    }),

    // =====================================================
    // GROUPS / DEPARTMENTS / PROJECTS
    // =====================================================

    createGroup: builder.mutation({

      query: (body) => ({
        url: "/chat/v1/groups/",
        method: "POST",
        body,
      }),

      invalidatesTags: [
        {
          type: "Conversations",
          id: "LIST",
        },
      ],
    }),

    getGroupDetails: builder.query({

      query: (conversationId) =>
        `/chat/v1/groups/${conversationId}/`,

      providesTags: (
        result,
        error,
        conversationId,
      ) => [
        {
          type: "GroupDetails",
          id: conversationId,
        },
      ],
    }),

    addGroupMembers: builder.mutation({

      query: ({
        conversationId,
        member_ids,
      }) => ({
        url: `/chat/v1/groups/${conversationId}/members/`,
        method: "POST",
        body: {
          member_ids,
        },
      }),

      invalidatesTags: (
        result,
        error,
        arg,
      ) => [
        {
          type: "GroupDetails",
          id: arg.conversationId,
        },
        {
          type: "Conversations",
          id: "LIST",
        },
      ],
    }),

    removeGroupMember: builder.mutation({

      query: ({
        conversationId,
        membership_id,
      }) => ({
        url: `/chat/v1/groups/${conversationId}/members/remove/`,
        method: "POST",
        body: {
          membership_id,
        },
      }),

      invalidatesTags: (
        result,
        error,
        arg,
      ) => [
        {
          type: "GroupDetails",
          id: arg.conversationId,
        },
        {
          type: "Conversations",
          id: "LIST",
        },
      ],
    }),

    leaveGroup: builder.mutation({

      query: (conversationId) => ({
        url: `/chat/v1/groups/${conversationId}/leave/`,
        method: "POST",
      }),

      invalidatesTags: (
        result,
        error,
        conversationId,
      ) => [
        {
          type: "GroupDetails",
          id: conversationId,
        },
        {
          type: "Conversations",
          id: "LIST",
        },
      ],
    }),

    updateGroupRole: builder.mutation({

      query: ({
        conversationId,
        membership_id,
        role,
      }) => ({
        url: `/chat/v1/groups/${conversationId}/roles/`,
        method: "PATCH",
        body: {
          membership_id,
          role,
        },
      }),

      invalidatesTags: (
        result,
        error,
        arg,
      ) => [
        {
          type: "GroupDetails",
          id: arg.conversationId,
        },
      ],
    }),

    updateGroup: builder.mutation({

      query: ({
        conversationId,
        formData,
      }) => ({
        url: `/chat/v1/groups/${conversationId}/settings/`,
        method: "PATCH",
        body: formData,
      }),

      invalidatesTags: (
        result,
        error,
        arg,
      ) => [
        {
          type: "GroupDetails",
          id: arg.conversationId,
        },
        {
          type: "Conversations",
          id: "LIST",
        },
      ],
    }),

    // =====================================================
    // WEBSOCKET
    // =====================================================

    getWsTicket: builder.query({

      query: () => ({
        url: "/chat/v1/ws-ticket/",
      }),

      keepUnusedDataFor: 0,
    }),

  }),
});

export const {

  // =====================================================
  // CONVERSATIONS
  // =====================================================

  useGetConversationsQuery,
  useCreateDirectConversationMutation,
  useMarkAsReadMutation,

  // =====================================================
  // MESSAGES
  // =====================================================

  useGetMessagesQuery,
  useSendMessageMutation,
  useEditMessageMutation,
  useDeleteMessageMutation,
  useLazyGetMessageInfoQuery,

  // =====================================================
  // GROUPS
  // =====================================================

  useCreateGroupMutation,
  useGetGroupDetailsQuery,
  useAddGroupMembersMutation,
  useRemoveGroupMemberMutation,
  useLeaveGroupMutation,
  useUpdateGroupRoleMutation,
  useUpdateGroupMutation,

  // =====================================================
  // WEBSOCKET
  // =====================================================

  useGetWsTicketQuery,

} = chatApi;