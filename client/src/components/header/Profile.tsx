"use client";

import { myAxios } from "@/services/apiServices";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { InstallPWA } from "../installPWA";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropDownRef = useRef<HTMLDivElement>(null);

  const updateUserFromLocalStorage = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  };

  useEffect(() => {
    updateUserFromLocalStorage();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "user") {
        updateUserFromLocalStorage();
      }
    };

    // Listen for custom event from within the same tab
    const handleUserUpdate = () => {
      updateUserFromLocalStorage();
    };

    // Add event listeners
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("user-update", handleUserUpdate);

    // Cleanup event listeners
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("user-update", handleUserUpdate);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await myAxios.post("/auth/logout", {});
    } catch (error) {
      console.log(error);
    } finally {
      localStorage.removeItem("user");
      setUser(null);
      window.dispatchEvent(new Event("user-update"));
      toast.success("Logged Out successfully!");
    }
  };

  const redirectToLogin = () => {
    const pathname = window.location.pathname;
    if (pathname !== "/login") {
      const currentUrl = encodeURIComponent(pathname);
      window.location.href = `/login?redirect=${currentUrl}`;
    }
  };

  useEffect(() => {
    function hanldeClickOutside(event: MouseEvent) {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", hanldeClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", hanldeClickOutside);
    };
  }, [dropdownOpen]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setDropdownOpen(false);
  };

  return (
    <div className="relative" ref={dropDownRef}>
      {user ? (
        <div className="w-10 h-10 flex items-center justify-center relative">
          {/* Profile Picture */}
          <Image
            src={user?.profilePic}
            alt="Profile Pic"
            width={40}
            height={40}
            className="w-[32px] h-[32px] rounded-lg cursor-pointer border border-gray-300 dark:border-gray-600"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 top-12 w-40 bg-[#e8eaec] dark:bg-[#2c2f34] border border-gray-300 dark:border-gray-600 shadow-md rounded-lg overflow-hidden p-1 z-[9999]">
              <button
                className="block w-full text-left px-4 py-2 rounded-md text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={toggleFullScreen}
              >
                Full Screen
              </button>
              <button
                className="block w-full text-left px-4 py-2 rounded-md text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={handleLogout}
              >
                Logout
              </button>
              <InstallPWA />
            </div>
          )}
        </div>
      ) : (
        <div
          className="py-1.5 px-2.5 rounded-lg cursor-pointer bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 text-sm md:text-base font-semibold"
          onClick={redirectToLogin}
        >
          Log In
        </div>
      )}
    </div>
  );
}
