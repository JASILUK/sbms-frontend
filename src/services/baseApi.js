import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getCookie } from "../shared/utils/get_csrf_cookie";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  credentials: "include",

  prepareHeaders: (headers) => {
    headers.set("Accept", "application/json");
    headers.set("X-Client-Type", "web");

    const companyId = localStorage.getItem("activeCompanyId");
    if (companyId) {
      headers.set("X-Company-ID", companyId);
    }

    const csrfToken = getCookie("csrftoken");
    if (csrfToken) {
      headers.set("X-CSRFToken", csrfToken);
    }

    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshResult = await rawBaseQuery(
      {
        url: "users/v1/auth/refresh/token/",
        method: "POST",
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      result = await rawBaseQuery(args, api, extraOptions);
    }
  }

  if (result.error?.status === 403) {
    await rawBaseQuery(
      { url: "users/v1/auth/csrf/", method: "GET" },
      api,
      extraOptions
    );

    result = await rawBaseQuery(args, api, extraOptions);
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,

  tagTypes: [
    // Core Auth & Context
    "User",
    "CompanyContext",
    "PlatformContext",

    // Personnel & Organization
    "Employees",
    "Roles",
    "Departments",

    // Security & Auth Devices
    "MFADevices",

    // Messaging & Communication
    "Conversations",
    "GroupDetails",

    // Notifications
    "NotificationDevices",
    "NotificationPreferences",
    "Notifications",

    // Collaboration
    "Meetings",
    "Participants",
    "Targets",
    "Sessions",
    "CalendarAccounts",

    // Attendance Setup Domains
    "SCHEDULE",
    "POLICY",
    "HOLIDAY",
    "SHIFT",
    "ASSIGNMENT",

    // 🆕 Unified Attendance Tracking & History Cache Tags
    "AttendanceDashboard",
    "MyAttendanceList",
    "MyAttendanceSummary",
    "MyAttendanceTrends",
    "MyAttendanceCalendar",
    "MyAttendanceDetail"
  ],

  endpoints: () => ({}),
});