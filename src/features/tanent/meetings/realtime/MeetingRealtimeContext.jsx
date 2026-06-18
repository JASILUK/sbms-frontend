import {
  createContext,
  useMemo,
  useState,
} from "react";

// =====================================================
// CONTEXT
// =====================================================

export const MeetingRealtimeContext =
  createContext(null);

// =====================================================
// PROVIDER
// =====================================================

export const MeetingRealtimeProvider = ({
  children,
}) => {

  // ===================================================
  // ONLINE PARTICIPANTS
  // ===================================================

  const [
    onlineParticipantIds,
    setOnlineParticipantIds,
  ] = useState([]);

  // ===================================================
  // CHAT MESSAGES
  // ===================================================

  const [
    messages,
    setMessages,
  ] = useState([]);

  // ===================================================
  // TYPING USERS
  // ===================================================

  const [
    typingUsers,
    setTypingUsers,
  ] = useState({});

  // ===================================================
  // CONTEXT VALUE
  // ===================================================

  const value =
    useMemo(() => ({

      // ===============================================
      // ONLINE PARTICIPANTS
      // ===============================================

      onlineParticipantIds,
      setOnlineParticipantIds,

      // ===============================================
      // CHAT
      // ===============================================

      messages,
      setMessages,

      // ===============================================
      // TYPING
      // ===============================================

      typingUsers,
      setTypingUsers,

    }), [

      onlineParticipantIds,
      messages,
      typingUsers,

    ]);

  // ===================================================
  // PROVIDER
  // ===================================================

  return (

    <MeetingRealtimeContext.Provider
      value={value}
    >

      {children}

    </MeetingRealtimeContext.Provider>
  );
};