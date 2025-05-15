"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { useSelector } from "react-redux";
import Profile from "./Profile";
import Theme from "@/utils/Theme";
import Link from "next/link";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const user = useSelector((state: any) => state.auth.user);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div
      className={`flex h-16 items-center sticky top-0 z-[997] ${
        scrolled
          ? "border-b border-5 bg-gray-100/80 dark:bg-dark-bg/80 backdrop-blur-md shadow-sm"
          : "bg-gray-100 dark:bg-dark-bg"
      }`}
    >
      <div className="max-w-7xl ml-10 sm:mx-auto w-full flex items-center justify-between gap-4 px-4 md:px-8">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full">
          <div className="relative flex items-center">
            <IoSearchSharp className="absolute left-3 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 rounded-full bg-white-variant dark:bg-dark-light-variant border-none outline-none text-gray-700 dark:text-gray-300 placeholder-gray-500 transition-all duration-200"
              placeholder="Search subjects or resources..."
              value={searchTerm}
              onChange={handleSearchChange}
              aria-label="Search content"
            />
          </div>
        </form>
        {user ? (
          <Profile />
        ) : (
          <Link
            href={`/login?redirect=${encodeURIComponent(pathname)}`}
            className="px-3 py-1.5 text-sm rounded-md border border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-300"
          >
            Login
          </Link>
        )}
        <Theme />
      </div>
    </div>
  );
}
