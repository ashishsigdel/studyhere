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
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-10">
        📚 Book Store
      </h1>

      <h2 className="text-2xl font-semibold text-gray-800 mb-5">
        Featured Books
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {subjects.map((book) => (
          <div
            key={book.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105"
          >
            {/* <Image
              src={
                "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.canva.com%2Fbook-covers%2Ftemplates%2F&psig=AOvVaw0Mk8v5M9hT6wZ4qmcU08f7&ust=1737568035099000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCPjO_r6vh4sDFQAAAAAdAAAAABAk"
              }
              alt={book.name}
              className="w-full h-56 object-cover"
            /> */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {book.name}
              </h3>
            </div>
          </div>
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
