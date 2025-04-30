"use client";
import { myAxios } from "@/services/apiServices";
import { CheckAuth } from "@/utils/checkAuth";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { saveDataToIndexedDB, loadDataFromIndexedDB } from "@/utils/indexdb";
import { useSelector } from "react-redux";
import { QuestionType } from "@/types/question";

const DB_STORE_NAME = "questions";

export default function useQuestions({ refresh }: { refresh?: () => void }) {
  const params = useParams<{ chapterId: string }>();
  const id = params.chapterId;
  const searchParams = useSearchParams();

  const search = searchParams.get("search");

  const [questions, setQuestions] = useState<QuestionType[]>([]);

  const [filteredQuestions, setFilteredQuestions] = useState<QuestionType[]>(
    []
  );

  const [loading, setLoading] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [chapter, setChapter] = useState("");
  const [subject, setSubject] = useState("");
  const [openedAnswer, setOpenedAnswer] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editQuestion, setEditQuestion] = useState<any>(null);
  const [openedAnswerIds, setOpenedAnswerIds] = useState<number[]>([]);
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [answers, setAnswers] = useState<Record<number, {}>>({});
  const user = useSelector((state: any) => state.auth.user);

  // State for form inputs
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    year: "",
    marks: "",
  });

  useEffect(() => {
    handleSearchChange(search || "");
  }, [search]);

  const handleSearchChange = (search: string) => {
    if (search.trim() === "") {
      setFilteredQuestions(questions);
    } else {
      const filtered = questions.filter(
        (q) =>
          q.question.toLowerCase().includes(search) ||
          q.year?.toString().includes(search)
      );
      setFilteredQuestions(filtered);
    }
  };

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

  const fetchQuestions = async () => {
    try {
      const response = await myAxios.get(`/question/${id}?page=1&limit=40`);
      const data = response.data.data;
      setQuestions(data.allQuestions);
      setFilteredQuestions(data.allQuestions);
      setChapter(data.chapter.name);
      setSubject(data.chapter.subject.name);
    } catch (err: any) {
      toast.error(
        err.response.data.message || "Failed to fetch chapters online"
      );
    }

    setLoading(false);
  };

  const handleSaveQuestion = async () => {
    if (!navigator.onLine) {
      toast.error("You are offline!");
      return;
    }

    if (
      !newQuestion.question.trim() ||
      newQuestion.question === "<p><br></p>"
    ) {
      toast.error("Question cannot be empty");
      return;
    }

    setLoadingAdd(true);
    try {
      await myAxios.post(`/question/create/${id}`, {
        question: newQuestion.question,
        year: newQuestion.year,
        marks: newQuestion.marks,
        createdBy: user.id,
      });

      toast.success("Question added successfully");
      setNewQuestion({
        question: "",
        year: newQuestion.year,
        marks: "",
      });

      refresh && refresh();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoadingAdd(false);
    }
  };

  const handleDoubleClick = (question: any) => {
    navigator.clipboard.writeText(question.question);
    toast.success("Question copied to clipboard");
  };
  const handleOpenModel = (question: any) => {
    setEditQuestion(question);
    setShowModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editQuestion) return;
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

      refresh && refresh();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoadingEdit(false);
    }
  };

  return {
    chapter,
    subject,
    search,
    loading,
    setShowForm,
    questions,
    handleDoubleClick,
    handleOpenModel,
    openedAnswer,
    showModal,
    toggleAnswer,
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
    fetchAnswer,
    handleSearchChange,
    filteredQuestions,
    fetchQuestions,
  };
}
