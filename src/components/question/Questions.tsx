"use client";

import React, { useEffect, useState } from "react";
import Spinner from "@/utils/Spinner";
import BreadCrumb from "./BreadCrumb";
import SearchBar from "./SearchBar";
import QuestionFields from "./QuestionFields";
import EditModal from "./EditModal";
import AddModal from "./AddModal";
import useQuestions from "./useQuestions";
import { FaPlus } from "react-icons/fa";

export default function Questions() {
  const {
    chapter,
    subject,
    loading,
    setShowForm,
    questions,
    fetchMoreQuestions,
    handleDoubleClick,
    handleOpenModel,
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
    fetchAnswer,
    filteredQuestions,
    fetchQuestions,
  } = useQuestions();

  useEffect(() => {
    if (chapter) {
      document.title = `${chapter} - Questions`;
    } else {
      document.title = "Questions";
    }
  }, [chapter]);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <>
      <div className="flex justify-between w-full border-b border-gray-300 dark:border-gray-600 py-4">
        <BreadCrumb subject={subject} chapter={chapter} />
        <button
          type="button"
          className="w-9 h-9 aspect-square flex items-center justify-center cursor-pointer border border-gray-200 dark:border-[#4b4b4b] rounded-lg bg-white dark:bg-[#3c3c3c]"
          onClick={toggleForm}
          aria-label="Add new item"
        >
          <FaPlus size={18} />
        </button>
      </div>

      {loading && questions.length === 0 && (
        <div className="p-2 scale-150 flex justify-center items-center mt-20">
          <Spinner />
        </div>
      )}
      <QuestionFields
        fetchMoreQuestions={fetchMoreQuestions}
        handleDoubleClick={handleDoubleClick}
        handleOpenModel={handleOpenModel}
        loading={loading}
        openedAnswerIds={openedAnswerIds}
        page={page}
        questions={filteredQuestions}
        toggleAnswer={toggleAnswer}
        totalPages={totalPages}
        loadingAnswer={loadingAnswer}
        answers={answers}
        generateAnswer={generateAnswer}
        generatingAnswer={generatingAnswer}
        fetchAnswer={fetchAnswer}
      />

      {showModal && (
        <EditModal
          switchForm={switchForm}
          modelFormChoose={modelFormChoose}
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
          switchForm={switchForm}
          modelFormChoose={modelFormChoose}
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
