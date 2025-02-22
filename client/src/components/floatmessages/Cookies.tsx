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

  if (!showBanner) return null;

  return (
    <div
      className={`fixed bottom-5 right-5 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 sm:p-5 flex items-center justify-between space-x-4 max-w-md border border-gray-300 dark:border-gray-700 
      transition-transform duration-300 ease-in-out ${
        animate ? "translate-x-0 opacity-100" : "translate-x-32 opacity-0"
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
      <button
        onClick={acceptCookies}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
      >
        Accept
      </button>
    </div>
  );
}
