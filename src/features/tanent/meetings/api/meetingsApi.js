import { baseApi } from "../../../../services/baseApi";

export const meetingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // =====================================================
    // GET MEETINGS
    // =====================================================
    getMeetings: builder.query({
      query: (params = {}) => ({
        url: "meetings/v1/",
        method: "GET",
        params,
      }),
      transformResponse: (response) => {
        if (response?.data && Array.isArray(response.data)) return response.data;
        if (Array.isArray(response)) return response;
        return [];
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ public_id }) => ({
                type: "Meetings",
                id: public_id,
              })),
              { type: "Meetings", id: "LIST" },
            ]
          : [{ type: "Meetings", id: "LIST" }],
    }),

    // =====================================================
    // CREATE MEETING
    // =====================================================
    createMeeting: builder.mutation({
      query: (data) => ({
        url: "meetings/v1/",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => response?.data || response,
      invalidatesTags: [{ type: "Meetings", id: "LIST" }],
    }),

    // =====================================================
    // GET MEETING DETAIL
    // =====================================================
    getMeetingDetail: builder.query({
      query: (meetingId) => ({
        url: `meetings/v1/${meetingId}/`,
        method: "GET",
      }),
      transformResponse: (response) => response?.data || response,
      providesTags: (result, error, meetingId) => [
        { type: "Meetings", id: meetingId },
        { type: "Meetings", id: "DETAIL" },
      ],
    }),

    // =====================================================
    // UPDATE MEETING
    // =====================================================
    updateMeeting: builder.mutation({
      query: ({ meetingId, data }) => ({
        url: `meetings/v1/${meetingId}/`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response) => response?.data || response,
      invalidatesTags: (result, error, { meetingId }) => [
        { type: "Meetings", id: meetingId },
        { type: "Meetings", id: "DETAIL" },
        { type: "Meetings", id: "LIST" },
      ],
    }),

    // =====================================================
    // CANCEL MEETING
    // =====================================================
    cancelMeeting: builder.mutation({
      query: ({ meetingId, reason }) => ({
        url: `meetings/v1/${meetingId}/`,
        method: "DELETE",
        body: { reason },
      }),
      invalidatesTags: (result, error, { meetingId }) => [
        { type: "Meetings", id: meetingId },
        { type: "Meetings", id: "DETAIL" },
        { type: "Meetings", id: "LIST" },
      ],
    }),

    // =====================================================
    // LIST PARTICIPANTS
    // =====================================================
    getMeetingParticipants: builder.query({
      query: (meetingId) => ({
        url: `meetings/v1/${meetingId}/participants/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        if (response?.data && Array.isArray(response.data)) return response.data;
        if (Array.isArray(response)) return response;
        return [];
      },
      providesTags: (result, error, meetingId) => [
        { type: "Participants", id: meetingId },
      ],
    }),

    // =====================================================
    // ADD PARTICIPANTS
    // =====================================================
    addParticipants: builder.mutation({
      query: ({ meetingId, membershipIds }) => ({
        url: `meetings/v1/${meetingId}/participants/`,
        method: "POST",
        body: { membership_ids: membershipIds },
      }),
      invalidatesTags: (result, error, { meetingId }) => [
        { type: "Participants", id: meetingId },
        { type: "Meetings", id: meetingId },
        { type: "Meetings", id: "DETAIL" },
      ],
    }),

    // =====================================================
    // UPDATE PARTICIPANT ROLE
    // =====================================================
    updateParticipantRole: builder.mutation({
      query: ({ meetingId, participantId, role }) => ({
        url: `meetings/v1/${meetingId}/participants/${participantId}/`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: (result, error, { meetingId }) => [
        { type: "Participants", id: meetingId },
        { type: "Meetings", id: meetingId },
      ],
    }),

    // =====================================================
    // REMOVE PARTICIPANT
    // =====================================================
    removeParticipant: builder.mutation({
      query: ({ meetingId, participantId }) => ({
        url: `meetings/v1/${meetingId}/participants/${participantId}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { meetingId }) => [
        { type: "Participants", id: meetingId },
        { type: "Meetings", id: meetingId },
        { type: "Meetings", id: "DETAIL" },
      ],
    }),

    // =====================================================
    // LIST TARGETS
    // =====================================================
    getMeetingTargets: builder.query({
      query: (meetingId) => ({
        url: `meetings/v1/${meetingId}/targets/`,
        method: "GET",
      }),
      transformResponse: (response) => {
        if (response?.data && Array.isArray(response.data)) return response.data;
        if (Array.isArray(response)) return response;
        return [];
      },
      providesTags: (result, error, meetingId) => [
        { type: "Targets", id: meetingId },
      ],
    }),

    // =====================================================
    // ADD TARGET
    // =====================================================
    addTarget: builder.mutation({
      query: ({ meetingId, targetType, targetId }) => ({
        url: `meetings/v1/${meetingId}/targets/`,
        method: "POST",
        body: { target_type: targetType, target_id: targetId },
      }),
      invalidatesTags: (result, error, { meetingId }) => [
        { type: "Targets", id: meetingId },
        { type: "Meetings", id: meetingId },
        { type: "Meetings", id: "DETAIL" },
      ],
    }),

    // =====================================================
    // UPDATE TARGET
    // =====================================================
    updateTarget: builder.mutation({
      query: ({ meetingId, targetId, data }) => ({
        url: `meetings/v1/${meetingId}/targets/${targetId}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { meetingId }) => [
        { type: "Targets", id: meetingId },
        { type: "Meetings", id: meetingId },
      ],
    }),

    // =====================================================
    // REMOVE TARGET
    // =====================================================
    removeTarget: builder.mutation({
      query: ({ meetingId, targetId }) => ({
        url: `meetings/v1/${meetingId}/targets/${targetId}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { meetingId }) => [
        { type: "Targets", id: meetingId },
        { type: "Meetings", id: meetingId },
        { type: "Meetings", id: "DETAIL" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMeetingsQuery,
  useCreateMeetingMutation,
  useGetMeetingDetailQuery,
  useUpdateMeetingMutation,
  useCancelMeetingMutation,
  useGetMeetingParticipantsQuery,
  useAddParticipantsMutation,
  useUpdateParticipantRoleMutation,
  useRemoveParticipantMutation,
  useGetMeetingTargetsQuery,
  useAddTargetMutation,
  useUpdateTargetMutation,
  useRemoveTargetMutation,
} = meetingsApi;
