import { baseApi } from "../../services/baseApi";

export const notificationApi =
  baseApi.injectEndpoints({

    endpoints: (builder) => ({

      // =====================================================
      // REGISTER DEVICE
      // =====================================================

      registerNotificationDevice:
        builder.mutation({

          query: (body) => ({
            url:
              "/notification/v1/devices/register/",
            method: "POST",
            body,
          }),

        }),

      // =====================================================
      // DEACTIVATE DEVICE
      // =====================================================

      deactivateNotificationDevice:
        builder.mutation({

          query: (body) => ({
            url:
              "/notification/v1/devices/deactivate/",
            method: "POST",
            body,
          }),

        }),

      // =====================================================
      // GET PREFERENCES
      // =====================================================

      getNotificationPreferences:
        builder.query({

          query: () => ({
            url:
              "/notification/v1/preferences/",
          }),

          providesTags: [
            "NotificationPreferences",
          ],

          keepUnusedDataFor: 300,

        }),

      // =====================================================
      // UPDATE PREFERENCES
      // =====================================================

      updateNotificationPreferences:
        builder.mutation({

          query: (body) => ({
            url:
              "/notification/v1/preferences/",
            method: "PATCH",
            body,
          }),

          invalidatesTags: [
            "NotificationPreferences",
          ],

        }),

    }),

  });

export const {

  useRegisterNotificationDeviceMutation,

  useDeactivateNotificationDeviceMutation,

  useGetNotificationPreferencesQuery,

  useUpdateNotificationPreferencesMutation,

} = notificationApi;