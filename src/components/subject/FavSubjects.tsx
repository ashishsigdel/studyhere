"use client";
import { Spinner } from "@/utils";
import { useEffect, useState, useRef } from "react";
import { myAxios } from "@/services/apiServices";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { bookThumbnail } from "@/data/BookThumbnail";
import TopBar from "./Topbar";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Props {}

export const FavSubjects: React.FC<Props> = ({}) => {
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<{ id: number; name: string }[]>([]);
  const user = useSelector((state: any) => state.auth.user);
  const router = useRouter();

  const [favSubjects, setFavSubjects] = useState<
    { id: number; name: string }[]
  >([]);

  useEffect(() => {
    const favoriteSubjects = JSON.parse(
      localStorage.getItem("favoriteSubjects") || "[]"
    );
    setFavSubjects(favoriteSubjects);
  }, [router]);

  const handleToggleFavorite = (subjectId: number, subjectName: string) => {
    let updatedFavSubjects = [...favSubjects];
    const index = updatedFavSubjects.findIndex((sub) => sub.id === subjectId);
    if (index === -1) {
      // Add to favorites
      updatedFavSubjects.push({ id: subjectId, name: subjectName });
      toast.success(`${subjectName} added to favorites!`);
    } else {
      // Remove from favorites
      updatedFavSubjects.splice(index, 1);
      toast.success(`${subjectName} removed from favorites.`);
    }
    setFavSubjects(updatedFavSubjects);
    localStorage.setItem(
      "favoriteSubjects",
      JSON.stringify(updatedFavSubjects)
    );
  };

  if (!user) {
    return null;
  }

  return (
    <div id="featured-subjects" className="mt-16">
      <div className="flex items-center justify-between mb-5 md:mb-12">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200">
          Favourite Subjects 📚
        </h2>
      </div>

      {loading && subjects.length === 0 && <Spinner />}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6">
        {!loading && subjects.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
            No favourite subjects available
          </div>
        )}
        {subjects.map((subject, index) => (
          <Link href={`/questions/${subject.id}`} key={index}>
            <div className="flex items-center w-full h-16 border border-black/10 dark:border-white/10 rounded-lg hover:scale-105 transition-transform duration-200 ease-in-out bg-white dark:bg-gray-800 shadow-sm hover:shadow-md">
              <Image
                src={bookThumbnail[`${index % bookThumbnail.length}`]}
                alt="Book Cover"
                className="w-16 h-16 object-cover rounded-l-lg shadow-md"
              />
              <div className="ml-2 pr-1">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-2">
                  {subject.name}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
