"use client";
import { useEffect, useState } from "react";

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [showOnline, setShowOnline] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const updateStatus = () => {
      if (!navigator.onLine) {
        setIsOnline(false);
        setWasOffline(true);
      } else {
        if (wasOffline) {
          setShowOnline(true);
          setTimeout(() => setShowOnline(false), 3000);
        }
        setIsOnline(true);
        setWasOffline(false);
      }
    };

    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

    updateStatus();

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, [wasOffline]);

  return (
    <>
      {!isOnline && (
        <div className="fixed bottom-0 left-0 w-full h-5 bg-red-500 z-[999] flex items-center justify-center text-white text-xs">
          No Internet Connection
        </div>
      )}
      {showOnline && (
        <div className="fixed bottom-0 left-0 w-full h-5 bg-green-500 z-[999] flex items-center justify-center text-white text-xs transition-opacity duration-500">
          Internet is Back
        </div>
      )}
    </>
  );
}
