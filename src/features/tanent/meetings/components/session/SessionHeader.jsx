import React from "react";

import {
  Users,
  Radio,
} from "lucide-react";

const SessionHeader = ({
  meeting,
}) => {

  return (
    <div className="h-14 shrink-0 border-b border-slate-800 bg-slate-900 px-5 flex items-center justify-between">

      {/* LEFT */}
      <div className="min-w-0">
        <h1 className="text-sm font-semibold text-white truncate">
          {meeting?.title}
        </h1>

        <div className="flex items-center gap-2 mt-0.5">

          <span className="flex items-center gap-1 text-[11px] text-red-400 font-medium">
            <Radio className="w-3 h-3" />
            LIVE
          </span>

          <span className="text-[11px] text-slate-500">
            {meeting?.timezone}
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        <div className="flex items-center gap-1 text-xs text-slate-300">
          <Users className="w-4 h-4" />

          <span>
            {meeting?.participants?.length || 0}
          </span>
        </div>

      </div>
    </div>
  );
};

export default SessionHeader;