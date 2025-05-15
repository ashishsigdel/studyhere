"use client";

import { useSelector } from "react-redux";
import Hero from "./Hero";
import RecentChapter from "./RecentChapter";
import { FeaturedSubjects } from "./FeaturedSubjects";
import { FavSubjects } from "./FavSubjects";
import { ButtonSimple } from "@/components/utils/Buttons";
import { useRouter } from "next/navigation";

export default function Home() {
  const user = useSelector((state: any) => state.auth.user);
  const router = useRouter();

  if (!user) {
    return (
      <div className="px-8 sm:px-10 mt-10 mx-auto max-w-7xl">
        <Hero />
        <FeaturedSubjects />
        <div className="mt-10 mb-20 flex flex-col items-center justify-center w-full text-center">
          <h3 className="font-bold text-[34px] customfont-inter">
            Didn&#39;t find what you were looking for?
          </h3>
          <ButtonSimple
            title="Try Searching..."
            onClick={() => router.push("/search")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 sm:px-10 mt-10 mx-auto max-w-7xl">
      <div className="border-b border-10 pb-10">
        <h3 className="font-bold text-[34px] customfont-inter">
          Welcome, {user.fullName.split(" ")[0]}!
        </h3>
        <p className="text-base text-gray-600 dark:text-gray-400">
          Ready to pick up where you left off, or start something new.
        </p>
      </div>
      <RecentChapter />
      <FavSubjects />
      <FeaturedSubjects />
      <div className="mt-10 mb-20 flex flex-col items-center justify-center w-full text-center">
        <h3 className="font-bold text-[34px] customfont-inter">
          Didn&#39;t find what you were looking for?
        </h3>
        <ButtonSimple
          title="Try Searching..."
          onClick={() => router.push("/search")}
        />
      </div>
    </div>
  );
}
