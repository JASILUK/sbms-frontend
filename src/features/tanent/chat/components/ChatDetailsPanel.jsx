import { memo, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft } from "lucide-react";
import GroupDetailsPanel from "./GroupDetailsPanel";
import DirectChatDetailsPanel from "./DirectChatDetailsPanel";

const ChatDetailsPanel = memo(function ChatDetailsPanel({ conversation, isOpen, onClose }) {

  const isGroupConversation = [
    "group",
    "department",
    "project",
  ].includes(conversation?.type);

  const panelRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Click outside to close — works on both mobile and desktop
  const handleBackdropClick = useCallback((e) => {
    // Only close if clicking the backdrop itself, not the panel
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — covers entire chat area, clickable to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40"
            onClick={handleBackdropClick}
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-full sm:w-[360px] bg-white shadow-2xl z-50 flex flex-col overflow-hidden border-l border-gray-100"
          >
            {/* Header with Close Button — visible on all screen sizes */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
              <div className="flex items-center gap-2">
                {/* Mobile: back arrow */}
                <button
                  onClick={onClose}
                  className="sm:hidden p-1.5 rounded-lg hover:bg-gray-200 text-gray-500 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h3 className="text-sm font-semibold text-gray-900">
                  {isGroupConversation ? "Group Info" : "User Info"}
                </h3>
              </div>

              {/* Desktop: X close button */}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {isGroupConversation ? (
                <GroupDetailsPanel conversation={conversation} onClose={onClose} />
              ) : (
                <DirectChatDetailsPanel conversation={conversation} onClose={onClose} />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

export default ChatDetailsPanel;