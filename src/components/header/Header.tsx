"use client";
import Theme from "@/utils/Theme";
import Image from "next/image";
import Profile from "./Profile";
import Link from "next/link";
import { useSelector } from "react-redux";
import { FaSearch } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IoSearchSharp } from "react-icons/io5";
import { useTheme } from "next-themes";

export default function Header() {
  const user = useSelector((state: any) => state.auth.user);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isSearchPage = pathname === "/search";
  const { theme } = useTheme();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle click outside search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
  };

  return (
    <header
      className={`h-12 sticky top-0 transition-all duration-300 ease-in-out z-[999] bg-white/80 dark:bg-[#1e2024]/80 border-gray-200 dark:border-gray-700 border-b ${
        scrolled ? "backdrop-blur-md shadow-sm " : ""
      }`}
    >
      <nav className="h-full max-w-[1400px] mx-auto px-4">
        <div className="h-full flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center flex-1">
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src={
                  theme == "dark"
                    ? "/learnhere_logo_dark.png"
                    : "/learnhere_logo.png"
                }
                alt="LearnHere Logo"
                width={100}
                height={100}
                className="rounded-full w-10 h-10 transition-transform duration-300"
              />
              <h3 className="text-lg sm:text-xl font-semibold tracking-tight customfont-typoround text-[#737373] dark:text-[#f1f1f1]">
                <span className="text-primary">Learn</span>Here
              </h3>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {pathname !== "/search" && (
              <form
                onSubmit={handleSearchSubmit}
                className="hidden md:flex items-center"
              >
                <div className="relative flex items-center w-64 lg:w-80">
                  <IoSearchSharp className="absolute left-3 text-gray-500 dark:text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-1 rounded-full bg-white-light-variant dark:bg-dark-light-variant border-none outline-none text-gray-700 dark:text-gray-300 placeholder-gray-500 transition-all duration-200"
                    placeholder="Search subjects or resources..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    aria-label="Search content"
                  />
                </div>
              </form>
            )}

            <div className="flex items-center space-x-4">
              <Theme />
              {user ? (
                <Profile />
              ) : (
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-sm rounded-md border border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-300"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center space-x-4">
            <button
              onClick={toggleSearch}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors duration-200"
              aria-label="Search"
            >
              <FaSearch className="text-xl" />
            </button>
            <Theme />
            {user ? (
              <Profile />
            ) : (
              <Link
                href="/login"
                className="text-sm px-2.5 py-1 rounded-md border border-primary text-primary"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Search Overlay */}
      {pathname !== "/search" && (
        <div
          ref={searchRef}
          className={`absolute top-14 left-0 w-full bg-[#e8eaec] dark:bg-[#2c2f34] p-3 border-b border-gray-200 dark:border-gray-700 md:hidden shadow-md transition-all duration-300 ease-in-out ${
            isSearchOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-full pointer-events-none"
          }`}
        >
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search subjects or resources..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 pl-12 rounded-full bg-white dark:bg-[#424242] border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
              autoFocus
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          </form>
        </div>
      )}
    </header>
  );
}
