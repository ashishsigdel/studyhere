"use client";
import { myAxios } from "@/utils/apiHanlde";
import { CheckAuth } from "@/utils/checkAuth";
import Theme from "@/utils/Theme";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Spinner from "@/utils/Spinner";
import Breadcrumb from "./BreadCrumb";

export default function Chapters() {
  const pathname = usePathname();
  const params = useParams<{ subjectId: string }>();
  const id = params.subjectId;

  const [chapters, setChapters] = useState<
    {
      id: number;
      name: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [chapter, setChapter] = useState("");
  const [subject, setSubject] = useState("");

  const fetchChapters = async () => {
    setLoading(true);
    try {
      const response = await myAxios.get(`/chapter/${id}`);
      setChapters(response.data.data.chapters);
      setSubject(response.data.data.subject);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  const handleSaveChapter = async () => {
    const checkAuth = CheckAuth();
    if (checkAuth && id) {
      try {
        const response = await myAxios.post(`/chapter`, {
          name: chapter,
          subjectId: id,
        });

        setChapters((prevChapters) => [...prevChapters, response.data.data]);

        toast.success("Chapter created");
        setChapter("");
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Something went wrong");
      } finally {
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

    // Remove if already exists
    recentChapters = recentChapters.filter((ch: any) => ch.url !== chapterUrl);

    // Add new chapter at the beginning
    recentChapters.unshift({
      name: chapterName,
      url: chapterUrl,
      subject: subjectName,
    });

    if (recentChapters.length > 4) {
      recentChapters = recentChapters.slice(0, 4);
    }

    // Save updated list in localStorage
    localStorage.setItem(storageKey, JSON.stringify(recentChapters));
  };

  return (
    <>
      <div className="flex justify-between w-full">
        <Breadcrumb subject={subject} />
      </div>
      <div className="flex flex-col">
        <div className="mt-4 mb-10">
          <h1>Add new chapter</h1>
          <input
            type="text"
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            placeholder="Enter chapter name"
            className="p-3 mr-3"
          />
          <button onClick={handleSaveChapter} className="p-3 border rounded-md">
            Save
          </button>
        </div>
        {loading && <Spinner color="#222" />}
        {!loading && chapters.length === 0 && <>No chapters</>}
        {chapters &&
          chapters.length > 0 &&
          chapters.map((chapter, index) => (
            <div
              key={chapter.id}
              className="flex gap-2 items-center mt-1 border-b p-3"
            >
              <span>{index + 1}. </span>
              <Link
                href={`${pathname}/${chapter.id}`}
                className=""
                onClick={() =>
                  handleChapterClick(subject, chapter.name, chapter.id)
                }
              >
                {chapter.name}
              </Link>
            </div>
          ))}
      </div>
    </>
  );
}
