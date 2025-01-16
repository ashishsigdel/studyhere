"use client";
import { myAxios } from "@/utils/apiHanlde";
import { CheckAuth } from "@/utils/checkAuth";
import Theme from "@/utils/Theme";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";

export default function Questions() {
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

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await myAxios.get(`/question/${id}`);
      setQuestions(response.data.data.allQuestions);
      setChapter(response.data.data.chapter.name);
      setSubject(response.data.data.chapter.Subject.name);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

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

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between w-full">
        <p className="text-3xl pb-1 border-b w-full">
          {subject ? subject : "Subject"} - {chapter ? chapter : "Chapter"} -
          Questions
        </p>
        <div className="flex gap-4 items-center justify-end">
          <FaPlus
            size={20}
            className=""
            onClick={() => setShowForm(!showForm)}
          />
          <Theme />
        </div>
      </div>

      {showForm && (
        <div className="mt-4 mb-6 border p-4 rounded-md shadow-sm">
          <input
            type="text"
            value={newQuestion.question}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, question: e.target.value })
            }
            placeholder="Enter question"
            className="p-2 w-full border rounded-md mb-2"
          />
          <input
            type="text"
            value={newQuestion.answer}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, answer: e.target.value })
            }
            placeholder="Enter answer"
            className="p-2 w-full border rounded-md mb-2"
          />
          <div className="flex gap-2 items-center flex-wrap">
            <input
              type="text"
              value={newQuestion.year}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, year: e.target.value })
              }
              placeholder="Year (optional)"
              className="p-2 border rounded-md "
            />
            <input
              type="text"
              value={newQuestion.marks}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, marks: e.target.value })
              }
              placeholder="Marks (optional)"
              className="p-2 border rounded-md "
            />
            <button
              onClick={handleSaveQuestion}
              className="px-4 py-2 rounded-md border"
            >
              Save Question
            </button>
          </div>
        </div>
      )}

      {/* Display Questions */}
      <div>
        {loading && <>Loading...</>}
        {!loading && questions.length === 0 && <>No questions available.</>}

        {questions.length > 0 &&
          questions.map((question, index) => (
            <div
              key={question.id}
              onClick={() => toggleAnswer(question.id)}
              className="flex flex-col gap-1 mt-2 border-b p-3 cursor-pointer hover:bg-gray-200 hover:dark:bg-slate-900"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600 dark:text-gray-300">
                  {index + 1}.
                </span>
                {question.question}
              </div>
              <div className="w-full flex justify-end text-sm text-gray-600 dark:text-gray-300 gap-4">
                {question?.year && <span>[{question.year}]</span>}
                {question?.marks && <span>[{question.marks} marks]</span>}
              </div>
              {openedAnswer === question.id && (
                <div className="mt-2 p-3 bg-gray-200 dark:bg-gray-800 rounded">
                  <strong>Answer:</strong>{" "}
                  {question?.answer ?? "No answer available."}
                </div>
              )}
            </div>
          ))}
      </div>
    </>
  );
}
