"use client";
import Header from "@/components/v2/header/Header";
import Questions from "@/components/v2/questions/Questions";
import Image from "next/image";
import Link from "next/link";

export default function page() {
  return (
    <>
      <div className="flex items-center justify-between px-2 sm:px-6 gap-10 border-b border-5">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={"/logo.png"}
            alt="studyHere Logo"
            width={100}
            height={100}
            className="w-12 h-12 opacity-90 dark:hidden"
          />
          <Image
            src={"/logo_dark.png"}
            alt="studyHere Logo"
            width={100}
            height={100}
            className="w-12 h-12 opacity-90 hidden dark:block"
          />
          <h3 className="text-2xl customfont-typoround text-[#1e1e1e] dark:text-gray-200 opacity-90">
            <span className="text-primary">Study</span>Here
          </h3>
        </Link>
        <div className="flex-1">
          <Header style="" />
        </div>
      </div>
      <Questions />
    </>
  );
}
