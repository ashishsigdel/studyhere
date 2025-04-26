"use client";
import { myAxios } from "@/services/apiServices";
import { loadDataFromIndexedDB, saveDataToIndexedDB } from "@/utils/indexdb";
import { useParams, usePathname } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function useChapters() {
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
  return {
    fetchChapters,
    handleSaveChapter,
    subject,
    setSubject,
    chapters,
    loading,
    loadingAdd,
    chapter,
    setChapter,
    showForm,
    setShowForm,
    id,
  };
}
