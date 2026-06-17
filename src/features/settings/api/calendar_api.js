import { baseApi } from "../../../services/baseApi";

export const calendarApi =
  baseApi.injectEndpoints({

    endpoints: (builder) => ({

      // =====================================================
      // CONNECTED ACCOUNTS
      // =====================================================

      getCalendarAccounts:
        builder.query({

          query: () => ({
            url:
              "/calendars/v1/accounts/",
          }),

          providesTags: [
            "CalendarAccounts",
          ],

          keepUnusedDataFor: 300,

        }),

      // =====================================================
      // CONNECT URL
      // =====================================================

      getConnectUrl:
        builder.mutation({

          query: (provider) => ({

            url:
              "/calendars/v1/connect-url/",

            params: {
              provider,
            },

          }),

        }),

      // =====================================================
      // OAUTH CALLBACK
      // =====================================================

      connectCalendar:
        builder.mutation({

          query: (body) => ({

            url:
              "/calendars/v1/callback/",

            method: "POST",

            body,

          }),

          invalidatesTags: [
            "CalendarAccounts",
          ],

        }),

      // =====================================================
      // DISCONNECT
      // =====================================================

      disconnectCalendar:
        builder.mutation({

          query: (body) => ({

            url:
              "/calendars/v1/disconnect/",

            method: "POST",

            body,

          }),

          invalidatesTags: [
            "CalendarAccounts",
          ],

        }),

    }),

  });

export const {

  useGetCalendarAccountsQuery,

  useGetConnectUrlMutation,

  useConnectCalendarMutation,

  useDisconnectCalendarMutation,

} = calendarApi;