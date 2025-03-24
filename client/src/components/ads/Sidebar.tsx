import React from "react";

export default function Sidebar() {
  if (process.env.NEXT_PUBLIC_NODE_ENV === "development") return null;
  if (process.env.NEXT_PUBLIC_AD_SHOW === "false") return null;

  return <div className="w-72 bg-black">sidebar</div>;
}
