"use client";

import { myAxios } from "@/services/apiServices";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  return (
    <div className="relative">
      {user ? (
        <div>
          {/* Profile Picture */}
          <Image
            src={user?.profilePic}
            alt="Profile Pic"
            width={40}
            height={40}
            className="w-[41px] h-[41px] rounded-lg cursor-pointer border border-gray-300 dark:border-gray-600"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          className="py-2 px-3 rounded-lg cursor-pointer bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600"
          onClick={redirectToLogin}
        >
          <p className="text-[16px] font-semibold">Log In</p>
        </div>
      )}
    </div>
  );
}
