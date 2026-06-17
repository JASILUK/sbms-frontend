import React from "react";

export default function IntegrationStatusBadge({
  connected,
}) {

  return (

    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-2.5
        py-1
        text-xs
        font-semibold
        border

        ${
          connected

            ? `
              bg-emerald-50
              text-emerald-700
              border-emerald-200
            `

            : `
              bg-slate-50
              text-slate-500
              border-slate-200
            `
        }
      `}
    >

      <span
        className={`
          w-2
          h-2
          rounded-full
          mr-2

          ${
            connected
              ? "bg-emerald-500"
              : "bg-slate-400"
          }
        `}
      />

      {
        connected
          ? "Connected"
          : "Not Connected"
      }

    </span>

  );
}