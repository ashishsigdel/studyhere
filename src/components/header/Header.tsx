"use client";
import Theme from "@/utils/Theme";
import Image from "next/image";
import Profile from "./Profile";
import Link from "next/link";
import Pdf from "./Pdf";
import SearchBar from "../question/SearchBar";
import { useParams } from "next/navigation";

export default function Header() {
  const params = useParams<{ chapterId: string }>();
  const id = params.chapterId;

  return (
    <div className="h-16 bg-[#e8eaec] dark:bg-[#2c2f34] border-b border-gray-300 dark:border-gray-600 sticky top-0 z-50">
      <div className="h-full max-w-6xl mx-auto px-5 flex items-center">
        <div className="w-full flex items-center justify-between">
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
                className={`text-[26px] font-semibold customfont-typoround ${
                  id ? "hidden sm:inline-block" : ""
                }`}
              >
                <span className="text-[#4caf50]">Study</span>
                Here
              </h3>
            </div>
          </Link>
          <div className="flex items-center justify-end gap-2 sm:gap-3 w-full max-w-[400px] ">
            {id && <SearchBar />}
            <Pdf />
            <Theme />
            <Profile />
          </div>
        </div>
      </div>
    </div>
  );
}
