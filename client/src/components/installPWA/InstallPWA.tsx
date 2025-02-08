"use client";

import { useEffect, useState } from "react";

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  // Handle the "beforeinstallprompt" event
  useEffect(() => {
    const handleBeforeInstallPrompt = (event: any) => {
      event.preventDefault(); // Prevent the default browser install prompt
      setDeferredPrompt(event); // Store the event for later use
      setShowInstallButton(true); // Show the custom install button
    };

    // Add the event listener
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  // Handle the Install button click
  const handleInstallClick = () => {
    if (deferredPrompt) {
      // Trigger the install prompt
      deferredPrompt.prompt();

      // Handle the user's choice
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }

        // Reset the deferred prompt and hide the install button
        setDeferredPrompt(null);
        setShowInstallButton(false);
      });
    } else {
      console.log("Install prompt is not available");
    }
  };

  // Check if the PWA is already installed (display-mode: standalone)
  const isPWAInstalled = window.matchMedia(
    "(display-mode: standalone)"
  ).matches;

  // Hide the install button if already installed
  useEffect(() => {
    if (isPWAInstalled) {
      setShowInstallButton(false); // Hide the install button if the app is installed
    }
  }, [isPWAInstalled]);

  return (
    <div>
      {/* Show the install button only if the app is not installed */}
      {!isPWAInstalled && showInstallButton && (
        <button
          className="block w-full text-left px-4 py-2 rounded-md text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={handleInstallClick}
        >
          Download App
        </button>
      )}
    </div>
  );
}
