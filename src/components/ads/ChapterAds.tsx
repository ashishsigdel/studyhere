import React from "react";

export default function ChapterAds() {
  if (process.env.NEXT_PUBLIC_NODE_ENV === "development") return null;
  if (process.env.NEXT_PUBLIC_AD_SHOW === "false") return null;

  return <div className="h-40 bg-black rounded-lg">ChapterAds</div>;
}
