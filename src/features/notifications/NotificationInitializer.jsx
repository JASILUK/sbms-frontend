import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  getToken,
  isSupported,
} from "firebase/messaging";

import {
  getFirebaseMessaging,
} from "./firebase";

import {
  useRegisterNotificationDeviceMutation,
} from "./notificationApi";

import NotificationPermissionModal
  from "./NotificationPermissionModal";

// ========================================================
// CONSTANTS
// ========================================================

const NOTIFICATION_MODAL_KEY =
  "notification_modal_seen";

const DEVICE_ID_KEY =
  "notification_device_id";

// ========================================================
// HELPERS
// ========================================================

function getOrCreateDeviceId() {

  const existing =
    localStorage.getItem(
      DEVICE_ID_KEY,
    );

  if (existing) {
    return existing;
  }

  const newId =
    crypto.randomUUID();

  localStorage.setItem(
    DEVICE_ID_KEY,
    newId,
  );

  return newId;
}

function getDeviceName() {

  return (
    navigator.userAgent ||
    navigator.platform ||
    "Unknown Device"
  );
}

// ========================================================
// COMPONENT
// ========================================================

export default function NotificationInitializer() {

  const [
    isOpen,
    setIsOpen,
  ] = useState(false);

  const initializedRef =
    useRef(false);

  const registrationInProgressRef =
    useRef(false);

  const [
    registerDevice,
    { isLoading },
  ] =
    useRegisterNotificationDeviceMutation();

  // ======================================================
  // REGISTER PUSH DEVICE
  // ======================================================

  const registerPushDevice =
    async () => {

      if (
        registrationInProgressRef.current
      ) {
        return;
      }

      registrationInProgressRef.current =
        true;

      try {

        console.log(
          "================================",
        );

        console.log(
          "START PUSH REGISTRATION",
        );

        // ==================================================
        // CHECK SERVICE WORKER SUPPORT
        // ==================================================

        if (
          !(
            "serviceWorker" in
            navigator
          )
        ) {

          console.error(
            "Service worker unsupported",
          );

          return;
        }

        // ==================================================
        // FIREBASE MESSAGING
        // ==================================================

        const messaging =
          await getFirebaseMessaging();

        if (!messaging) {

          console.error(
            "Firebase messaging unavailable",
          );

          return;
        }

        console.log(
          "MESSAGING INSTANCE:",
          messaging,
        );

        // ==================================================
        // REGISTER SERVICE WORKER
        // ==================================================

        console.log(
          "Registering service worker...",
        );

        await navigator
          .serviceWorker.register(
            "/firebase-messaging-sw.js",
          );

        // ==================================================
        // WAIT FOR READY
        // ==================================================

        const registration =
          await navigator
            .serviceWorker.ready;

        console.log(
          "SERVICE WORKER READY",
        );

        console.log(
          "ACTIVE WORKER:",
          registration.active,
        );

        // ==================================================
        // EXISTING SUBSCRIPTION
        // ==================================================

        const existingSubscription =
          await registration
            .pushManager
            .getSubscription();

        console.log(
          "EXISTING SUBSCRIPTION:",
          existingSubscription,
        );

        // ==================================================
        // GET FCM TOKEN
        // ==================================================

        console.log(
        "Requesting FCM token...",
      );

      console.log(
        "VAPID KEY:",
        import.meta.env
          .VITE_FIREBASE_VAPID_KEY,
      );

      console.log(
        "VAPID KEY LENGTH:",
        import.meta.env
          .VITE_FIREBASE_VAPID_KEY
          ?.length,
      );

      console.log(
        "SERVICE WORKER SCOPE:",
        registration.scope,
      );

      console.log(
        "PUSH MANAGER:",
        registration.pushManager,
      );

      try {

        const subscription =
          await registration
            .pushManager
            .getSubscription();

        console.log(
          "CURRENT SUBSCRIPTION:",
          subscription,
        );

      } catch (error) {

        console.error(
          "SUBSCRIPTION CHECK FAILED:",
          error,
        );
      }


      

    console.log(
  "VAPID:",
  import.meta.env.VITE_FIREBASE_VAPID_KEY
);


      const token =
        await getToken(
          messaging,
          {
            vapidKey:
              import.meta.env
                .VITE_FIREBASE_VAPID_KEY,

            serviceWorkerRegistration:
              registration,
          },
        );

        console.log(
          "FCM TOKEN:",
          token,
        );

        if (!token) {

          console.error(
            "No FCM token received",
          );

          return;
        }

        // ==================================================
        // REGISTER / UPDATE DEVICE
        // ==================================================

        const deviceId =
          getOrCreateDeviceId();

        console.log(
          "Registering backend device...",
        );

        const response =
          await registerDevice({

            device_id:
              deviceId,

            token,

            platform: "web",

            device_name:
              getDeviceName(),
          }).unwrap();

        console.log(
          "BACKEND REGISTER SUCCESS:",
          response,
        );

        console.log(
          "PUSH REGISTRATION COMPLETE",
        );

      } catch (error) {

        console.error(
          "PUSH REGISTRATION FAILED:",
          error,
        );

        console.error(
          "ERROR NAME:",
          error?.name,
        );

        console.error(
          "ERROR MESSAGE:",
          error?.message,
        );

      } finally {

        registrationInProgressRef.current =
          false;
      }
    };

  // ======================================================
  // INITIALIZE
  // ======================================================

  useEffect(() => {

    if (
      initializedRef.current
    ) {
      return;
    }

    initializedRef.current =
      true;

    async function initialize() {

      try {

        // ==================================================
        // WINDOW CHECK
        // ==================================================

        if (
          typeof window ===
          "undefined"
        ) {
          return;
        }

        // ==================================================
        // NOTIFICATION SUPPORT
        // ==================================================

        if (
          !(
            "Notification" in
            window
          )
        ) {
          return;
        }

        // ==================================================
        // SECURE CONTEXT
        // ==================================================

        if (
          !window.isSecureContext
        ) {

          console.error(
            "Push requires secure context",
          );

          return;
        }

        // ==================================================
        // FIREBASE SUPPORT
        // ==================================================

        const supported =
          await isSupported();

        if (!supported) {

          console.error(
            "Firebase messaging unsupported",
          );

          return;
        }

        const modalSeen =
          localStorage.getItem(
            NOTIFICATION_MODAL_KEY,
          );

        // ==================================================
        // PERMISSION GRANTED
        // ==================================================

        if (
          Notification.permission ===
          "granted"
        ) {

          await registerPushDevice();

          return;
        }

        // ==================================================
        // PERMISSION DENIED
        // ==================================================

        if (
          Notification.permission ===
          "denied"
        ) {

          console.warn(
            "Notifications blocked by user",
          );

          return;
        }

        // ==================================================
        // MODAL ALREADY SEEN
        // ==================================================

        if (modalSeen) {
          return;
        }

        // ==================================================
        // OPEN MODAL
        // ==================================================

        setIsOpen(true);

      } catch (error) {

        console.error(
          "Notification initialization failed:",
          error,
        );
      }
    }

    initialize();

  }, []);

  // ======================================================
  // ENABLE NOTIFICATIONS
  // ======================================================

  const handleEnable =
    async () => {

      try {

        const permission =
          await Notification.requestPermission();

        localStorage.setItem(
          NOTIFICATION_MODAL_KEY,
          "true",
        );

        if (
          permission !==
          "granted"
        ) {

          setIsOpen(false);

          return;
        }

        await registerPushDevice();

        setIsOpen(false);

      } catch (error) {

        console.error(
          "Notification permission failed:",
          error,
        );
      }
    };

  // ======================================================
  // CLOSE MODAL
  // ======================================================

  const handleClose = () => {

    localStorage.setItem(
      NOTIFICATION_MODAL_KEY,
      "true",
    );

    setIsOpen(false);
  };

  // ======================================================
  // UI
  // ======================================================

  return (

    <NotificationPermissionModal

      isOpen={isOpen}

      onEnable={handleEnable}

      onClose={handleClose}

      isLoading={isLoading}

    />

  );
}