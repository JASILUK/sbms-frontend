import { createContext, useContext, useEffect, useState } from "react";
import { useWebSocket } from "../../../contexts/websocket_context";

export const PresenceContext = createContext(null);

export const PresenceProvider = ({ children }) => {
  const socketRef = useWebSocket();

  const [onlineUsers, setOnlineUsers] = useState({});
  const [lastSeenMap, setLastSeenMap] = useState({}); // 🔥 prepare for next feature

  useEffect(() => {
    const socket = socketRef?.current;
    if (!socket) return;

    console.log("🎧 Presence listener attached");

    const handleMessage = (e) => {
      let data;
      try {
        data = JSON.parse(e.data);
      } catch (err) {
        console.error("❌ Presence parse error", err);
        return;
      }

      // =========================
      // SNAPSHOT (INITIAL ONLINE USERS)
      // =========================
      if (data.type === "presence_snapshot") {
        const map = {};

        for (const id of data.users || []) {
          map[id] = true;
        }

        console.log("📦 SNAPSHOT:", map);
        setOnlineUsers(map);
        return;
      }

      // =========================
      // ONLINE / OFFLINE UPDATE
      // =========================
      if (data.type === "presence_update") {
        const isOnline = data.status === "online";

        setOnlineUsers((prev) => {
          if (prev[data.user_id] === isOnline) return prev;

          console.log(
            `👤 ${data.user_id} → ${isOnline ? "ONLINE" : "OFFLINE"}`
          );

          return {
            ...prev,
            [data.user_id]: isOnline,
          };
        });

        return;
      }

      // =========================
      // 🔥 LAST SEEN (NEXT FEATURE READY)
      // =========================
      if (data.type === "last_seen_update") {
        setLastSeenMap((prev) => ({
          ...prev,
          [data.user_id]: data.last_seen,
        }));

        return;
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
      console.log("🧹 Presence listener removed");
    };

  }, [socketRef]);

  return (
    <PresenceContext.Provider value={{ onlineUsers, lastSeenMap }}>
      {children}
    </PresenceContext.Provider>
  );
};

export const usePresence = () => useContext(PresenceContext);