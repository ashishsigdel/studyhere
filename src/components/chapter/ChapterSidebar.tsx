"use client";

import { useEffect, useState } from "react";
import useNavigation from "./useNavigation";

export default function ChapterSidebar() {
  const [adLoaded, setAdLoaded] = useState(false);
  const { isActive, scrollToSection, MenuData } = useNavigation();

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
    <div className="min-[900px]:min-h-[250px]">
      {/* Navigation Links */}
      <div className="p-4">
        <h3 className="font-medium mb-3">Navigation</h3>
        <nav className="space-y-2">
          {MenuData.map((menu) => (
            <button
              key={menu.id}
              onClick={() => scrollToSection(menu.link)}
              className={`w-full flex items-center gap-2 text-sm p-2 rounded-md transition-colors ${
                isActive(menu.link)
                  ? "font-semibold text-black dark:text-white"
                  : "font-normal text-gray-800 dark:text-gray-300"
              }`}
            >
              <span className="capitalize">{menu.name}</span>
            </button>
          ))}
        </nav>
      </div>
      {/* {!adLoaded && (
        <div className="bg-white dark:bg-gray-800/30 p-6 text-center text-sm border border-dashed border-black/20 dark:border-white/20 rounded-lg min-[900px]:min-h-[500px]">
          Advertisement space
        </div>
      )} */}
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
