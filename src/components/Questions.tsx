"use client";
import { myAxios } from "@/utils/apiHanlde";
import { CheckAuth } from "@/utils/checkAuth";
import Theme from "@/utils/Theme";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Questions() {
  const router = useRouter();
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

  // State for form inputs
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    answer: "",
    year: "",
    marks: "",
  });

  const toggleAnswer = (id: number) => {
    setOpenedAnswer((prev) => (prev === id ? null : id));
  };

  // Debounce search input (Wait 500ms before updating)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch Questions API
  const fetchQuestions = async (pageNumber = 1, searchQuery = "") => {
    setLoading(true);
    try {
      const response = await myAxios.get(
        `/question/${id}?page=${pageNumber}&limit=15&search=${searchQuery}`
      );
      const data = response.data.data;
      if (pageNumber === 1) {
        setQuestions(data.allQuestions); // Reset for new search
      } else {
        setQuestions((prev) => [...prev, ...data.allQuestions]); // Append for pagination
      }
      setChapter(data.chapter.name);
      setSubject(data.chapter.subject.name);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch when component mounts or debounced search changes
  useEffect(() => {
    setPage(1); // Reset to first page on new search
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

    if (!newQuestion.question.trim()) {
      toast.error("Question cannot be empty");
      return;
    }

    try {
      const response = await myAxios.post(`/question`, {
        chapterId: id,
        question: newQuestion.question,
        answer: newQuestion.answer,
        year: newQuestion.year,
        marks: newQuestion.marks,
      });

      setQuestions((prev) => [...prev, response.data.data]);

      toast.success("Question added successfully");
      setNewQuestion({
        question: "",
        answer: "",
        year: newQuestion.year,
        marks: "",
      });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const handleDoubleClick = (question: any) => {
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
    try {
      await myAxios.put(`/question?id=${editQuestion.id}`, editQuestion);
      setQuestions((prev) =>
        prev.map((q) => (q.id === editQuestion.id ? editQuestion : q))
      );
      toast.success("Question updated successfully");
      setShowModal(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <div className="flex flex-col justify-between w-full border-b">
        <p className="text-3xl pb-1 w-full">
          <Link href={`/`}>{subject ? subject : "Subject"}</Link> -{" "}
          <span className="cursor-pointer" onClick={() => router.back()}>
            {chapter ? chapter : "Chapter"}
          </span>{" "}
          - Questions
        </p>
        <div className="flex gap-4 items-center justify-between mb-2 mt-3">
          <input
            className="px-3 py-2 border focus:outline-none w-full rounded-md bg-gray-300 dark:bg-gray-800"
            placeholder="search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex gap-4 items-center">
            <FaPlus
              size={20}
              className=""
              onClick={() => setShowForm(!showForm)}
            />
            <Theme />
          </div>
        </div>
      </div>

      {/* Display Questions */}
      <InfiniteScroll
        dataLength={questions.length}
        next={fetchMoreQuestions}
        hasMore={page < totalPages}
        loader={<p className="text-center">Loading...</p>}
      >
        {questions.length === 0 && !loading && <p>No questions available.</p>}

        {questions.map((question, index) => (
          <div
            key={question.id}
            className="flex flex-col gap-1 mt-2 border-b p-3 cursor-pointer hover:bg-gray-200/40 dark:hover:bg-slate-900/40"
            onClick={() => toggleAnswer(question.id)}
          >
            <div className="flex items-start gap-2">
              <span className="font-medium text-gray-600 dark:text-gray-300">
                {index + 1}.
              </span>
              <div
                onDoubleClick={() => handleDoubleClick(question)}
                style={{ whiteSpace: "break-spaces" }}
              >
                {question.question}
              </div>
            </div>
            <div className="w-full flex justify-end text-sm text-gray-600 dark:text-gray-300 gap-4">
              {question?.year && <span>[{question.year}]</span>}
              {question?.marks && <span>[{question.marks} marks]</span>}
            </div>
            {openedAnswer === question.id && (
              <div className="mt-2 p-3">
                <strong>Answer:</strong>{" "}
                {question.answer || "No answer available."}
              </div>
            )}
          </div>
        ))}
      </InfiniteScroll>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-3">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
            <h2 className="text-xl mb-4">Edit Question</h2>
            <textarea
              value={editQuestion.question}
              onChange={(e) =>
                setEditQuestion({ ...editQuestion, question: e.target.value })
              }
              className="w-full p-2 border rounded-md mb-2"
            />
            <textarea
              value={editQuestion.answer || ""}
              onChange={(e) =>
                setEditQuestion({ ...editQuestion, answer: e.target.value })
              }
              className="w-full p-2 border rounded-md mb-2"
              placeholder="Answer"
            />
            <input
              type="text"
              value={editQuestion.year || ""}
              onChange={(e) =>
                setEditQuestion({ ...editQuestion, year: e.target.value })
              }
              className="w-full p-2 border rounded-md mb-2"
              placeholder="Year"
            />
            <input
              type="text"
              value={editQuestion.marks || ""}
              onChange={(e) =>
                setEditQuestion({ ...editQuestion, marks: e.target.value })
              }
              className="w-full p-2 border rounded-md mb-2"
              placeholder="Marks"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-3">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
            <h2 className="text-xl mb-4">Add Question</h2>
            <textarea
              value={newQuestion.question}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, question: e.target.value })
              }
              placeholder="Question"
              className="w-full p-2 border rounded-md mb-2"
            />
            <textarea
              value={newQuestion.answer}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, answer: e.target.value })
              }
              className="w-full p-2 border rounded-md mb-2"
              placeholder="Answer"
            />
            <input
              type="text"
              value={newQuestion.year}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, year: e.target.value })
              }
              className="w-full p-2 border rounded-md mb-2"
              placeholder="Year"
            />
            <input
              type="text"
              value={newQuestion.marks}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, marks: e.target.value })
              }
              className="w-full p-2 border rounded-md mb-2"
              placeholder="Marks"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveQuestion}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
