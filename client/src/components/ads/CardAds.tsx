import React from "react";

export default function CardAds() {
  if (process.env.NEXT_PUBLIC_NODE_ENV === "development") return null;
  if (process.env.NEXT_PUBLIC_AD_SHOW === "false") return null;
  return (
    <div className="relative bg-black rounded-lg overflow-hidden group">
      CardAds
    </div>
  );
}
