import React from "react";
import { ROLE_CONFIG } from "../../utils/meetingStatus";

const RoleBadge = ({ role }) => {
  const config = ROLE_CONFIG[role] || ROLE_CONFIG.participant;

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

export default RoleBadge;
