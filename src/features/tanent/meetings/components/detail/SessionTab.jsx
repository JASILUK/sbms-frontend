import React from "react";
import SessionPanel from "./SessionPanel";

const SessionTab = ({ meeting, actions, permissions }) => {
  return (
    <SessionPanel
      meeting={meeting}
      actions={actions}
      permissions={permissions}
    />
  );
};

export default SessionTab;
