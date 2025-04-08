"use client";
import { myAxios } from "@/services/apiServices";
import { CheckAuth } from "@/utils/checkAuth";
import Spinner from "@/utils/Spinner";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import TopBar from "./Topbar";
import AddModal from "./AddModal";
import Image from "next/image";
import bookcover from "@/assets/bookcover.png";
import { saveDataToIndexedDB, loadDataFromIndexedDB } from "@/utils/indexdb";
import { FaRegStar, FaStar } from "react-icons/fa";
import CardAds from "../ads/CardAds";
import ChapterAds from "../ads/ChapterAds";
import { useRouter } from "next/navigation";

const STORE_NAME = "subjects";

export default function Subjects() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const [recentChapters, setRecentChapters] = useState<
    { name: string; url: string; subject: string }[]
  >([]);
  const [favSubjects, setFavSubjects] = useState<
    { id: number; name: string }[]
  >([]);
  const [showForm, setShowForm] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);

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

    const storedChapters = JSON.parse(
      localStorage.getItem("recentChapters") || "[]"
    );
    const favoriteSubjects = JSON.parse(
      localStorage.getItem("favoriteSubjects") || "[]"
    );
    setRecentChapters(storedChapters);
    setFavSubjects(favoriteSubjects);
  }, [router]);

  const handleSaveSubject = async () => {
    const checkAuth = CheckAuth();

    if (!subject) {
      toast.error("Subject required!");
      return;
    }
    if (checkAuth) {
      setLoadingAdd(true);
      try {
        if (navigator.onLine) {
          const response = await myAxios.post("/subject/create", {
            name: subject,
          });

          setSubjects((prevSubjects) => [...prevSubjects, response.data.data]);

          toast.success("Subject created");
          setSubject("");
          setShowForm(false);
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Something went wrong");
      } finally {
        setLoadingAdd(false);
      }
    } else {
      toast.error("Unauthorized");
    }
  };

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

  const renderSubject = (subject: { id: number; name: string }) => {
    const isFullStar = favSubjects.some((sub) => sub.id === subject.id);

    return (
      <div
        key={subject.id}
        className="relative border border-black/10 dark:border-white/30 shadow-lg rounded-lg overflow-hidden group"
      >
        <Link href={`/questions/${subject.id}`}>
          <h3 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-semibold px-4 py-1 rounded-md group-hover:scale-105 transition duration-300">
            {subject.name}
          </h3>
        </Link>

        <Image
          src={bookcover}
          alt={subject.name}
          className="pb-[0.8]"
          priority
        />
        <button
          className="absolute bottom-4 right-4 text-yellow-400 md:hidden group-hover:inline-block"
          onClick={() => handleToggleFavorite(subject.id, subject.name)}
        >
          {isFullStar ? <FaStar size={24} /> : <FaRegStar size={24} />}
        </button>
      </div>
    );
  };

  return (
    <>
      <TopBar showForm={showForm} setShowForm={setShowForm} />

      <div className="mt-10">
        {/* 🔹 Recently Viewed Chapters Section */}
        {favSubjects.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-5">
              Favorite Books 📚
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {favSubjects.map((subject) => (
                <div
                  key={subject.id}
                  className="relative border border-black/10 dark:border-white/30 shadow-lg rounded-lg overflow-hidden group"
                >
                  <Link href={`/questions/${subject.id}`}>
                    <h3 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-semibold px-4 py-1 rounded-md group-hover:scale-105 transition duration-300">
                      {subject.name}
                    </h3>
                  </Link>

                  <Image
                    src={bookcover}
                    alt={subject.name}
                    className="pb-[0.8]"
                    priority
                  />
                  <button
                    className="absolute bottom-4 right-4 text-yellow-400 md:hidden group-hover:inline-block"
                    onClick={() =>
                      handleToggleFavorite(subject.id, subject.name)
                    }
                  >
                    <FaStar size={24} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-5">
          Featured Subjects 📚
        </h2>
        {loading && <Spinner />}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {!loading && subjects.length === 0 && <>No subjects available</>}
          {subjects.map((subject, index) =>
            index > 0 && index % 3 === 0 // Insert CardAds after every 3 items
              ? [<CardAds key={`ad-${index}`} />, renderSubject(subject)]
              : [renderSubject(subject)]
          )}
        </div>
      </div>
      <div className="mt-10">
        <ChapterAds />
      </div>

      <div className="flex flex-col mt-10">
        {/* 🔹 Recently Viewed Chapters Section */}
        {recentChapters.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-5 mt-10">
              Recently Viewed Chapters 📖
            </h2>
            <div className="mt-2  grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentChapters.map((chapter, index) => (
                <Link
                  href={chapter.url}
                  key={index}
                  className="p-4 rounded-lg shadow-md border border-black/10 dark:border-white/30 transform transition duration-300 hover:scale-105"
                >
                  <h3 className="text-lg font-semibold">{chapter.name}</h3>
                  <p className="text-gray-500">{chapter.subject}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      {showForm && (
        <AddModal
          handleSaveSubject={handleSaveSubject}
          loading={loadingAdd}
          setShowForm={setShowForm}
          subject={subject}
          setSubject={setSubject}
        />
      )}
    </>
  );
}
