"use client";
import React, { useEffect, useState } from "react";

export default function Cookies() {
  const [showBanner, setShowBanner] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const cookieConsent = localStorage.getItem("cookie_consent");
    if (!cookieConsent) {
      setShowBanner(true);
      setTimeout(() => setAnimate(true), 1500);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie_consent", "true");
    setAnimate(false);
    setTimeout(() => setShowBanner(false), 300); // Wait for animation to finish
  };
  const declineCookies = () => {
    localStorage.setItem("cookie_consent", "false");
    setAnimate(false);
    setTimeout(() => setShowBanner(false), 300); // Wait for animation to finish
  };

  if (!showBanner) return null;

  return (
    <div
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-5 w-[calc(100%-2.5rem)] md:w-auto bg-white dark:bg-[#424242] border border-black/10 dark:border-white/10 shadow-lg rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-md 
    transition-all duration-300 ease-in-out ${
      animate ? "translate-y-0 opacity-100" : "translate-y-32 opacity-0"
    }`}
    >
      <p className="text-sm text-gray-700 dark:text-gray-300">
        We use cookies to improve your experience. By using our site, you agree
        to our{" "}
        <a href="/privacy" className="text-blue-500 hover:underline">
          Privacy Policy
        </a>
        .
      </p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={declineCookies}
          className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={acceptCookies}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
