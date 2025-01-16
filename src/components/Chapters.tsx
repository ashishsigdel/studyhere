"use client";
import { myAxios } from "@/utils/apiHanlde";
import { CheckAuth } from "@/utils/checkAuth";
import Theme from "@/utils/Theme";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Chapters() {
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

  return (
    <>
      <div className="flex justify-between w-full">
        <p className="text-3xl pb-1 border-b w-full">
          {subject} - All Chapters
        </p>
        <Theme />
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
        {loading && <>Loading...</>}
        {!loading && chapters.length === 0 && <>No chapters</>}
        {chapters &&
          chapters.length > 0 &&
          chapters.map((chapter, index) => (
            <div
              key={chapter.id}
              className="flex gap-2 items-center mt-1 border-b p-3"
            >
              <span>{index + 1}. </span>
              <Link href={`/${chapter.id}`} className="">
                {chapter.name}
              </Link>
            </div>
          ))}
      </div>
    </>
  );
}
