"use client";
import { useState, useEffect } from "react";
import { HiMiniBars3CenterLeft } from "react-icons/hi2";
import FullSidebar from "./FullSidebar";

export default function Sidebar() {
  const [sidebarWidth, setSidebarWidth] = useState<"full" | "min">("full");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1279px)");
    setSidebarWidth(mediaQuery.matches ? "min" : "full");
  }, []);

  const toggleSidebar = () => {
    setSidebarWidth((prev) => (prev === "full" ? "min" : "full"));
  };

  return (
    <>
      {sidebarWidth === "full" && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-30 z-[998] xl:hidden transition-opacity duration-300"
        />
      )}
      {/* For Small Device */}
      <button
        onClick={toggleSidebar}
        className="p-2 mr-2 rounded-full hover:bg-white-variant dark:hover:bg-dark-variant transition-colors fixed top-3 left-2 z-[999] sm:hidden"
        aria-label="Collapse sidebar"
      >
        <HiMiniBars3CenterLeft size={24} />
      </button>

      {/* For medium Device */}
      <FullSidebar
        style="hidden sm:inline sticky top-0 xl:hidden"
        toggleSidebar={toggleSidebar}
        sidebarWidth="min"
      />

      {/* For small and medium */}
      <FullSidebar
        style={`xl:hidden shadow-xl fixed top-0 left-0 transition-transform duration-300 ease-in-out ${
          sidebarWidth === "full"
            ? "translate-x-0 opacity-100 pointer-events-auto"
            : "-translate-x-full opacity-0 pointer-events-none"
        }`}
        toggleSidebar={toggleSidebar}
        sidebarWidth="full"
      />

      {/* For large Device */}
      <FullSidebar
        style="hidden xl:inline sticky top-0"
        toggleSidebar={toggleSidebar}
        sidebarWidth={sidebarWidth}
      />
    </>
  );
}
