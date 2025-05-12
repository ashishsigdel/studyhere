"use client";
import React, { useState, useEffect, useRef } from "react";

const DEFAULT_SIDEBAR_WIDTH = 30;

export default function useResizeWheel() {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    if (typeof window !== "undefined") {
      const savedWidth = localStorage.getItem("sidebarWidth");
      return savedWidth ? parseInt(savedWidth, 10) : DEFAULT_SIDEBAR_WIDTH;
    }
    return DEFAULT_SIDEBAR_WIDTH;
  });

  const isResizing = useRef(false);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem("sidebarWidth", sidebarWidth.toString());
  }, [sidebarWidth]);

  const startResizing = (e: React.MouseEvent) => {
    isResizing.current = true;
    e.preventDefault();
  };

  const stopResizing = () => {
    isResizing.current = false;
  };

  const resize = (e: MouseEvent) => {
    if (isResizing.current) {
      e.preventDefault();
      const newWidth = window.innerWidth - e.clientX;
      setSidebarWidth(Math.min(Math.max(newWidth, 30), 900));
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, []);

  useEffect(() => {
    const mainContent = mainContentRef.current;
    const sidebar = sidebarRef.current;

    if (!mainContent || !sidebar) return;

    let isMainScrolling = false;
    let isSidebarScrolling = false;
    let mainTimeout: NodeJS.Timeout;
    let sidebarTimeout: NodeJS.Timeout;

    const handleWheel = (event: WheelEvent, isMain: boolean) => {
      if (isMain) {
        isMainScrolling = true;

        clearTimeout(mainTimeout);
        mainTimeout = setTimeout(() => {
          isMainScrolling = false;
        }, 200);

        if (isSidebarScrolling) {
          event.preventDefault();
          return;
        }
      } else {
        isSidebarScrolling = true;

        clearTimeout(sidebarTimeout);
        sidebarTimeout = setTimeout(() => {
          isSidebarScrolling = false;
        }, 200);

        if (isMainScrolling) {
          event.preventDefault();
          return;
        }
      }
    };

    const handleMainWheel = (e: WheelEvent) => {
      handleWheel(e, true);
    };

    const handleSidebarWheel = (e: WheelEvent) => {
      handleWheel(e, false);
    };

    mainContent.addEventListener("wheel", handleMainWheel, { passive: false });
    sidebar.addEventListener("wheel", handleSidebarWheel, { passive: false });

    return () => {
      mainContent.removeEventListener("wheel", handleMainWheel);
      sidebar.removeEventListener("wheel", handleSidebarWheel);
      clearTimeout(mainTimeout);
      clearTimeout(sidebarTimeout);
    };
  }, []);

  return {
    mainContentRef,
    startResizing,
    sidebarRef,
    sidebarWidth,
    setSidebarWidth,
  };
}
