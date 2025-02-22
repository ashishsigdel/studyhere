import React from "react";

export default function Floating({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed p-5 right-5 bottom-5 z-[9999] bg-white dark:bg-black rounded-lg">
      {children}
    </div>
  );
}
