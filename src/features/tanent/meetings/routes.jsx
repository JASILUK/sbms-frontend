import { Route } from "react-router-dom";

import MeetingsDashboardPage from "./pages/MeetingsDashboardPage";
import MeetingDetailPage from "./pages/MeetingDetailPage";
import CreateMeetingPage from "./pages/MeetingCreatPage";
import MeetingSessionPage from "./pages/MeetingSessionPage";

export const meetingRoutes = (
  <>
    <Route path="meetings">

      <Route
        index
        element={<MeetingsDashboardPage />}
      />

      <Route
        path="create"
        element={<CreateMeetingPage />}
      />

      <Route
        path=":meetingId"
        element={<MeetingDetailPage />}
      />

      <Route
        path=":meetingId/session"
        element={<MeetingSessionPage />}
      />

    </Route>
  </>
);