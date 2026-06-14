import { createContext, useContext, useEffect, useRef } from "react";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children, url }) => {
  const socketRef = useRef(null);

  useEffect(() => {
  if (!url) return;

  if (socketRef.current) return; // 🔥 prevent duplicate

  const socket = new WebSocket(url);
  socketRef.current = socket;

  socket.onopen = () => console.log("WS Connected");

  socket.onclose = (e) => {
    console.log("WS Closed", e.code);
    socketRef.current = null;
  };

  socket.onerror = (e) => console.error("WS Error", e);

}, [url]);

  return (
    <WebSocketContext.Provider value={socketRef}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);