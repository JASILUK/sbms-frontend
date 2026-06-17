// features/settings/pages/GoogleCalendarCallback.jsx
import React from "react";
import { useEffect } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { useRef } from "react";
import {
  useConnectCalendarMutation,
} from "../api/calendar_api";

export default function GoogleCalendarCallback() {

  const navigate =
    useNavigate();

  const [
    searchParams,
  ] = useSearchParams();

  const [
    connectCalendar,
  ] =
    useConnectCalendarMutation();

  const code =
    searchParams.get(
      "code"
    );

  const state =
    searchParams.get(
      "state"
    );

  const oauthError =
    searchParams.get(
      "error"
    );

  const [uiState, setUiState] =
    React.useState(
      "loading"
    );

  const [errorMessage, setErrorMessage] =
    React.useState("");



const hasExecuted = useRef(false);

useEffect(() => {

  if (hasExecuted.current) {
    return;
  }

  hasExecuted.current = true;

  connect();

}, []);

  useEffect(() => {

    const connect =
      async () => {

        // ==========================
        // GOOGLE DENIED ACCESS
        // ==========================

        if (oauthError) {

          setUiState(
            "error"
          );

          setErrorMessage(
            "Google authorization was cancelled."
          );

          return;
        }

        // ==========================
        // INVALID CALLBACK
        // ==========================

        if (
          !code ||
          !state
        ) {

          setUiState(
            "error"
          );

          setErrorMessage(
            "Missing authorization data."
          );

          return;
        }

        try {

          await connectCalendar({

            provider:
              "google",

            code,

            state,

          }).unwrap();

          setUiState(
            "success"
          );

          setTimeout(
            () => {

              navigate(
                "/settings/integrations",
                {
                  replace: true,
                }
              );

            },
            1500
          );

        } catch (error) {

          console.error(
            error
          );

          setUiState(
            "error"
          );

          setErrorMessage(

            error?.data?.message ||

            error?.data?.detail ||

            "Unable to connect Google Calendar."
          );
        }
      };

    connect();

  }, [
    code,
    state,
    oauthError,
    connectCalendar,
    navigate,
  ]);

  // ==========================
  // LOADING
  // ==========================

  if (
    uiState ===
    "loading"
  ) {

    return (

      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          px-4
        "
      >

        <div
          className="
            bg-white
            border
            border-slate-200
            rounded-3xl
            p-8
            w-full
            max-w-md
            text-center
            shadow-sm
          "
        >

          <Loader2
            className="
              w-12
              h-12
              animate-spin
              mx-auto
              text-indigo-600
            "
          />

          <h1
            className="
              mt-5
              text-lg
              font-semibold
              text-slate-900
            "
          >
            Connecting Google Calendar
          </h1>

          <p
            className="
              mt-2
              text-sm
              text-slate-500
            "
          >
            Verifying authorization and
            connecting your account.
          </p>

        </div>

      </div>
    );
  }

  // ==========================
  // SUCCESS
  // ==========================

  if (
    uiState ===
    "success"
  ) {

    return (

      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          px-4
        "
      >

        <div
          className="
            bg-white
            border
            border-slate-200
            rounded-3xl
            p-8
            w-full
            max-w-md
            text-center
            shadow-sm
          "
        >

          <CheckCircle2
            className="
              w-14
              h-14
              mx-auto
              text-emerald-500
            "
          />

          <h1
            className="
              mt-4
              text-lg
              font-semibold
              text-slate-900
            "
          >
            Calendar Connected
          </h1>

          <p
            className="
              mt-2
              text-sm
              text-slate-500
            "
          >
            Redirecting back to
            integrations...
          </p>

        </div>

      </div>
    );
  }

  // ==========================
  // ERROR
  // ==========================

  return (

    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        px-4
      "
    >

      <div
        className="
          bg-white
          border
          border-slate-200
          rounded-3xl
          p-8
          w-full
          max-w-md
          text-center
          shadow-sm
        "
      >

        <XCircle
          className="
            w-14
            h-14
            mx-auto
            text-rose-500
          "
        />

        <h1
          className="
            mt-4
            text-lg
            font-semibold
            text-slate-900
          "
        >
          Connection Failed
        </h1>

        <p
          className="
            mt-2
            text-sm
            text-slate-500
          "
        >
          {errorMessage}
        </p>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/settings/integrations"
            )
          }
          className="
            mt-6
            px-4
            py-2
            rounded-xl
            bg-slate-900
            text-white
            text-sm
            font-medium
          "
        >
          Back to Integrations
        </button>

      </div>

    </div>
  );
}