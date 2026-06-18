import {
  useContext,
} from "react";

import {
  MeetingRealtimeContext,
} from "./MeetingRealtimeContext";

export const useMeetingRealtime =
  () => {

    const context =
      useContext(
        MeetingRealtimeContext
      );

    if (!context) {

      throw new Error(
        "useMeetingRealtime must be used inside MeetingRealtimeProvider"
      );
    }

    return context;
  };