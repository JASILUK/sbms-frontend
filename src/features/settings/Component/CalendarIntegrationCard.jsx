import React from "react";

import {
  Calendar,
  Link,
  Unlink,
  Loader2,
} from "lucide-react";

import {
  useDisconnectCalendarMutation,
  useGetConnectUrlMutation,
} from "../api/calendar_api";

import IntegrationStatusBadge
  from "./IntegrationStatusBadge";

export default function CalendarIntegrationCard({

  provider,
  title,

  connected,
  email,

  disabled = false,

}) {

  const [
    getConnectUrl,
    {
      isLoading:
        isConnecting,
    },
  ] =
    useGetConnectUrlMutation();

  const [
    disconnectCalendar,
    {
      isLoading:
        isDisconnecting,
    },
  ] =
    useDisconnectCalendarMutation();

  // =====================================================
  // CONNECT
  // =====================================================

  const handleConnect =
    async () => {

      try {

        const response =
          await getConnectUrl(
            provider
          ).unwrap();

        window.location.href =
          response.data
            .authorization_url;

      } catch (error) {

        console.error(
          "Calendar connect failed",
          error,
        );
      }
    };

  // =====================================================
  // DISCONNECT
  // =====================================================

  const handleDisconnect =
    async () => {

      try {

        await disconnectCalendar({

          provider,

        }).unwrap();

      } catch (error) {

        console.error(
          "Calendar disconnect failed",
          error,
        );
      }
    };

  const loading =
    isConnecting ||
    isDisconnecting;

  return (

    <div
      className="
        border
        border-slate-200
        rounded-2xl
        p-5
        transition-all
        duration-200
        hover:border-slate-300
      "
    >

      <div
        className="
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-4
        "
      >

        {/* LEFT */}

        <div
          className="
            flex
            items-start
            gap-4
          "
        >

          <div
            className="
              w-12
              h-12
              rounded-2xl
              bg-slate-50
              border
              border-slate-200
              flex
              items-center
              justify-center
              shrink-0
            "
          >

            <Calendar
              className="
                w-5
                h-5
                text-slate-600
              "
            />

          </div>

          <div>

            <div
              className="
                flex
                items-center
                gap-3
                flex-wrap
              "
            >

              <h4
                className="
                  text-sm
                  font-semibold
                  text-slate-900
                "
              >
                {title}
              </h4>

              <IntegrationStatusBadge
                connected={
                  connected
                }
              />

            </div>

            <p
              className="
                text-sm
                text-slate-500
                mt-1
              "
            >

              {
                connected

                  ? (
                    <>
                      Connected as{" "}
                      <span
                        className="
                          font-medium
                          text-slate-700
                        "
                      >
                        {email}
                      </span>
                    </>
                  )

                  : (
                    "Calendar synchronization is currently disabled."
                  )
              }

            </p>

          </div>

        </div>

        {/* RIGHT */}

        <div>

          {
            disabled
              ? (

                <button
                  disabled
                  className="
                    px-4
                    py-2
                    rounded-xl
                    text-sm
                    font-medium
                    bg-slate-100
                    text-slate-400
                    cursor-not-allowed
                  "
                >
                  Coming Soon
                </button>

              )

              : connected
                ? (

                  <button
                    type="button"
                    onClick={
                      handleDisconnect
                    }
                    disabled={loading}
                    className="
                      inline-flex
                      items-center
                      gap-2
                      px-4
                      py-2
                      rounded-xl
                      text-sm
                      font-medium
                      border
                      border-rose-200
                      bg-rose-50
                      text-rose-600
                      hover:bg-rose-100
                      disabled:opacity-50
                    "
                  >

                    {
                      loading
                        ? (
                          <Loader2
                            className="
                              w-4
                              h-4
                              animate-spin
                            "
                          />
                        )
                        : (
                          <Unlink
                            className="
                              w-4
                              h-4
                            "
                          />
                        )
                    }

                    Disconnect

                  </button>

                )

                : (

                  <button
                    type="button"
                    onClick={
                      handleConnect
                    }
                    disabled={loading}
                    className="
                      inline-flex
                      items-center
                      gap-2
                      px-4
                      py-2
                      rounded-xl
                      text-sm
                      font-medium
                      bg-indigo-600
                      text-white
                      hover:bg-indigo-700
                      disabled:opacity-50
                    "
                  >

                    {
                      loading
                        ? (
                          <Loader2
                            className="
                              w-4
                              h-4
                              animate-spin
                            "
                          />
                        )
                        : (
                          <Link
                            className="
                              w-4
                              h-4
                            "
                          />
                        )
                    }

                    Connect

                  </button>

                )
          }

        </div>

      </div>

    </div>

  );
}