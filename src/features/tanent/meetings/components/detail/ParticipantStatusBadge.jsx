import React from "react";
import { PARTICIPANT_STATUS_CONFIG } from "../../utils/meetingStatus";

const ParticipantStatusBadge = ({ status }) => {
  const config = PARTICIPANT_STATUS_CONFIG[status] || PARTICIPANT_STATUS_CONFIG.invited;

  return (
    <span
      className={`
        inline-flex items-center
        px-2 py-0.5 rounded-md
        text-xs font-medium
        border ${config.bg} ${config.color} ${config.border}
      `}
    >
      {config.label}
    </span>
  );
};

export default ParticipantStatusBadge;
