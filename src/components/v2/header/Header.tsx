"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import Profile from "./Profile";
import Theme from "@/utils/Theme";
import Link from "next/link";
import { User } from "@/types/user";

interface Props {
  style: string;
}

export default function Header({ style }: Props) {
  const searchParams = useSearchParams();
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");

      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const qParam = searchParams.get("q") || "";
    setSearchTerm(qParam);
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    // Preserve other query parameters
    const params = new URLSearchParams(searchParams.toString());
    params.set("q", searchTerm.trim());

    router.push(`/search?${params.toString()}`);
  };

  // Debounced navigation if already in /search
  useEffect(() => {
    if (pathname !== "/search") return;

    const delay = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("q", searchTerm.trim());
      router.push(`/search?${params.toString()}`);
    }, 500);

    return () => clearTimeout(delay);
  }, [searchTerm, pathname]);

  return (
    <div
      className={`flex h-[60px] items-center sticky top-0 z-[997] ${
        scrolled
          ? "border-b border-5 bg-gray-100/80 dark:bg-dark-bg/80 backdrop-blur-md shadow-sm"
          : "bg-gray-100 dark:bg-dark-bg"
      }`}
    >
      <div
        className={`${style} w-full flex items-center justify-between gap-4`}
      >
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full">
          <div className="relative flex items-center">
            <IoSearchSharp className="absolute left-3 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 rounded-full bg-white-variant dark:bg-dark-light-variant border-none outline-none text-gray-700 dark:text-gray-300 placeholder-gray-500 transition-all duration-200"
              placeholder="Search subjects or resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search content"
            />
          </div>
        </form>
        {user ? (
          <Profile user={user} setUser={setUser} />
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
