import {
  Globe,
  Calendar,
} from "lucide-react";

import {
  useGetCalendarAccountsQuery,
} from "../api/calendar_api";

import CalendarIntegrationCard
  from "../Component/CalendarIntegrationCard";

export default function IntegrationsSettings() {

  const {
    data,
    isLoading,
  } = useGetCalendarAccountsQuery();

  const accounts =
    data?.data || {};

  if (isLoading) {

    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">

        <div className="h-12 w-56 bg-slate-100 rounded-xl animate-pulse" />

        <div className="h-40 bg-white border border-slate-200 rounded-2xl animate-pulse" />

        <div className="h-40 bg-white border border-slate-200 rounded-2xl animate-pulse" />

      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">

      {/* Header */}

      <div>

        <div className="flex items-center gap-3.5">

          <div
            className="
              w-12 h-12
              rounded-2xl
              bg-cyan-50
              border border-cyan-100
              text-cyan-600
              flex items-center justify-center
            "
          >
            <Globe className="w-5 h-5" />
          </div>

          <div>

            <h1
              className="
                text-xl
                font-bold
                text-slate-900
              "
            >
              Integrations
            </h1>

            <p
              className="
                text-sm
                text-slate-500
                mt-0.5
              "
            >
              Connect external calendar providers and synchronize meetings.
            </p>

          </div>

        </div>

      </div>

      {/* Calendar Section */}

      <div
        className="
          bg-white
          border border-slate-200
          rounded-2xl
          shadow-sm
          overflow-hidden
        "
      >

        <div
          className="
            px-6 py-4
            border-b border-slate-100
          "
        >

          <div className="flex items-center gap-2">

            <Calendar
              className="
                w-4 h-4
                text-slate-500
              "
            />

            <h3
              className="
                text-sm
                font-semibold
                text-slate-900
              "
            >
              Calendar Providers
            </h3>

          </div>

          <p
            className="
              text-xs
              text-slate-400
              mt-1
            "
          >
            Sync meetings with external calendar platforms.
          </p>

        </div>

        <div className="p-6 space-y-4">

          <CalendarIntegrationCard
            provider="google"
            title="Google Calendar"
            connected={
              accounts.google?.connected
            }
            email={
              accounts.google?.email
            }
          />

          <CalendarIntegrationCard
            provider="outlook"
            title="Microsoft Outlook"
            connected={false}
            email={null}
            disabled
          />

        </div>

      </div>

    </div>
  );
}