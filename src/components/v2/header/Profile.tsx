"use client";

import { myAxios } from "@/services/apiServices";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { removeAuth } from "@/redux/features/authSlice";
import { useRouter } from "next/navigation";

export default function Profile() {
  const user = useSelector((state: any) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropDownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await myAxios.post("/auth/logout", {});
    } catch (error) {
      console.log(error);
    } finally {
      localStorage.removeItem("accessToken");
      dispatch(removeAuth());
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
          <div className="ring-1 ring-primary ring-offset-2 ring-offset-gray-100 dark:ring-offset-dark-bg rounded-full">
            <Image
              src={user?.profilePic}
              alt="Profile Pic"
              width={40}
              height={40}
              className="w-[32px] h-[32px] object-cover rounded-full cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
          </div>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 top-12 w-40 bg-white dark:bg-[#424242] border border-gray-300 dark:border-gray-600 shadow-md rounded-lg overflow-hidden p-1 z-[9999]">
              <button
                className="block w-full text-left px-4 py-2 rounded-md text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-white/10"
                onClick={() => router.push("/profile")}
              >
                Profile
              </button>
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
            </div>
          )}
        </div>
      ) : (
        <div
          className="cursor-pointer text-sm md:text-base font-semibold"
          onClick={redirectToLogin}
        >
          Log In
        </div>
      )}
    </div>
  );
}
