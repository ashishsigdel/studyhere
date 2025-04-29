"use client";

import { useEffect, useRef } from "react";

// Define the type for Adsterra options
interface AdsterraOptions {
  key: string;
  format: string;
  height: number;
  width: number;
  params: Record<string, any>;
}

// Extend Window interface to include atOptions
declare global {
  interface Window {
    atOptions?: AdsterraOptions;
  }
}

const AdsterraAd: React.FC = () => {
  // Correctly type the ref as HTMLDivElement
  const adContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Only run this on the client side
    if (typeof window === "undefined") return;

    // Set Adsterra options globally with proper typing
    const adOptions: AdsterraOptions = {
      key: "95473735687bf944c324e2d064c8b389",
      format: "iframe",
      height: 90,
      width: 728,
      params: {},
    };

    window.atOptions = adOptions;

    // Create script tag for atOptions
    const optionsScript = document.createElement("script");
    optionsScript.type = "text/javascript";
    optionsScript.text = `atOptions = {
      'key': '95473735687bf944c324e2d064c8b389',
      'format': 'iframe',
      'height': 90,
      'width': 728,
      'params': {}
    };`;

    // Create script tag for invoke.js
    const invokeScript = document.createElement("script");
    invokeScript.type = "text/javascript";
    invokeScript.src =
      "//www.highperformanceformat.com/95473735687bf944c324e2d064c8b389/invoke.js";

    // Clean up function to remove scripts when component unmounts
    const cleanup = () => {
      if (adContainerRef.current) {
        try {
          if (optionsScript.parentNode) {
            optionsScript.parentNode.removeChild(optionsScript);
          }
          if (invokeScript.parentNode) {
            invokeScript.parentNode.removeChild(invokeScript);
          }
        } catch (e) {
          console.error("Error cleaning up ad scripts:", e);
        }
      }
    };

    // Add scripts to container
    if (adContainerRef.current) {
      adContainerRef.current.appendChild(optionsScript);
      adContainerRef.current.appendChild(invokeScript);
    }

    // Clean up on unmount
    return cleanup;
  }, []);

  return (
    <div
      ref={adContainerRef}
      className="adsterra-ad-container overflow-hidden"
      style={{
        minHeight: "90px",
        width: "728px",
        maxWidth: "100%",
        margin: "0 auto",
      }}
    />
  );
};

export default AdsterraAd;
