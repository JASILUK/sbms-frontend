import { useGetWsTicketQuery } from "./chat/chatApi";
import { WebSocketProvider } from "../../contexts/websocket_context";
import ChatSocketListener from "./chat/ChatSocketListener";
import { PresenceProvider } from "./chat/presenceContext";
import { useLocation } from "react-router-dom";

export default function TenantWSWrapper({ children }) {
  const { data, isLoading } = useGetWsTicketQuery();
  const location = useLocation();

  const ticket = data?.data?.ticket;

  if (isLoading) return <div>Loading...</div>;
  if (!ticket) return <div>No ticket</div>;

  const url = `${import.meta.env.VITE_WS_BASE_URL}ws/app/?ticket=${ticket}`;

  // 🔥 extract active room globally
  const match = location.pathname.match(/\/app\/chat\/(.+)/);
  const activeRoomId = match ? match[1] : null;

  return (
    <WebSocketProvider url={url}>
      <PresenceProvider>

        {/* 🔥 GLOBAL LISTENER */}
        <ChatSocketListener activeRoomId={activeRoomId} />

        {children}

      </PresenceProvider>
    </WebSocketProvider>
  );
}