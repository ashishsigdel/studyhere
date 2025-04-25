"use client";
import Theme from "@/utils/Theme";
import Image from "next/image";
import Profile from "./Profile";
import Link from "next/link";
import SearchBar from "../question/SearchBar";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { FaSearch } from "react-icons/fa";

export default function Header() {
  const params = useParams<{ chapterId: string }>();
  const id = params.chapterId;
  const user = useSelector((state: any) => state.auth.user);

  return (
    <div className="h-16 bg-[#e8eaec] dark:bg-[#2c2f34] border-b border-gray-300 dark:border-gray-600 sticky top-0 z-50">
      <nav className="h-full max-w-[1400px] mx-auto flex items-center">
        <div className="w-full flex items-center justify-between px-7 min-[1447.5px]:px-0">
          <div className="flex items-center justify-evenly gap-4 md:gap-8">
            <Link href={"/"}>
              <div className="flex items-center gap-3">
                <Image
                  src={"/icon192.png"}
                  alt="logo"
                  width={30}
                  height={30}
                  className="rounded-full"
                />
                <h3
                  className={`text-[26px] font-semibold customfont-typoround hidden sm:inline-block`}
                >
                  <span className="text-[#4caf50]">Learn</span>
                  Here
                </h3>
              </div>
            </Link>
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search for subjects, or resources..."
                className="px-4 pr-12 py-2 w-[250px] sm:w-[300px] md:w-[350px] border border-gray-300 rounded-full dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none transition-all duration-300"
              />
              <FaSearch className="absolute text-primary text-lg right-4 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          <ul className="flex items-center justify-evenly gap-4 md:gap-6">
            <li>
              <Link href={"/subjects"} className="text-sm hover:text-primary">
                Subjects
              </Link>
            </li>
            <li>
              <Link href={"/resources"} className="text-sm hover:text-primary">
                Resources
              </Link>
            </li>
            {user ? (
              <li>
                <Profile />
              </li>
            ) : (
              <div className="flex items-center gap-5">
                <li>
                  <Link
                    href={"/login"}
                    className="text-sm hover:underline hover:text-primary"
                  >
                    Login
                  </Link>
                </li>
                <Link href={"/login"} className="text-sm">
                  <li className="px-2 py-1 border rounded-md border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300">
                    Join for Free
                  </li>
                </Link>
              </div>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
}
