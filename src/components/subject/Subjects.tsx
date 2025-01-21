"use client";
import { myAxios } from "@/utils/apiHanlde";
import { CheckAuth } from "@/utils/checkAuth";
import Spinner from "@/utils/Spinner";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Theme from "@/utils/Theme";
import TopBar from "./Topbar";
import AddModal from "./AddModal";
import Image from "next/image";
import bookcover from "@/assets/bookcover.png";

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
  const [showForm, setShowForm] = useState(false);

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
    if (!subject) {
      toast.error("Subject required!");
      return;
    }
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
    <>
      <TopBar showForm={showForm} setShowForm={setShowForm} />

      <h2 className="text-2xl font-semibold text-gray-800 mb-5 mt-10">
        Featured Books 📚
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {subjects.map((subject) => (
          <Link
            href={`/${subject.id}`}
            key={subject.id}
            className="relative bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105"
          >
            <h3 className="absolute  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-semibold px-4 py-1 rounded-md">
              {subject.name}
            </h3>

            <Image src={bookcover} alt={subject.name} className="pb-[0.8]" />
          </Link>
        ))}
      </div>

      <div className="flex flex-col">
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
      {showForm && (
        <AddModal
          handleSaveSubject={handleSaveSubject}
          loading={loading}
          setShowForm={setShowForm}
          subject={subject}
          setSubject={setSubject}
        />
      )}
    </>
  );
}
