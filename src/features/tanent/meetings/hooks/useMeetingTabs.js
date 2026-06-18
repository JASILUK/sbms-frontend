import { useState, useCallback } from "react";

export const TABS = {
  OVERVIEW: "overview",
  PARTICIPANTS: "participants",
  TARGETS: "targets",
  SESSION: "session",
};

export const TAB_CONFIG = [
  { id: TABS.OVERVIEW, label: "Overview" },
  { id: TABS.PARTICIPANTS, label: "Participants" },
  { id: TABS.TARGETS, label: "Targets" },
  { id: TABS.SESSION, label: "Session" },
];

export const useMeetingTabs = (initialTab = TABS.OVERVIEW) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const switchTab = useCallback((tabId) => {
    if (TAB_CONFIG.some((t) => t.id === tabId)) {
      setActiveTab(tabId);
    }
  }, []);

  return {
    activeTab,
    setActiveTab: switchTab,
    tabs: TAB_CONFIG,  // ← MUST return this
  };
};