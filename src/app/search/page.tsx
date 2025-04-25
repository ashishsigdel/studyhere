import React from "react";

export default function page() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 container">
      <div className="flex flex-col md:flex-row">
        <div className="w-1/5">sidebar</div>
        <div className="w-3/5">result</div>
        <div className="w-1/5">ads</div>
      </div>
    </div>
  );
}
