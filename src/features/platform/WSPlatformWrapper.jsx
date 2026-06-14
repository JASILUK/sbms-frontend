// features/platform/PlatformWSWrapper.jsx

import { useGetWsTicketQuery } from "../tanent/chat/chatApi";
import { WebSocketProvider } from "../../contexts/websocket_context";

export default function PlatformWSWrapper({ children }) {
  const { data, isLoading } = useGetWsTicketQuery();

  const ticket = data?.data?.ticket;

  if (isLoading) return <div>Loading...</div>;
  if (!ticket) return <div>No ticket</div>;

  const url = `${import.meta.env.VITE_WS_BASE_URL}ws/platform/?ticket=${ticket}`;

  return (
    <WebSocketProvider url={url}>
      {children}
    </WebSocketProvider>
  );
}