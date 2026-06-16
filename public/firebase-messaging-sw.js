importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

// =====================================================
// DYNAMIC CONFIG EXTRACTION FROM URL
// =====================================================
// This reads the env variables passed during registration safely.
const urlParams = new URLSearchParams(self.location.search);

firebase.initializeApp({
  apiKey: urlParams.get("apiKey") || "",
  authDomain: urlParams.get("authDomain") || "",
  projectId: urlParams.get("projectId") || "",
  storageBucket: urlParams.get("storageBucket") || "",
  messagingSenderId: urlParams.get("messagingSenderId") || "",
  appId: urlParams.get("appId") || "",
});

// =====================================================
// FIREBASE MESSAGING
// =====================================================
const messaging = firebase.messaging();

// =====================================================
// DEFAULTS
// =====================================================
const DEFAULT_TITLE = "New Notification";
const DEFAULT_ICON = "/favicon.ico";
const DEFAULT_BADGE = "/favicon.ico";

// =====================================================
// BUILD NOTIFICATION OPTIONS
// =====================================================
function buildNotificationOptions(data) {
  return {
    body: data.body || "",
    icon: data.icon || DEFAULT_ICON,
    badge: data.badge || DEFAULT_BADGE,
    tag: data.notification_id || undefined,
    renotify: false,
    requireInteraction: false,
    silent: false,
    data,
  };
}

// =====================================================
// RESOLVE TARGET URL
// =====================================================
function resolveTargetUrl(data) {
  if (data.conversation_id) {
    return `/app/chat/${data.conversation_id}`;
  }
  if (data.url) {
    return data.url;
  }
  return "/";
}

// =====================================================
// FOCUS OR OPEN WINDOW
// =====================================================
async function focusOrOpenWindow(targetUrl) {
  const clientList = await clients.matchAll({
    type: "window",
    includeUncontrolled: true,
  });

  for (const client of clientList) {
    if ("focus" in client) {
      try {
        await client.navigate(targetUrl);
      } catch (error) {
        console.error("Navigation failed:", error);
      }
      return client.focus();
    }
  }

  if (clients.openWindow) {
    return clients.openWindow(targetUrl);
  }
}

// =====================================================
// BACKGROUND MESSAGE
// =====================================================
messaging.onBackgroundMessage(async (payload) => {
  try {
    console.log("BACKGROUND MESSAGE:", payload);
    const data = payload?.data || {};

    if (!Object.keys(data).length) {
      console.warn("Empty push payload received");
      return;
    }

    const title = data.title || DEFAULT_TITLE;
    const options = buildNotificationOptions(data);

    await self.registration.showNotification(title, options);
  } catch (error) {
    console.error("Background notification error:", error);
  }
});

// =====================================================
// NOTIFICATION CLICK
// =====================================================
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const data = event.notification.data || {};
  const targetUrl = resolveTargetUrl(data);

  event.waitUntil(focusOrOpenWindow(targetUrl));
});

// =====================================================
// SERVICE WORKER INSTALL
// =====================================================
self.addEventListener("install", () => {
  console.log("Firebase service worker installed");
  self.skipWaiting();
});

// =====================================================
// SERVICE WORKER ACTIVATE
// =====================================================
self.addEventListener("activate", (event) => {
  console.log("Firebase service worker activated");
  event.waitUntil(self.clients.claim());
});