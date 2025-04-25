"use client";
import Theme from "@/utils/Theme";
import Image from "next/image";
import Profile from "./Profile";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { useRouter } from "next/navigation";

export default function Header() {
  const params = useParams<{ chapterId: string }>();
  const id = params.chapterId;
  const user = useSelector((state: any) => state.auth.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isSearchOpen) setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?search=${encodeURIComponent(searchTerm.trim())}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <div
      className={`h-16 sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-[#1e2024]/90 backdrop-blur-md shadow-md"
          : "bg-[#e8eaec] dark:bg-[#2c2f34] border-b border-gray-300 dark:border-gray-600"
      }`}
    >
      <nav className="h-full max-w-[1400px] mx-auto flex items-center">
        <div className="w-full flex items-center justify-between px-4">
          {/* Logo and Search Section */}
          <div className="flex items-center">
            {/* Mobile Menu Button */}
            <button
              className="mr-3 text-gray-600 dark:text-gray-300 md:hidden active:scale-90 transition-transform duration-150"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <HiX className="text-2xl transition-transform duration-300 rotate-0" />
              ) : (
                <HiMenu className="text-2xl transition-transform duration-300 rotate-0" />
              )}
            </button>
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

            {pathname === "/" && (
              <div className="relative hidden md:flex items-center">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    placeholder="Search for subjects, or resources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 pr-12 py-2 w-[320px] border border-gray-300 rounded-full dark:bg-gray-800/50 dark:text-white dark:border-gray-600 focus:outline-none transition-all duration-300"
                  />
                  <button
                    type="submit"
                    className="absolute right-0 top-0 h-full px-4 flex items-center justify-center"
                  >
                    <FaSearch className="text-primary text-lg" />
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center justify-evenly gap-4 lg:gap-6">
            <li className="hover:-translate-y-1 transition-transform duration-200">
              <Link
                href={"/subjects"}
                className="text-sm hover:text-primary transition-colors duration-300"
              >
                Subjects
              </Link>
            </li>
            <li className="hover:-translate-y-1 transition-transform duration-200">
              <Link
                href={"/resources"}
                className="text-sm hover:text-primary transition-colors duration-300"
              >
                Resources
              </Link>
            </li>
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
                  <Link href={"/login"} className="text-sm">
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
          <ul className="flex md:hidden items-center justify-evenly gap-4 lg:gap-6">
            {pathname === "/" && (
              <button
                className="p-2 text-gray-600 dark:text-gray-300 md:hidden active:scale-90 transition-transform duration-150"
                onClick={toggleSearch}
              >
                <FaSearch className="text-lg" />
              </button>
            )}
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
      <div
        className={`absolute top-16 left-0 w-full bg-[#e8eaec] dark:bg-[#2c2f34] p-4 border-b border-gray-300 dark:border-gray-600 md:hidden shadow-lg transform transition-all duration-300 ${
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
              onChange={(e) => setSearchTerm(e.target.value)}
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

      {/* Mobile Menu Overlay with animation */}
      <div
        className={`absolute top-16 left-0 w-full bg-[#e8eaec] dark:bg-[#2c2f34] border-b border-gray-300 dark:border-gray-600 md:hidden transform transition-all duration-300 ${
          isMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <ul className="flex flex-col p-4 gap-4">
          <li className="transform transition-all duration-300 hover:translate-x-2">
            <Link
              href={"/subjects"}
              className="block text-sm py-2 hover:text-primary transition-colors duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Subjects
            </Link>
          </li>
          <li className="transform transition-all duration-300 hover:translate-x-2">
            <Link
              href={"/resources"}
              className="block text-sm py-2 hover:text-primary transition-colors duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Resources
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
