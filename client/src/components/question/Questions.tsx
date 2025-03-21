"use client";

import React, { useEffect, useState } from "react";
import Spinner from "@/utils/Spinner";
import BreadCrumb from "./BreadCrumb";
import SearchBar from "./SearchBar";
import QuestionFields from "./QuestionFields";
import EditModal from "./EditModal";
import AddModal from "./AddModal";
import useQuestions from "./useQuestions";

export default function Questions() {
  const {
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
  } = useQuestions();

  return (
    <>
      <div className="flex flex-col justify-between w-full border-b border-gray-300 dark:border-gray-600">
        <BreadCrumb subject={subject} chapter={chapter} />
        <SearchBar
          search={search}
          loading={loading}
          setShowForm={setShowForm}
          showForm={showForm}
          setSearch={setSearch}
        />
      </div>

      {loading && questions.length === 0 && (
        <div className="p-2">
          <Spinner color="#222" />
        </div>
      )}
      <QuestionFields
        fetchMoreQuestions={fetchMoreQuestions}
        handleDoubleClick={handleDoubleClick}
        loading={loading}
        openedAnswerIds={openedAnswerIds}
        page={page}
        questions={questions}
        toggleAnswer={toggleAnswer}
        totalPages={totalPages}
        loadingAnswer={loadingAnswer}
        answers={answers}
        generateAnswer={generateAnswer}
        generatingAnswer={generatingAnswer}
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
