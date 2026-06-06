// features/auth/useGoogleAuth.js
import { useEffect, useRef } from "react";

export default function useGoogleAuth(callback, buttonId = "google-signin-button") {
  const callbackRef = useRef(callback);

  // Keep callback ref updated
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    // Load Google script if not present
    if (!window.google?.accounts) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => initializeGoogle();
      document.body.appendChild(script);
    } else {
      initializeGoogle();
    }

    function initializeGoogle() {
      if (!window.google?.accounts?.id) return;

      try {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: (response) => callbackRef.current?.(response),
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Render button if element exists
        const buttonElement = document.getElementById(buttonId);
        if (buttonElement) {
          window.google.accounts.id.renderButton(buttonElement, {
            type: "standard",
            theme: "outline",
            size: "large",
            text: "continue_with",
            shape: "rectangular",
            logo_alignment: "left",
            width: buttonElement.offsetWidth || 300,
          });
        }
      } catch (error) {
        console.error("Google Auth initialization error:", error);
      }
    }

    return () => {
      // Cleanup: cancel any pending prompts
      if (window.google?.accounts?.id) {
        window.google.accounts.id.cancel();
      }
    };
  }, [buttonId]);
}