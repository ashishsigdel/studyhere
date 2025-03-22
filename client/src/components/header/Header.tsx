import Theme from "@/utils/Theme";
import Image from "next/image";
import React from "react";
import Profile from "./Profile";
import Link from "next/link";
import Pdf from "./Pdf";

export default function Header() {
  return (
    <div className="h-16 bg-gray-100 dark:bg-[#0c0d10] border-b border-gray-300 dark:border-gray-600 sticky top-0 z-50">
      <div className="h-full max-w-7xl mx-auto px-5 flex items-center">
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
              <h3 className="text-[26px] font-semibold customfont-typoround ">
                <span className="text-[#4caf50]">Study</span>
                Here
              </h3>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Pdf />
            <Theme />
            <Profile />
          </div>
        </div>
      </div>
    </div>
  );
}
