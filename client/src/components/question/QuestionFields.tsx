import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "@/utils/Spinner";
import { FaEdit, FaPlus, FaSave, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import { myAxios } from "@/services/apiServices";
import QuestionCard from "./QuestionCard";

type Props = {
  questions: {
    id: number;
    question: string;
    answer?: string;
    year?: string;
    marks?: string;
  }[];
  fetchMoreQuestions: any;
  page: number;
  totalPages: number;
  loading: boolean;
  handleDoubleClick: Function;
  toggleAnswer: Function;
  openedAnswerIds: number[];
  loadingAnswer: boolean;
  answers: any;
  generateAnswer: Function;
  generatingAnswer: boolean;
  fetchAnswer: Function;
};

export default function QuestionFields({
  questions,
  fetchMoreQuestions,
  page,
  totalPages,
  loading,
  handleDoubleClick,
  toggleAnswer,
  openedAnswerIds,
  loadingAnswer,
  answers,
  generateAnswer,
  generatingAnswer,
  fetchAnswer,
}: Props) {
  const [userL, setUserL] = useState<any>({});
  const [answerStates, setAnswerStates] = useState<{ [key: number]: string }>(
    {}
  );
  const [saving, setSaving] = useState(false);
  const [openEditors, setOpenEditors] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [editorMode, setEditorMode] = useState<"none" | "add" | "edit">("none");

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
    {
      setAnswerStates((prev) => ({
        ...prev,
        [id]:
          answers[id]?.answer?.user?.id === userL?.id || userL.role === "admin"
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
      if (editorMode === "add") {
        await myAxios.post(`/answer/add/${id}`, { answer: answerStates[id] });
      } else if (userL.role === "admin") {
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

  useEffect(() => {
    const userlogged = localStorage.getItem("user");
    if (userlogged) {
      setUserL(JSON.parse(userlogged));
    }
    return () => {
      setAnswerStates({});
      setOpenEditors({});
    };
  }, []);

  return (
    <InfiniteScroll
      dataLength={questions.length}
      next={fetchMoreQuestions}
      hasMore={page < totalPages}
      loader={<Spinner color="#222" />}
    >
      {questions.length === 0 && !loading && (
        <p className="my-10">No questions available.</p>
      )}

      {questions.map((question, index) => (
        <QuestionCard
          key={question.id}
          question={question}
          handleDoubleClick={handleDoubleClick}
          index={index}
          toggleAnswer={toggleAnswer}
          openedAnswerIds={openedAnswerIds}
          openEditors={openEditors}
          answers={answers}
          loadingAnswer={loadingAnswer}
          userL={userL}
          answerStates={answerStates}
          saveAnswer={saveAnswer}
          saving={saving}
          handleCancel={handleCancel}
          handleAnswerAdd={handleAnswerAdd}
          handleAnswerEdit={handleAnswerEdit}
          setAnswerStates={setAnswerStates}
          generateAnswer={generateAnswer}
          generatingAnswer={generatingAnswer}
        />
      ))}
    </InfiniteScroll>
  );
}
