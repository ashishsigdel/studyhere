"use client";
import { myAxios } from "@/services/apiServices";
import { CheckAuth } from "@/utils/checkAuth";
import Theme from "@/utils/Theme";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Spinner from "@/utils/Spinner";
import Breadcrumb from "./BreadCrumb";
import AddModal from "./AddModal";
import ChapterAds from "../ads/ChapterAds";

export default function Chapters() {
  const pathname = usePathname();
  const params = useParams<{ subjectId: string }>();
  const id = params.subjectId;

  const [chapters, setChapters] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [chapter, setChapter] = useState("");
  const [subject, setSubject] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetchChapters = async () => {
    try {
      if (navigator.onLine) {
        const response = await myAxios.get(`/chapter/${id}`);
        setChapters(response.data.data.chapters);
        setSubject(response.data.data.subject);

        localStorage.setItem(
          `chapters_${id}`,
          JSON.stringify(response.data.data)
        );
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (subject) {
      document.title = `${subject} - Chapters`;
    } else {
      document.title = "Chapters";
    }
  }, [subject]);

  useEffect(() => {
    try {
      const cachedData = localStorage.getItem(`chapters_${id}`);
      if (cachedData) {
        const { chapters, subject } = JSON.parse(cachedData);
        setChapters(chapters);
        setSubject(subject);
      } else {
        setLoading(true);
      }
    } catch (error) {
      setLoading(true);
    }

    fetchChapters();
  }, []);

  const handleSaveChapter = async () => {
    const checkAuth = CheckAuth();
    if (!chapter) {
      toast.error("Chapter required!");
      return;
    }
    if (checkAuth && id) {
      setLoadingAdd(true);
      try {
        if (navigator.onLine) {
          const response = await myAxios.post(`/chapter/create/${id}`, {
            name: chapter,
          });

          const newChapters = [...chapters, response.data.data];
          setChapters(newChapters);

          localStorage.setItem(
            `chapters_${id}`,
            JSON.stringify({ chapters: newChapters, subject })
          );

          toast.success("Chapter created");
          setChapter("");
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

  const handleChapterClick = (
    subjectName: string,
    chapterName: string,
    chapterId: number
  ) => {
    const storageKey = "recentChapters";
    const chapterUrl = `${pathname}/${chapterId}`;

    let recentChapters = JSON.parse(localStorage.getItem(storageKey) || "[]");

    recentChapters = recentChapters.filter((ch: any) => ch.url !== chapterUrl);
    recentChapters.unshift({
      name: chapterName,
      url: chapterUrl,
      subject: subjectName,
    });

    if (recentChapters.length > 4) {
      recentChapters = recentChapters.slice(0, 4);
    }

    localStorage.setItem(storageKey, JSON.stringify(recentChapters));
  };

  return (
    <>
      <div className="flex justify-between w-full border-b border-gray-300 dark:border-gray-600">
        <Breadcrumb
          subject={subject}
          showForm={showForm}
          setShowForm={setShowForm}
        />
      </div>
      <ChapterAds />
      <div className="flex flex-col mt-5">
        {loading && <Spinner color="#222" />}
        {!navigator.onLine && chapters.length === 0 && <>You are offline. </>}
        {!loading && chapters.length === 0 && <>No chapters</>}
        {chapters.length > 0 &&
          chapters.map((chapter, index) => (
            <div
              key={chapter.id}
              className="flex gap-2 items-center mt-1 border-b border-gray-200 dark:border-gray-700 p-3"
            >
              <span>{index + 1}. </span>
              <Link
                href={`${pathname}/${chapter.id}`}
                onClick={() =>
                  handleChapterClick(subject, chapter.name, chapter.id)
                }
              >
                {chapter.name}
              </Link>
            </div>
          ))}
      </div>
      {showForm && (
        <AddModal
          handleSaveChapter={handleSaveChapter}
          loading={loadingAdd}
          setShowForm={setShowForm}
          chapter={chapter}
          setChapter={setChapter}
        />
      )}
    </>
  );
}
