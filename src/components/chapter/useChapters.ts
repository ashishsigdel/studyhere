"use client";
import { myAxios } from "@/services/apiServices";
import { SubjectType } from "@/types/subject";
import { useParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function useChapters() {
  const params = useParams<{ slug: string }>();
  const id = params.slug;
  const user = useSelector((state: any) => state.auth.user);

  const [chapters, setChapters] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [chapter, setChapter] = useState("");
  const [subject, setSubject] = useState<SubjectType | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const fetchChapters = async () => {
    setLoading(true);
    if (navigator.onLine) {
      try {
        const response = await myAxios.get(
          `/chapter/${id}?userId=${user ? user.id : ""}`
        );
        const { chapters: fetchedChapters, subject: fetchedSubject } =
          response.data.data;

        setChapters(fetchedChapters);
        setSubject(fetchedSubject);
        setIsFavorite(fetchedSubject.isSaved);
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

  const toggleSaved = async () => {
    try {
      setIsFavorite(!isFavorite);
      await myAxios.post(`/subject/add-fav/${id}`);
    } catch (error: any) {
      toast.error(error.response.data.message || "Something went wrong!");
      setIsFavorite(!isFavorite);
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
    toggleSaved,
    isFavorite,
  };
}
