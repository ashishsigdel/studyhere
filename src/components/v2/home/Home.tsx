"use client";

import Hero from "./Hero";
import RecentChapter from "./RecentChapter";
import { FeaturedSubjects } from "./FeaturedSubjects";
import { FavSubjects } from "./FavSubjects";
import { ButtonSimple } from "@/components/utils/Buttons";
import { useRouter } from "next/navigation";
import { SuggestionSubjects } from "./SuggestionSubjects";
import { useEffect, useState } from "react";
import { User } from "@/types/user";

export default function Home() {
  const router = useRouter();
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

  if (!user?.fullName) {
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

  // Get first name safely
  const firstName = user.fullName.split(" ")[0] || "User";

  return (
    <div className="px-8 sm:px-10 mt-10 mx-auto max-w-7xl">
      <div className="border-b border-10 pb-10">
        <h3 className="font-bold text-[34px] customfont-inter">
          Welcome, {firstName}!
        </h3>
        <p className="text-base text-gray-600 dark:text-gray-400">
          Ready to pick up where you left off, or start something new.
        </p>
      </div>
      <RecentChapter />
      <FavSubjects />
      <SuggestionSubjects />
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
