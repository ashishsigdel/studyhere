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
            src={"/icon-512.png"}
            alt="LearnHere Logo"
            width={100}
            height={100}
            className="rounded-full w-8 h-8"
          />
          <h3 className="text-2xl customfont-typoround text-gray-700 dark:text-gray-200">
            <span className="text-primary">Learn</span>Here
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
