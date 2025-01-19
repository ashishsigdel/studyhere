"use client";
import { myAxios } from "@/utils/apiHanlde";
import { CheckAuth } from "@/utils/checkAuth";
import Spinner from "@/utils/Spinner";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Subjects() {
  const [subjects, setSubjects] = useState<
    {
      id: number;
      name: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const [recentChapters, setRecentChapters] = useState<
    { name: string; url: string }[]
  >([]);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const response = await myAxios.get("/subject");
      setSubjects(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();

    const storedChapters = JSON.parse(
      localStorage.getItem("recentChapters") || "[]"
    );
    setRecentChapters(storedChapters);
  }, []);

  const handleSaveSubject = async () => {
    const checkAuth = CheckAuth();
    if (checkAuth) {
      try {
        const response = await myAxios.post("/subject", {
          name: subject,
        });

        setSubjects((prevSubjects) => [...prevSubjects, response.data.data]);

        toast.success("Subject created");
        setSubject("");
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    } else {
      toast.error("Unauthorized");
    }
  };

  return (
    <div className="flex flex-col">
      <div className="mt-4 mb-10">
        <h1>Add new subject</h1>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter subject name"
          className="p-3 mr-3"
        />
        <button onClick={handleSaveSubject} className="p-3 border rounded-md">
          Save
        </button>
      </div>

      {/* 🔹 Recently Viewed Chapters Section */}
      {recentChapters.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold">Recently Viewed Chapters</h2>
          <div className="mt-2">
            {recentChapters.map((chapter, index) => (
              <div key={index} className="p-2 border-b">
                <Link href={chapter.url} className="">
                  {chapter.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && <Spinner color="#222" />}
      {!loading && subjects.length === 0 && <>No subjects available</>}

      <h2 className="text-lg font-bold">All Subjects</h2>
      {subjects.length > 0 &&
        subjects.map((subject, index) => (
          <div
            key={subject.id}
            className="flex gap-2 items-center mt-1 border-b p-3"
          >
            <span>{index + 1}. </span>
            <Link href={`/${subject.id}`} className="">
              {subject.name}
            </Link>
          </div>
        ))}
    </div>
  );
}