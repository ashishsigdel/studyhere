"use client";

import { useEffect, useState } from "react";

export default function Sidebar() {
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    try {
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
      // Fallback if ad doesn't load within 3 seconds
      const timeout = setTimeout(() => setAdLoaded(false), 3000);

      // Optional: Detect ad insertion success (very limited reliability)
      const observer = new MutationObserver(() => {
        setAdLoaded(true);
        clearTimeout(timeout);
      });

      const adElement = document.querySelector(".adsbygoogle");
      if (adElement) {
        observer.observe(adElement, { childList: true });
      }

      return () => {
        observer.disconnect();
        clearTimeout(timeout);
      };
    } catch (e) {
      console.error("AdSense error:", e);
      setAdLoaded(false);
    }
  }, []);

  return (
    <div className="min-h-[250px]">
      {!adLoaded && (
        <div className="bg-white dark:bg-gray-800/30 p-6 text-center text-sm border border-dashed border-black/20 dark:border-white/20 rounded-lg min-[900px]:min-h-[500px]">
          Advertisement space
        </div>
      )}
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-9557309412103379"
        data-ad-slot="8236029305"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
