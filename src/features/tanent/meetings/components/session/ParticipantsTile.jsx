import React from "react";

import {
  Mic,
  MicOff,
} from "lucide-react";

const ParticipantTile = ({
  participant,
}) => {

  return (
    <div className="relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden aspect-video">

      {/* VIDEO */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">

        <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center text-2xl font-bold text-white">
          {participant.username
            ?.charAt(0)
            ?.toUpperCase()}
        </div>
      </div>

      {/* FOOTER */}
      <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent">

        <div>
          <p className="text-sm font-medium text-white">
            {participant.username}
          </p>

          <p className="text-[11px] text-slate-300 capitalize">
            {participant.role}
          </p>
        </div>

        <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center">
          {participant.is_present ? (
            <Mic className="w-4 h-4 text-white" />
          ) : (
            <MicOff className="w-4 h-4 text-red-400" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ParticipantTile;