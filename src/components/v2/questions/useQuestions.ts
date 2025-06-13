"use client";
import { myAxios } from "@/services/apiServices";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AnswerType, QuestionType } from "@/types/question";
import { User } from "@/types/user";

export default function useQuestions({ refresh }: { refresh?: () => void }) {
  const params = useParams<{ slug: string; chapterId: string }>();

  const id = params.chapterId;
  const slug = params.slug;
  const router = useRouter();

  const searchParams = useSearchParams();

  const search = searchParams.get("search");

  const [questions, setQuestions] = useState<QuestionType[]>([]);

  const [filteredQuestions, setFilteredQuestions] = useState<QuestionType[]>(
    []
  );
  const [prevChapter, setPrevChapter] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [nextChapter, setNextChapter] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [chapter, setChapter] = useState("");
  const [type, setType] = useState<"q&a" | "note">("q&a");
  const [note, setNote] = useState("");

  const [subject, setSubject] = useState("");
  const [openedAnswer, setOpenedAnswer] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editQuestion, setEditQuestion] = useState<any>(null);
  const [openedAnswerIds, setOpenedAnswerIds] = useState<number[]>([]);
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [answers, setAnswers] = useState<
    Record<number, { answer: AnswerType; otherAnswersCount: number }>
  >({});
  const [user, setUser] = useState<User | null>(null);

  const [notFoundResponse, setNotFoundResponse] = useState(false);
  const [privateRespons, setPrivateRespons] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(user);
  }, []);

  const [answerStates, setAnswerStates] = useState<{ [key: number]: string }>(
    {}
  );
  const [saving, setSaving] = useState(false);
  const [openEditors, setOpenEditors] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [editorMode, setEditorMode] = useState<"none" | "add" | "edit">("none");

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
    setLoading(true);

    try {
      const response = await myAxios.get(`/question/${id}?page=1&limit=40`);
      const data = response.data.data;

      if (slug !== data.subject.slug) {
        router.replace(`/subject/${data.subject.slug}/${id}`);
      }
      setChapter(data.chapter.name);

      setType(data.chapter.type);
      setSubject(data.subject.name);
      setPrevChapter(data.prevChapter);
      setNextChapter(data.nextChapter);
      if (data.chapter.type === "q&a") {
        setQuestions(data.allQuestions);
        setFilteredQuestions(data.allQuestions);
      } else {
        setNote(data?.note?.content);
      }
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
      if (!user) return;
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

      fetchQuestions();
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

  const handleAnswerAdd = async (id: number) => {
    // Clear any existing answer states first
    {
      setAnswerStates((prev) => ({
        ...prev,
        [id]: "",
      }));
    }
    setEditorMode("add");
    setOpenEditors((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  const handleAnswerEdit = async (id: number) => {
    if (!user) return;
    {
      setAnswerStates((prev) => ({
        ...prev,
        [id]:
          answers[id]?.answer?.user?.id === user?.id || user.role === "admin"
            ? answers[id]?.answer?.answer
            : "",
      }));
    }
    setEditorMode("edit");
    setOpenEditors((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  const handleCancel = (id: number) => {
    setOpenEditors((prev) => ({
      ...prev,
      [id]: false,
    }));

    // Clear the specific answer state
    setAnswerStates((prev) => {
      const newStates = { ...prev };
      delete newStates[id];
      return newStates;
    });
  };

  const saveAnswer = async (type: string, id: number) => {
    if (!answerStates[id]?.trim()) {
      toast.error("Answer cannot be empty!");
      return;
    }

    setSaving(true);
    try {
      if (!user) return;
      if (editorMode === "add") {
        await myAxios.post(`/answer/add/${id}`, { answer: answerStates[id] });
      } else if (user.role === "admin") {
        await myAxios.put(`/answer/update-admin/${answers[id].answer.id}`, {
          answer: answerStates[id],
        });
      } else {
        await myAxios.put(`/answer/update/${id}`, { answer: answerStates[id] });
      }
      fetchAnswer(id);
      toast.success("Answer saved successfully!");

      setOpenEditors((prev) => ({
        ...prev,
        [id]: false,
      }));
      setAnswerStates((prev) => {
        const newStates = { ...prev };
        delete newStates[id];
        return newStates;
      });
      setEditorMode("none");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await myAxios.delete(`/question/delete/${id}`);
      setShowModal(false);
      toast.success("Question deleted.");
      fetchQuestions();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    }
  };

  const handleToggleFlag = async (id: number) => {
    try {
      // await myAxios.delete(`/question/delete/${id}`);
      setShowModal(false);
      toast.success("Flag Added.");
      fetchQuestions();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    }
  };

  useEffect(() => {
    return () => {
      setAnswerStates({});
      setOpenEditors({});
    };
  }, []);

  return {
    chapter,
    type,
    note,
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
    user,
    openEditors,
    saveAnswer,
    saving,
    handleCancel,
    handleAnswerEdit,
    handleAnswerAdd,
    answerStates,
    setAnswerStates,
    handleDelete,
    handleToggleFlag,
    prevChapter,
    nextChapter,
    notFoundResponse,
    privateRespons,
  };
}
