"use client";
import { myAxios } from "@/services/apiServices";
import { CheckAuth } from "@/utils/checkAuth";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { saveDataToIndexedDB, loadDataFromIndexedDB } from "@/utils/indexdb";

const DB_STORE_NAME = "questions";

export default function useQuestions() {
  const params = useParams<{ chapterId: string }>();
  const id = params.chapterId;

  const [questions, setQuestions] = useState<
    {
      id: number;
      question: string;
      answer?: string;
      year?: string;
      marks?: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [chapter, setChapter] = useState("");
  const [subject, setSubject] = useState("");
  const [openedAnswer, setOpenedAnswer] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editQuestion, setEditQuestion] = useState<any>(null);
  const [modelFormChoose, setModelFormChoose] = useState<"question" | "answer">(
    "question"
  );
  const [openedAnswerIds, setOpenedAnswerIds] = useState<number[]>([]);
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [answers, setAnswers] = useState<Record<number, {}>>({});

  // State for form inputs
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    answer: "",
    year: "",
    marks: "",
  });

  const toggleAnswer = async (id: number) => {
    setOpenedAnswerIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        fetchAnswer(id);
        return [...prev, id];
      }
    });
  };

  const fetchAnswer = async (id: number) => {
    setLoadingAnswer(true);
    try {
      const response = await myAxios.get(`/answer/get/${id}`);
      setAnswers((prev) => ({
        ...prev,
        [id]: response?.data?.data,
      }));
    } catch (error: any) {
      toast.error(error?.response?.data.message || "Something went wrong!");
    } finally {
      setLoadingAnswer(false);
    }
  };

  const generateAnswer = async (questionId: number) => {
    setGeneratingAnswer(true);
    try {
      const response = await myAxios.get(`/ai/generate/${questionId}`);
      const data = response?.data?.data;
      setAnswers((prev) => ({
        ...prev,
        [questionId]: data,
      }));
    } catch (error: any) {
      toast.error(error?.response?.data.message || "Something went wrong!");
    } finally {
      setGeneratingAnswer(false);
    }
  };

  // Debounce search input (Wait 500ms before updating)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch Questions API with offline caching
  const fetchQuestions = async (pageNumber = 1, searchQuery = "") => {
    const cacheKey = `questions_${id}_${searchQuery}`;
    setLoading(true);

    // If offline, load from cache
    if (!navigator.onLine) {
      try {
        const cachedData = await loadDataFromIndexedDB(DB_STORE_NAME, cacheKey);
        if (cachedData) {
          const { questions, chapter, subject, totalPages } = cachedData;
          setQuestions(questions);
          setChapter(chapter);
          setSubject(subject);
          setTotalPages(totalPages);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
      return;
    }

    try {
      if (navigator.onLine) {
        const response = await myAxios.get(
          `/question/${id}?page=${pageNumber}&limit=30&search=${searchQuery}`
        );
        const data = response.data.data;
        if (pageNumber === 1) {
          setQuestions(data.allQuestions);
        } else {
          setQuestions((prev) => [...prev, ...data.allQuestions]);
        }
        setChapter(data.chapter.name);
        setSubject(data.chapter.subject.name);
        setTotalPages(data.totalPages);

        // Retrieve existing data from IndexedDB
        const existingData = await loadDataFromIndexedDB(
          DB_STORE_NAME,
          cacheKey
        );

        // Combine and remove duplicates based on question ID
        const existingQuestions = existingData?.questions || [];
        const allQuestions = [...existingQuestions, ...data.allQuestions];

        // Remove duplicate questions using a Map (assumes each question has a unique 'id')
        const uniqueQuestions = Array.from(
          new Map(allQuestions.map((q) => [q.id, q])).values()
        );

        // Save updated unique questions to IndexedDB
        await saveDataToIndexedDB(DB_STORE_NAME, cacheKey, {
          questions: uniqueQuestions,
          chapter: data.chapter.name,
          subject: data.chapter.subject.name,
          totalPages: data.totalPages,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch when component mounts or debounced search changes
  useEffect(() => {
    setPage(1);
    fetchQuestions(1, debouncedSearch);
  }, [debouncedSearch]);

  const fetchMoreQuestions = () => {
    if (page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchQuestions(nextPage, debouncedSearch);
    }
  };

  const handleSaveQuestion = async () => {
    const checkAuth = CheckAuth();

    if (!checkAuth) {
      toast.error("Unauthorized");
      return;
    }
    if (!navigator.onLine) {
      toast.error("You are offline!");
      return;
    }

    if (!newQuestion.question.trim()) {
      toast.error("Question cannot be empty");
      return;
    }

    setLoadingAdd(true);
    try {
      const response = await myAxios.post(`/question/create/${id}`, {
        question: newQuestion.question,
        answer: newQuestion.answer,
        year: newQuestion.year,
        marks: newQuestion.marks,
        createdBy: checkAuth.id,
      });

      setQuestions((prev) => [...prev, response.data.data]);

      toast.success("Question added successfully");
      setNewQuestion({
        question: "",
        answer: "",
        year: newQuestion.year,
        marks: "",
      });

      // Update cache
      const cacheKey = `questions_${id}_${debouncedSearch}`;
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        parsedData.questions.push(response.data.data);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoadingAdd(false);
    }
  };

  const handleDoubleClick = (question: any) => {
    setModelFormChoose("question");
    setEditQuestion(question);
    setShowModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editQuestion) return;
    const checkAuth = CheckAuth();
    if (!checkAuth) {
      toast.error("Unauthorized");
      return;
    }
    if (!navigator.onLine) {
      toast.error("You are offline!");
      return;
    }
    setLoadingEdit(true);
    try {
      await myAxios.put(`/question/update/${editQuestion.id}`, editQuestion);
      setQuestions((prev) =>
        prev.map((q) => (q.id === editQuestion.id ? editQuestion : q))
      );
      toast.success("Question updated successfully");
      setShowModal(false);

      // Update cache
      const cacheKey = `questions_${id}_${debouncedSearch}`;
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        parsedData.questions = parsedData.questions.map((q: any) =>
          q.id === editQuestion.id ? editQuestion : q
        );
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoadingEdit(false);
    }
  };

  const switchForm = () => {
    if (modelFormChoose === "answer") {
      setModelFormChoose("question");
    } else {
      setModelFormChoose("answer");
    }
  };

  return {
    chapter,
    subject,
    search,
    loading,
    setShowForm,
    setSearch,
    questions,
    fetchMoreQuestions,
    handleDoubleClick,
    openedAnswer,
    page,
    showModal,
    toggleAnswer,
    totalPages,
    switchForm,
    modelFormChoose,
    editQuestion,
    setEditQuestion,
    handleSaveEdit,
    loadingEdit,
    showForm,
    newQuestion,
    setNewQuestion,
    handleSaveQuestion,
    loadingAdd,
    setShowModal,
    openedAnswerIds,
    loadingAnswer,
    answers,
    generateAnswer,
    generatingAnswer,
  };
}
