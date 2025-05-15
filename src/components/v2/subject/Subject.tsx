"use client";
import { useSelector } from "react-redux";
import RecentChapter from "../home/RecentChapter";
import { FavSubjects } from "../home/FavSubjects";
import { FeaturedSubjects } from "../home/FeaturedSubjects";
import { ButtonSimple } from "@/components/utils/Buttons";
import { useRouter } from "next/navigation";

export default function Subject() {
  const user = useSelector((state: any) => state.auth.user);
  const router = useRouter();

  if (!user) {
    return (
      <div className="px-8 sm:px-10 mt-10 mx-auto max-w-7xl">
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
