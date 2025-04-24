"use client";
import { myAxios } from "@/services/apiServices";
import { CheckAuth } from "@/utils/checkAuth";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";
import AddModal from "./AddModal";

import ChapterAds from "../ads/ChapterAds";
import { FeaturedSubjects } from "./FeaturedSubjects";
import { FavSubjects } from "./FavSubjects";

export default function Subjects() {
  const [subject, setSubject] = useState("");
  const [recentChapters, setRecentChapters] = useState<
    { name: string; url: string; subject: string }[]
  >([]);

  const [showForm, setShowForm] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);

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

  return (
    <>
      <FavSubjects />

      <FeaturedSubjects showForm={showForm} setShowForm={setShowForm} />
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
