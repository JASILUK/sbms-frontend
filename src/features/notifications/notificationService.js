import { getToken } from "firebase/messaging";

import {
  getFirebaseMessaging,
} from "./firebase";

// =====================================================
// CONSTANTS
// =====================================================

export const DEVICE_ID_KEY =
  "sbms_notification_device_id";

const VAPID_KEY =
  import.meta.env
    .VITE_FIREBASE_VAPID_KEY;

// =====================================================
// SERVICE
// =====================================================

class NotificationService {

  // =====================================================
  // CHECK SUPPORT
  // =====================================================

  static isSupported() {

    return (
      "Notification" in window &&
      "serviceWorker" in navigator
    );
  }

  // =====================================================
  // GET PERMISSION STATUS
  // =====================================================

  static getPermissionStatus() {

    if (!this.isSupported()) {
      return "unsupported";
    }

    return Notification.permission;
  }

  // =====================================================
  // REQUEST PERMISSION
  // =====================================================

  static async requestPermission() {

    if (!this.isSupported()) {

      throw new Error(
        "Push notifications are not supported."
      );
    }

    return await Notification.requestPermission();
  }

  // =====================================================
  // REGISTER SERVICE WORKER
  // =====================================================

  static async registerServiceWorker() {

    const registration =
      await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );

    console.log(
      "SERVICE WORKER REGISTERED:",
      registration
    );

    return registration;
  }

  // =====================================================
  // GENERATE TOKEN
  // =====================================================

  static async generateToken() {

    try {

      const permission =
        this.getPermissionStatus();

      console.log(
        "NOTIFICATION PERMISSION:",
        permission
      );

      if (permission !== "granted") {

        throw new Error(
          "Notification permission not granted."
        );
      }

      const messaging =
        await getFirebaseMessaging();

      console.log(
        "FIREBASE MESSAGING:",
        messaging
      );

      if (!messaging) {

        throw new Error(
          "Firebase messaging unavailable."
        );
      }

      const serviceWorkerRegistration =
        await this.registerServiceWorker();

      console.log(
        "VAPID KEY:",
        VAPID_KEY
      );

      const token =
        await getToken(
          messaging,
          {
            vapidKey: VAPID_KEY,
            serviceWorkerRegistration,
          }
        );

      console.log(
        "FCM TOKEN:",
        token
      );

      if (!token) {

        throw new Error(
          "Failed to generate notification token."
        );
      }

      return token;

    } catch (error) {

      console.error(
        "FCM TOKEN GENERATION FAILED:",
        error
      );

      throw error;
    }
  }

  // =====================================================
  // DEVICE INFO
  // =====================================================

  static getDeviceInfo() {

    const userAgent =
      navigator.userAgent.toLowerCase();

    let platform = "web";

    if (/android/.test(userAgent)) {

      platform = "android";

    } else if (
      /iphone|ipad|ipod/.test(userAgent)
    ) {

      platform = "ios";
    }

    return {

      platform,

      device_name:
        navigator.platform ||
        "Unknown Device",

      device_id:
        this.getOrCreateDeviceId(),
    };
  }

  // =====================================================
  // GET OR CREATE DEVICE ID
  // =====================================================

  static getOrCreateDeviceId() {

    let deviceId =
      localStorage.getItem(
        DEVICE_ID_KEY
      );

    if (!deviceId) {

      deviceId =
        crypto.randomUUID();

      localStorage.setItem(
        DEVICE_ID_KEY,
        deviceId
      );
    }

    return deviceId;
  }
}

// =====================================================
// ENABLE PUSH NOTIFICATIONS
// =====================================================

export async function enablePushNotifications() {

  const permission =
    await NotificationService.requestPermission();

  console.log(
    "REQUESTED PERMISSION:",
    permission
  );

  if (permission !== "granted") {

    throw new Error(
      "Notification permission denied."
    );
  }

  const token =
    await NotificationService.generateToken();

  const deviceInfo =
    NotificationService.getDeviceInfo();

  return {

    token,

    ...deviceInfo,
  };
}

// =====================================================
// DISABLE PUSH NOTIFICATIONS
// =====================================================

export async function disablePushNotifications() {

  try {

    const registrations =
      await navigator
        .serviceWorker
        .getRegistrations();

    for (const registration of registrations) {

      await registration.unregister();
    }

    localStorage.removeItem(
      DEVICE_ID_KEY
    );

    console.log(
      "Push notifications disabled"
    );

  } catch (error) {

    console.error(
      "Disable notifications failed:",
      error
    );

    throw error;
  }
}

export default NotificationService;