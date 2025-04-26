import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { myAxios } from "@/services/apiServices";
import QuestionCard from "./QuestionCard";
import useQuestions from "./useQuestions";
import { useSelector } from "react-redux";
import { Spinner } from "@/utils";
import { FaBookOpen, FaWifi } from "react-icons/fa";
import { QuestionType } from "@/types/question";

type Props = {
  loading: boolean;
  handleDoubleClick: Function;
  handleOpenModel: Function;
  toggleAnswer: Function;
  openedAnswerIds: number[];
  loadingAnswer: boolean;
  answers: any;
  generateAnswer: Function;
  generatingAnswer: boolean;
  fetchAnswer: Function;
  questions: QuestionType[];
  filteredQuestions: QuestionType[];
  search: string | null;
};

export default function QuestionFields({
  loading,
  handleDoubleClick,
  handleOpenModel,
  toggleAnswer,
  openedAnswerIds,
  loadingAnswer,
  answers,
  generateAnswer,
  generatingAnswer,
  fetchAnswer,
  questions,
  filteredQuestions,
  search,
}: Props) {
  const userL = useSelector((state: any) => state.auth.user);
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
    return () => {
      setAnswerStates({});
      setOpenEditors({});
    };
  }, []);

  return (
    <>
      {/* Empty States */}
      {loading && (
        <div className="p-8 flex justify-center">
          <Spinner />
        </div>
      )}
      {!navigator.onLine && questions.length === 0 && (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          <FaWifi size={24} className="mx-auto mb-2" />
          <p>
            You are offline. Please connect to the internet to view questions.
          </p>
        </div>
      )}
      {navigator.onLine && !loading && questions.length === 0 && (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          <FaBookOpen size={24} className="mx-auto mb-2" />
          <p>No questions available. Add question to get started.</p>
        </div>
      )}

      {(search ? filteredQuestions : questions).map((question, index) => (
        <QuestionCard
          key={question.id}
          question={question}
          handleDoubleClick={handleDoubleClick}
          handleOpenModel={handleOpenModel}
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
    </>
  );
}
