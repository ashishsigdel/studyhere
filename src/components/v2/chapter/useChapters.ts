"use client";
import { setMessage } from "@/redux/features/popupMessageSlice";
import { myAxios } from "@/services/apiServices";
import { SubjectType } from "@/types/subject";
import { User } from "@/types/user";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

export default function useChapters() {
  const params = useParams<{ slug: string }>();
  const id = params.slug;
  const dispatch = useDispatch();

  const [chapters, setChapters] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [chapter, setChapter] = useState("");
  const [type, setType] = useState<"q&a" | "note">("q&a");
  const [subject, setSubject] = useState<SubjectType | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const [showSettings, setShowSettings] = useState(false);

  const [user, setUser] = useState<User | null>(null);

  const [visibility, setVisibility] = useState<
    "public" | "private" | "view-only"
  >("public");

  const [notFoundResponse, setNotFoundResponse] = useState(false);
  const [privateRespons, setPrivateRespons] = useState(false);

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");

      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }, []);

  const fetchChapters = async () => {
    setLoading(true);

    try {
      const response = await myAxios.get(`/chapter/${id}`);
      const { chapters: fetchedChapters, subject: fetchedSubject } =
        response.data.data;

      setChapters(fetchedChapters);
      setSubject(fetchedSubject);
      setIsFavorite(fetchedSubject.isSaved);
      setVisibility(fetchedSubject.visibility);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setNotFoundResponse(true);
      } else if (err?.response?.status === 403) {
        setPrivateRespons(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateVisibility = async (
    visibility: "public" | "private" | "view-only"
  ) => {
    try {
      await myAxios.put(`/subject/update-visibility/${id}`, { visibility });
      setVisibility(visibility);
      dispatch(
        setMessage({
          message: "Visibility updated",
          type: "success",
          showOn: "chapter-settings",
        })
      );
    } catch (error: any) {
      dispatch(
        setMessage({
          message:
            error?.response?.data.message ||
            error.message ||
            "Something went wrong!",
          type: "error",
          showOn: "chapter-settings",
        })
      );
    }
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
            type,
          });

          const newChapters = [...chapters, response.data.data];
          setChapters(newChapters);

          toast.success("Chapter created");
          setChapter("");
        }
      } catch (error: any) {
        dispatch(
          setMessage({
            message:
              error?.response?.data.message ||
              error.message ||
              "Something went wrong!",
            type: "error",
            showOn: "chapter-add-modal",
          })
        );
      } finally {
        setLoadingAdd(false);
      }
    } else {
      toast.error("Unauthorized");
    }
  };

  const handleImport = async () => {
    setLoading(true);
    try {
      await myAxios.post(`/chapter/import/${id}`);
      fetchChapters();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
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
    handleImport,
    type,
    setType,
    showSettings,
    setShowSettings,
    visibility,
    updateVisibility,
    notFoundResponse,
    privateRespons,
  };
}
