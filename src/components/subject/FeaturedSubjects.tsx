"use client";
import { Spinner } from "@/utils";
import { useEffect, useState, useRef } from "react";
import { myAxios } from "@/services/apiServices";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { bookThumbnail } from "@/data/BookThumbnail";
import TopBar from "./Topbar";
import { loadDataFromIndexedDB, saveDataToIndexedDB } from "@/utils/indexdb";

const STORE_NAME = "subjects";

interface TopBarProps {
  showForm: boolean;
  setShowForm: (show: boolean) => void;
}

export const FeaturedSubjects: React.FC<TopBarProps> = ({
  showForm,
  setShowForm,
}) => {
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<{ id: number; name: string }[]>([]);
  const user = useSelector((state: any) => state.auth.user);

  const fetchSubjects = async () => {
    try {
      try {
        const cachedSubjects = await loadDataFromIndexedDB(
          STORE_NAME,
          "subjects"
        );
        if (cachedSubjects) {
          setSubjects(cachedSubjects);
        } else {
          setLoading(true);
        }
      } catch (error) {
        setLoading(true);
      }

      if (navigator.onLine) {
        const response = await myAxios.get("/subject");
        setSubjects(response.data.data);

        await saveDataToIndexedDB(STORE_NAME, "subjects", response.data.data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <div id="featured-subjects" className="mt-16">
      <div className="flex items-center justify-between mb-5 md:mb-12">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200">
          Featured Subjects 📚
        </h2>

        {user && <TopBar showForm={showForm} setShowForm={setShowForm} />}
      </div>

      {loading && subjects.length === 0 && <Spinner />}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6">
        {!loading && subjects.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
            No subjects available
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
