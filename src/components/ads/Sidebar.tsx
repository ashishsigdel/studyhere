"use client";

import Script from "next/script";

export default function Sidebar() {
  return (
    <div className="mx-auto mt-4" style={{ width: 300, height: 250 }}>
      {/* 🔹 Adsterra Ad Configuration */}
      <Script id="adsterra-config" strategy="afterInteractive">
        {`
          atOptions = {
            'key': '50609253b5034c4a53a422cf7f229cf3',
            'format': 'iframe',
            'height': 250,
            'width': 300,
            'params': {}
          };
        `}
      </Script>

      {/* 🔹 Adsterra Script Loader */}
      <Script
        id="adsterra-script"
        strategy="afterInteractive"
        src="//www.highperformanceformat.com/50609253b5034c4a53a422cf7f229cf3/invoke.js"
      />
    </div>
  );
}
