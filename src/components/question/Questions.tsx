"use client";

import { useEffect, useState } from "react";
import QuestionFields from "./QuestionFields";
import EditModal from "./EditModal";
import AddModal from "./AddModal";
import useQuestions from "./useQuestions";
import { FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import Breadcrumb from "./BreadCrumb";

export default function Questions() {
  const user = useSelector((state: any) => state.auth.user);
  const [refresh, setRefresh] = useState<boolean>(false);

  const refreshPage = () => {
    setRefresh(!refresh);
  };
  const {
    chapter,
    subject,
    loading,
    setShowForm,
    questions,
    handleDoubleClick,
    handleOpenModel,
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
    filteredQuestions,
    fetchQuestions,
    search,
  } = useQuestions({ refresh: refreshPage });

  useEffect(() => {
    if (chapter) {
      document.title = `${chapter} - Questions`;
    } else {
      document.title = "Questions";
    }
  }, [chapter]);

  useEffect(() => {
    fetchQuestions();
  }, [refresh]);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <>
      <div className="flex flex-col overflow-hidden">
        {/* Header Section */}
        <div className="flex flex-col justify-between w-full border-b border-gray-200 dark:border-gray-700">
          <div className="w-full py-6 justify-between flex items-center">
            <Breadcrumb subject={subject} chapter={chapter} />
            {user && (
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="p-2 rounded-lg cursor-pointer bg-transparent hover:bg-primary hover:text-white  transition-all active:scale-95 text-primary border border-primary flex items-center gap-2"
                  onClick={toggleForm}
                  aria-label="Add new item"
                >
                  <FaPlus size={18} />
                  <span className="hidden lg:inline whitespace-nowrap">
                    Add Question
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <QuestionFields
        handleDoubleClick={handleDoubleClick}
        handleOpenModel={handleOpenModel}
        loading={loading}
        openedAnswerIds={openedAnswerIds}
        toggleAnswer={toggleAnswer}
        loadingAnswer={loadingAnswer}
        answers={answers}
        generateAnswer={generateAnswer}
        generatingAnswer={generatingAnswer}
        fetchAnswer={fetchAnswer}
        questions={questions}
        filteredQuestions={filteredQuestions}
        search={search}
      />

      {showModal && (
        <EditModal
          editQuestion={editQuestion}
          setEditQuestion={setEditQuestion}
          setShowModal={setShowModal}
          handleSaveEdit={handleSaveEdit}
          loadingEdit={loadingEdit}
          fetchQuestions={fetchQuestions}
        />
      )}
      {showForm && (
        <AddModal
          newQuestion={newQuestion}
          setNewQuestion={setNewQuestion}
          setShowForm={setShowForm}
          handleSaveQuestion={handleSaveQuestion}
          loadingAdd={loadingAdd}
        />
      )}
    </>
  );
}
