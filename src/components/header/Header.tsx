"use client";
import Theme from "@/utils/Theme";
import Image from "next/image";
import Profile from "./Profile";
import Link from "next/link";
import { useSelector } from "react-redux";
import { FaSearch } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const user = useSelector((state: any) => state.auth.user);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isSearchPage = pathname === "/search";

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function hanldeClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    }
    if (isSearchOpen) {
      document.addEventListener("mousedown", hanldeClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", hanldeClickOutside);
    };
  }, [isSearchOpen]);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (isSearchPage) {
      return;
    }
  };

  return (
    <div
      className={`h-16 sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-[#1e2024]/90 backdrop-blur-md shadow-md border-b border-gray-300 dark:border-gray-600"
          : "bg-[#e8eaec] dark:bg-[#2c2f34] border-b border-gray-300 dark:border-gray-600"
      }`}
    >
      <nav className="h-full max-w-[1400px] mx-auto flex items-center">
        <div className="w-full flex items-center justify-between px-4">
          {/* Logo and Search Section */}
          <div className="flex items-center">
            <Link href={"/"} className="mr-2 sm:mr-4">
              <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
                <Image
                  src={"/icon192.png"}
                  alt="logo"
                  width={30}
                  height={30}
                  className="rounded-full"
                />
                <h3
                  className={`text-xl sm:text-[26px] font-semibold customfont-typoround`}
                >
                  <span className="text-[#4caf50]">Learn</span>
                  Here
                </h3>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden min-[900px]:flex items-center justify-evenly gap-4 lg:gap-6">
            {pathname !== "/search" && (
              <li className="relative hidden min-[900px]:flex items-center">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    placeholder="Search for subjects, or resources..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="px-4 pr-12 py-2 w-[320px] border border-gray-300 rounded-full dark:bg-gray-800/50 dark:text-white dark:border-gray-600 focus:outline-none transition-all duration-300"
                  />
                  <button
                    type="submit"
                    className="absolute right-0 top-0 h-full px-4 flex items-center justify-center"
                  >
                    <FaSearch className="text-primary text-lg" />
                  </button>
                </form>
              </li>
            )}

            {user ? (
              <li className="hover:scale-105 transition-transform duration-200">
                <Profile />
              </li>
            ) : (
              <div className="flex items-center gap-3 lg:gap-5">
                <li className="hover:-translate-y-1 transition-transform duration-200">
                  <Link
                    href={"/login"}
                    className="text-sm hover:underline hover:text-primary transition-colors duration-300"
                  >
                    Login
                  </Link>
                </li>
                <div className="hover:scale-105 transition-transform duration-200">
                  <Link href={"/login?new=true"} className="text-sm">
                    <li className="px-2 py-1 border rounded-md border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300">
                      Join for Free
                    </li>
                  </Link>
                </div>
              </div>
            )}
            <Theme />
          </ul>
          {/* Navbar (Mobile) */}
          <ul className="flex min-[900px]:hidden items-center justify-evenly gap-4 lg:gap-6">
            <button
              className="p-2 text-gray-600 dark:text-gray-300 min-[900px]:hidden active:scale-90 transition-transform duration-150"
              onClick={toggleSearch}
            >
              <FaSearch className="text-lg" />
            </button>

            {user ? (
              <li className="hover:scale-105 transition-transform duration-200">
                <Profile />
              </li>
            ) : (
              <div className="flex items-center gap-3 lg:gap-5">
                <li className="hover:-translate-y-1 transition-transform duration-200">
                  <Link href={"/login"} className="text-sm">
                    Login
                  </Link>
                </li>
              </div>
            )}
          </ul>
        </div>
      </nav>

      {/* Mobile Search Overlay with animation */}
      {pathname !== "/search" && (
        <div
          ref={searchRef}
          className={`absolute top-16 left-0 w-full bg-[#e8eaec] dark:bg-[#2c2f34] p-4 border-b border-gray-300 dark:border-gray-600 min-[900px]:hidden shadow-lg transform transition-all duration-300 ${
            isSearchOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-full pointer-events-none"
          }`}
        >
          <div className="relative flex items-center">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search for subjects, or resources..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="px-4 pr-12 py-2 w-full border border-gray-300 rounded-full dark:bg-gray-800/50 dark:text-white dark:border-gray-600 focus:outline-none transition-all duration-300"
                autoFocus={isSearchOpen}
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-4 flex items-center justify-center"
              >
                <FaSearch className="text-primary text-lg" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
