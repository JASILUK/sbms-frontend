import { baseApi } from "../../../../services/baseApi";

export const meetingSessionApi =
  baseApi.injectEndpoints({

    endpoints: (builder) => ({

      // =====================================================
      // GET SESSION DETAIL
      // =====================================================

      getMeetingSession:
        builder.query({

          query: (
            meetingId
          ) => ({
            url:
              `meetings/v1/${meetingId}/session/`,

            method: "GET",
          }),

          transformResponse: (
            response
          ) =>
            response?.data ||
            response,

          providesTags: (
            result,
            error,
            meetingId,
          ) => [
            {
              type:
                "MeetingSession",

              id: meetingId,
            },
          ],
        }),

      // =====================================================
      // START SESSION
      // =====================================================

      startMeetingSession:
        builder.mutation({

          query: ({
            meetingId,
            body = {},
          }) => ({
            url:
              `meetings/v1/${meetingId}/session/start/`,

            method: "POST",

            body,
          }),

          transformResponse: (
            response
          ) =>
            response?.data ||
            response,

          invalidatesTags: (
            result,
            error,
            { meetingId },
          ) => [
            {
              type:
                "MeetingSession",

              id: meetingId,
            },

            {
              type:
                "Meetings",

              id: meetingId,
            },

            {
              type:
                "Meetings",

              id: "DETAIL",
            },
          ],
        }),

      // =====================================================
      // JOIN SESSION
      // =====================================================

      joinMeetingSession:
        builder.mutation({

          query: ({
            meetingId,
          }) => ({
            url:
              `meetings/v1/${meetingId}/session/join/`,

            method: "POST",
          }),

          transformResponse: (
            response
          ) =>
            response?.data ||
            response,

          invalidatesTags: (
            result,
            error,
            { meetingId },
          ) => [
            {
              type:
                "MeetingSession",

              id: meetingId,
            },
          ],
        }),

      // =====================================================
      // LEAVE SESSION
      // =====================================================

      leaveMeetingSession:
        builder.mutation({

          query: ({
            meetingId,
          }) => ({
            url:
              `meetings/v1/${meetingId}/session/leave/`,

            method: "POST",
          }),

          transformResponse: (
            response
          ) =>
            response?.data ||
            response,

          invalidatesTags: (
            result,
            error,
            { meetingId },
          ) => [
            {
              type:
                "MeetingSession",

              id: meetingId,
            },
          ],
        }),

      // =====================================================
      // END SESSION
      // =====================================================

      endMeetingSession:
        builder.mutation({

          query: ({
            meetingId,
            body = {},
          }) => ({
            url:
              `meetings/v1/${meetingId}/session/end/`,

            method: "POST",

            body,
          }),

          transformResponse: (
            response
          ) =>
            response?.data ||
            response,

          invalidatesTags: (
            result,
            error,
            { meetingId },
          ) => [
            {
              type:
                "MeetingSession",

              id: meetingId,
            },

            {
              type:
                "Meetings",

              id: meetingId,
            },

            {
              type:
                "Meetings",

              id: "DETAIL",
            },
          ],
        }),

    }),

    overrideExisting: false,
  });

export const {

  useGetMeetingSessionQuery,

  useStartMeetingSessionMutation,

  useJoinMeetingSessionMutation,

  useLeaveMeetingSessionMutation,

  useEndMeetingSessionMutation,

} = meetingSessionApi;