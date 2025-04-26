"use client";
import { myAxios } from "@/services/apiServices";
import { useParams, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AddModal from "./AddModal";
import { loadDataFromIndexedDB, saveDataToIndexedDB } from "@/utils/indexdb";
import { FaStar } from "react-icons/fa";
import ChaptersList from "./ChaptersList";
import Syllabus from "./Syllabus";
import Resources from "./Resources";

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

  const STORE_NAME = "chapters";

  const fetchChapters = async () => {
    try {
      try {
        const cachedChapters = await loadDataFromIndexedDB(
          STORE_NAME,
          `chapters_${id}`
        );
        if (cachedChapters) {
          setChapters(cachedChapters);
        } else {
          setLoading(true);
        }
      } catch (error) {
        setLoading(true);
      }

      if (navigator.onLine) {
        const response = await myAxios.get(`/chapter/${id}`);
        setChapters(response.data.data.chapters);
        setSubject(response.data.data.subject);

        await saveDataToIndexedDB(
          STORE_NAME,
          `chapters_${id}`,
          response.data.data
        );
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
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
    const init = async () => {
      setLoading(true);

      // Try loading from IndexedDB first
      const cachedData = await loadDataFromIndexedDB(
        STORE_NAME,
        `chapters_${id}`
      );
      if (cachedData) {
        setChapters(cachedData.chapters || []);
        setSubject(cachedData.subject || "");
        setLoading(false); // Stop loading spinner if cache found
      }

      // If online, fetch from API and update IndexedDB
      if (navigator.onLine) {
        try {
          const response = await myAxios.get(`/chapter/${id}`);
          const { chapters: fetchedChapters, subject: fetchedSubject } =
            response.data.data;

          setChapters(fetchedChapters);
          setSubject(fetchedSubject);

          // Save to IndexedDB for offline use
          await saveDataToIndexedDB(STORE_NAME, `chapters_${id}`, {
            chapters: fetchedChapters,
            subject: fetchedSubject,
          });
        } catch (err) {
          toast.error("Failed to fetch chapters online");
          console.error(err);
        }
      }

      setLoading(false);
    };

    if (id) init();
  }, [id]);

  const handleSaveChapter = async () => {
    if (!chapter) {
      toast.error("Chapter required!");
      return;
    }
    if (id) {
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

  const toggleForm = () => {
    setShowForm(!showForm);
  };
  return (
    <div className="flex flex-col overflow-hidden">
      {/* Header Section */}
      <div className="flex flex-col justify-between w-full border-b border-gray-200 dark:border-gray-700">
        <div className="w-full py-6 justify-between flex items-center">
          <div>
            <h2 className="text-3xl font-bold">Engineering Economics</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline-block text-gray-600 dark:text-gray-300 font-medium">
              Add to Favourite
            </span>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <FaStar
                size={20}
                className="text-yellow-400 hover:text-yellow-500"
              />
            </button>
          </div>
        </div>
      </div>

      <ChaptersList
        chapters={chapters}
        loading={loading}
        subject={subject}
        toggleForm={toggleForm}
      />
      <Syllabus />
      <Resources />

      {/* Add Chapter Modal */}
      {showForm && (
        <AddModal
          handleSaveChapter={handleSaveChapter}
          loading={loadingAdd}
          setShowForm={setShowForm}
          chapter={chapter}
          setChapter={setChapter}
        />
      )}
    </div>
  );
}
