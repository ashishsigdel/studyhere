"use client";
import { setMessage } from "@/redux/features/popupMessageSlice";
import { myAxios } from "@/services/apiServices";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

export default function useAnswers() {
  const [question, setQuestion] = useState<any>({});
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingNote, setLoadingNote] = useState(false);
  const [loadingNoteList, setLoadingNoteList] = useState(false);
  const [note, setNote] = useState<string>("");
  const [notePagination, setNotePagination] = useState({
    page: 1,
    total: 10,
  });
  const [noteSearchOpen, setNoteSearchOpen] = useState(false);
  const [noteSearchQuery, setNoteSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [noteList, setNoteList] = useState<any[]>([]);
  const dispatch = useDispatch();
  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(noteSearchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [noteSearchQuery]);

  const fetchAnswers = async (id: number) => {
    setLoading(true);

    try {
      const response = await myAxios.get(`/answer/get-all/${id}`);
      setNote("");
      setQuestion(response.data.data.question);
      setAnswers(response.data.data.answers);
    } catch (error: any) {
      console.log(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const fetchNote = async (id: number) => {
    setLoadingNote(true);
    try {
      const response = await myAxios.get(`/question/${id}`);
      setQuestion({});
      setAnswers([]);

      setNote(response.data.data?.note?.content);
    } catch (error: any) {
      dispatch(
        setMessage({
          message:
            error?.response?.data.message ||
            error.message ||
            "Something went wrong!",
          type: "error",
          showOn: "note-sidebar",
        })
      );
    } finally {
      setLoadingNote(false);
    }
  };

  const fetchNoteList = async () => {
    setLoadingNoteList(true);
    try {
      const response = await myAxios.get(
        `/chapter/get-note?page=${notePagination.page}&limit=10&search=${debouncedSearchQuery}`
      );
      const data = response.data.data;
      if (notePagination.page === 1) {
        setNoteList(data.chapters);
      } else {
        setNoteList((prev) => [...prev, ...data.chapters]);
      }
      setNotePagination({
        page: data.currentPage,
        total: data.totalPages,
      });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch note.");
    } finally {
      setLoadingNoteList(false);
    }
  };

  useEffect(() => {
    fetchNoteList();
  }, [debouncedSearchQuery, notePagination.page, noteSearchOpen]);

  return {
    question,
    loading,
    allAnswers: answers,
    setAnswers,
    fetchAnswers,
    note,
    fetchNote,
    notePagination,
    setNotePagination,
    noteList,
    noteSearchOpen,
    setNoteSearchOpen,
    noteSearchQuery,
    setNoteSearchQuery,
    setNoteList,
    loadingNote,
    loadingNoteList,
  };
}
