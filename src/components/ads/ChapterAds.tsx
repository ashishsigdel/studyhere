"use client";

import { useEffect } from "react";

export default function Sidebar() {
  useEffect(() => {
    try {
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-9557309412103379"
      data-ad-slot="8484275460"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
