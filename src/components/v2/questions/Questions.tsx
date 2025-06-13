"use client";
import React, { useState, useRef, useEffect } from "react";
import useQuestions from "./useQuestions";
import useResizeWheel from "./useResizeWheel";
import { HiClipboardList, HiDotsVertical } from "react-icons/hi";
import { MdQuestionAnswer } from "react-icons/md";
import { HtmlRenderer, JoditForm } from "@/components/utils";
import { SkeletonAnswer } from "@/components/utils/Skeleton";
import QuestionFooter from "./QuestionFooter";
import useAnswers from "./useAnswers";
import { FooterBottom } from "@/components/footer";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { usePathname, useRouter } from "next/navigation";
import { FaEye, FaGlobe, FaLock, FaPlus, FaTimes } from "react-icons/fa";
import { HoverButton } from "@/components/utils/Buttons";
import { AiOutlineCompress } from "react-icons/ai";
import Buttons from "./Buttons";
import Link from "next/link";
import NoData from "@/components/utils/NoData";
import AddModal from "./AddModal";
import EditModal from "./EditModal";
import SearchBar from "./SearchBar";
import toast from "react-hot-toast";
import RichTEditor from "@/components/utils/RichTEditor";
import Note from "./Note";
import { IoSearchSharp } from "react-icons/io5";
import InfiniteScroll from "react-infinite-scroll-component";
import { Spinner } from "@/utils";
import PopupMessage from "@/components/utils/PopupMessage";
import ChapterModal from "./ChapterModal";

export default function Questions() {
  const router = useRouter();
  const pathname = usePathname();

  const [refresh, setRefresh] = useState<boolean>(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const dropdownRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const refreshPage = () => {
    setRefresh(!refresh);
  };
  const {
    questions,
    fetchQuestions,
    user,
    handleDoubleClick,
    handleOpenModel,
    toggleAnswer,
    openedAnswerIds,
    answers,
    loadingAnswer,
    chapter,
    note,
    type,
    openEditors,
    saveAnswer,
    saving,
    handleCancel,
    handleAnswerEdit,
    handleAnswerAdd,
    generateAnswer,
    generatingAnswer,
    answerStates,
    setAnswerStates,
    showForm,
    showModal,
    editQuestion,
    setEditQuestion,
    setShowForm,
    setShowModal,
    handleSaveEdit,
    loadingAdd,
    loadingEdit,
    newQuestion,
    setNewQuestion,
    handleSaveQuestion,
    handleDelete,
    handleOpenChapterModal,
    showChapterModal,
    allChapters,
    search,
    filteredQuestions,
    prevChapter,
    nextChapter,
    loading: loadingQuestions,
    notFoundResponse,
    privateRespons,
    handleToggleChapter,
  } = useQuestions({ refresh: refreshPage });

  const {
    question,
    allAnswers,
    loading,
    setAnswers,
    fetchAnswers,
    fetchNote,
    note: sideBarNote,
    noteList,
    notePagination,
    setNotePagination,
    noteSearchOpen,
    setNoteSearchOpen,
    noteSearchQuery,
    setNoteSearchQuery,
    loadingNote,
  } = useAnswers();

  const {
    mainContentRef,
    startResizing,
    sidebarRef,
    sidebarWidth,
    setSidebarWidth,
  } = useResizeWheel();

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown !== null) {
        const dropdownElement = dropdownRefs.current[activeDropdown];
        if (
          dropdownElement &&
          !dropdownElement.contains(event.target as Node)
        ) {
          setActiveDropdown(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeDropdown]);

  const toggleDropdown = (chapterId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === chapterId ? null : chapterId);
  };

  const handleClickOpenSidebar = (id: number) => {
    sidebarWidth == 30 && setSidebarWidth(700);
    fetchAnswers(id);
  };

  const handleBack = () => {
    const pathSegments = pathname.split("/").filter(Boolean);
    if (pathSegments.length > 1) {
      const newPath = "/" + pathSegments.slice(0, -1).join("/");
      router.push(newPath);
    } else {
      router.push("/");
    }
  };

  const handleChangeChapter = (id: number | undefined) => {
    if (id) {
      const pathSegments = pathname.split("/");
      pathSegments[pathSegments.length - 1] = id.toString();
      const newPath = pathSegments.join("/");
      router.push(newPath);
    } else {
      toast.error("No Chapter.");
    }
  };

  useEffect(() => {
    if (chapter) {
      document.title = `${chapter} - Questions`;
    } else {
      document.title = "Questions";
    }
  }, [chapter]);

  if (notFoundResponse) {
    return (
      <NoData
        title="404"
        description="The page you are looking for does not exist."
      />
    );
  }

  if (privateRespons) {
    return (
      <NoData
        title="Private Page."
        description="You are not authorized to access this page."
      />
    );
  }

  if (loadingQuestions) {
    return (
      <div className="flex justify-center items-center min-h-screen w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-t-blue-500 border-b-blue-600 border-l-blue-300 border-r-blue-300"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-row h-[calc(100vh-60px)] p-2 gap-x-1 relative">
      {/* Questions Field */}
      <div
        ref={mainContentRef}
        className="flex-1 overflow-auto border border-20 rounded-lg relative"
      >
        <div className="px-3 py-1.5 bg-white-variant dark:bg-dark-variant border-b border-10 flex justify-between gap-x-2 sm:gap-x-4 sticky top-0 text-gray-700 dark:text-gray-100 z-[99]">
          <div className="flex items-center gap-1 sm:gap-2 py-1">
            <HiClipboardList size={18} />
            <button
              onClick={handleBack}
              className={`truncate ${
                sidebarWidth > 500
                  ? "max-w-[80px] sm:max-w-[120px]"
                  : sidebarWidth > 300
                  ? "max-w-[80px] sm:max-w-[200px]"
                  : "max-w-[80px] sm:max-w-[300px]"
              } block text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white pl-2 capitalize text-sm md:text-base  `}
              title={chapter}
            >
              {chapter}
            </button>
            <RiArrowRightSLine
              className="text-gray-400 dark:text-gray-500 flex-shrink-0"
              size={20}
            />

            <span
              className="truncate text-sm max-w-[150px] sm:max-w-[200px] md:max-w-[300px] block"
              title="Questions"
            >
              {type === "q&a" ? "Questions" : "Note"}
            </span>
            <div className="mx-2 h-full border border-10" />
            {type === "q&a" && (
              <HoverButton
                Icon={<FaPlus size={16} />}
                direction="bottom"
                hoverText="Add Question"
                backGround
                onClick={() => setShowForm(!showForm)}
              />
            )}
          </div>
          <SearchBar />
          <div className="flex items-center gap-2 py-1">
            <HoverButton
              Icon={<RiArrowLeftSLine size={16} />}
              direction="bottom"
              hoverText="Previous Chapter"
              backGround
              onClick={() => handleChangeChapter(prevChapter?.id)}
            />
            <HoverButton
              Icon={<RiArrowRightSLine size={16} />}
              direction="bottom"
              hoverText="Next Chapter"
              backGround
              onClick={() => handleChangeChapter(nextChapter?.id)}
            />
          </div>
        </div>
        <div className="px-3 flex flex-col min-h-[calc(100vh-20px)]">
          {type !== "q&a" && (
            <Note
              note={note}
              user={user}
              chapter={chapter}
              refresh={fetchQuestions}
            />
          )}

          {type === "q&a" &&
            questions &&
            questions.length > 0 &&
            (search ? filteredQuestions : questions).map((question, index) => (
              <div key={index} className="border-b border-10 py-3.5">
                <div className="flex items-start gap-2 ">
                  <span
                    onDoubleClick={() => handleDoubleClick(question)}
                    className="font-medium text-gray-600 dark:text-gray-300"
                  >
                    {index + 1}.
                  </span>
                  <div
                    className="w-full cursor-pointer"
                    onClick={() => toggleAnswer(question.id)}
                    title="Click to View Answer"
                  >
                    <HtmlRenderer content={question.question} />
                  </div>
                  {user && (
                    <div className="inline-block relative">
                      <div
                        onClick={(e) => toggleDropdown(question.id, e)}
                        className="p-1 hover:bg-gray-300 hover:dark:bg-gray-700 rounded-full cursor-pointer "
                      >
                        <HiDotsVertical />
                      </div>
                      {/* Dropdown Menu */}
                      {activeDropdown === question.id && (
                        <div
                          ref={(el: any) =>
                            (dropdownRefs.current[question.id] = el)
                          }
                          className="absolute right-0 top-8 w-40 bg-white-light-variant dark:bg-dark-light-variant border border-10 shadow-md rounded-lg overflow-hidden z-[9999]"
                        >
                          <button
                            className="block border-b border-5 w-full text-left px-4 py-1.5 text-sm text-gray-800 dark:text-gray-200 hover:bg-white-variant dark:hover:bg-dark-variant/30"
                            onClick={(e) => {
                              handleOpenModel(question);
                              toggleDropdown(question.id, e);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="block border-b border-5 w-full text-left px-4 py-1.5 text-sm text-gray-800 dark:text-gray-200 hover:bg-white-variant dark:hover:bg-dark-variant/30"
                            onClick={(e) => {
                              handleOpenChapterModal(question.id);
                              toggleDropdown(question.id, e);
                            }}
                          >
                            Change Chapter
                          </button>
                          <button
                            className="block w-full text-left px-4 py-1.5 text-sm text-gray-800 dark:text-gray-200 hover:bg-white-variant dark:hover:bg-dark-variant/30"
                            onClick={() => handleDelete(question.id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="w-full flex justify-end text-sm text-gray-700 dark:text-gray-300 gap-3 items-center mt-3">
                  {question?.year && (
                    <span className="px-2 py-0.5 rounded-md font-medium border border-10">
                      {question.year}
                    </span>
                  )}
                  {question?.marks && (
                    <span className="px-2 py-0.5 rounded-md font-medium border border-10">
                      {question.marks.replace(/\[|\]/g, "")} marks
                    </span>
                  )}
                </div>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openedAnswerIds.includes(question.id)
                      ? "max-h-fit opacity-100 overflow-y-auto"
                      : "max-h-0 opacity-0 pb-0"
                  }`}
                >
                  <div className="flex justify-between items-center my-7">
                    <strong>Answer:</strong>
                    {(openEditors[question.id] ||
                      answers[question.id]?.answer?.answer?.replace(
                        /<annotation[^>]*>.*?<\/annotation>/gs,
                        ""
                      )) && (
                      <Buttons
                        openEditors={openEditors}
                        question={question}
                        saveAnswer={saveAnswer}
                        answers={answers}
                        userL={user}
                        saving={saving}
                        handleCancel={handleCancel}
                        generateAnswer={generateAnswer}
                        generatingAnswer={generatingAnswer}
                        handleAnswerAdd={handleAnswerAdd}
                        handleAnswerEdit={handleAnswerEdit}
                      />
                    )}
                  </div>
                  {openEditors[question.id] ? (
                    <div className="mt-3">
                      <RichTEditor
                        text={answerStates[question.id] || ""}
                        setText={(text: string) =>
                          setAnswerStates((prev: any) => ({
                            ...prev,
                            [question.id]: text,
                          }))
                        }
                        height="600px"
                      />
                    </div>
                  ) : loadingAnswer && !answers[question.id] ? (
                    <SkeletonAnswer />
                  ) : (
                    <>
                      <HtmlRenderer
                        style="border-l pl-5 md:pl-8 border-10"
                        content={(
                          answers[question.id] as any
                        )?.answer?.answer?.replace(
                          /<annotation[^>]*>.*?<\/annotation>/gs,
                          ""
                        )}
                      />
                      {!answers[question.id]?.answer?.answer?.replace(
                        /<annotation[^>]*>.*?<\/annotation>/gs,
                        ""
                      ) && (
                        <NoData
                          title="No Answers Yet"
                          description="Be the first to share your thoughts, or try generating an answer with AI."
                          button={
                            <Buttons
                              openEditors={openEditors}
                              question={question}
                              saveAnswer={saveAnswer}
                              answers={answers}
                              userL={user}
                              saving={saving}
                              handleCancel={handleCancel}
                              generateAnswer={generateAnswer}
                              generatingAnswer={generatingAnswer}
                              handleAnswerAdd={handleAnswerAdd}
                              handleAnswerEdit={handleAnswerEdit}
                            />
                          }
                        />
                      )}
                      {answers[question.id]?.answer?.answer && (
                        <QuestionFooter
                          user={answers[question.id]?.answer?.user}
                          createdAt={answers[question.id]?.answer.createdAt}
                          totalLikes={answers[question.id]?.answer.TotalLikes}
                          totalViews={answers[question.id]?.answer.totalViews}
                          isLiked={answers[question.id]?.answer.isLiked}
                          answerId={answers[question.id]?.answer.id}
                          questionId={question.id}
                          handleClickOpenSidebar={handleClickOpenSidebar}
                          otherAnswersCount={
                            answers[question.id]?.otherAnswersCount
                          }
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          {!user && questions && questions.length > 0 && (
            <div className="flex flex-col items-center justify-start pt-16 px-4 z-10">
              <div className="w-full max-w-sm text-center">
                <FaLock className="text-blue-500 mx-auto text-3xl mb-3" />

                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  End of Preview, Login Required.
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Please log in to see all available questions.
                </p>
                <Link
                  href={`/login?redirect=${encodeURIComponent(pathname)}`}
                  className="bg-[#c0ffb2] hover:bg-[#8dff76] text-[#073400] text-sm px-4 py-2 rounded-md w-full transition"
                >
                  Login
                </Link>
              </div>
            </div>
          )}
        </div>
        <FooterBottom />
      </div>

      {/* Resizer */}
      <div
        onMouseDown={startResizing}
        className="w-1 h-full hidden md:flex items-center rounded-full cursor-ew-resize bg-transparent group hover:bg-primary"
      >
        <div
          onMouseDown={startResizing}
          className="w-1 h-7 rounded-full cursor-ew-resize bg-black/10 hover:bg-black/15 dark:bg-white/10 hover:dark:bg-white/15"
        />
      </div>

      {/* All Answers */}
      <div
        ref={sidebarRef}
        className="overflow-auto border border-20 rounded-lg hidden md:inline-block"
        style={{ width: sidebarWidth }}
      >
        {sidebarWidth <= 50 ? (
          <div className="h-auto w-full flex justify-center py-16">
            <div className="rotate-90 whitespace-nowrap flex items-center gap-1">
              <MdQuestionAnswer size={18} className="rotate-[-90deg]" />
              <span className="">Custom Content</span>
            </div>
          </div>
        ) : (
          <>
            <div className="px-3 py-2 bg-white-variant dark:bg-dark-variant border-b border-10 flex items-center justify-between gap-2 sticky top-0 z-10 text-gray-700 dark:text-gray-100">
              <div className="flex items-center gap-2">
                <MdQuestionAnswer size={18} className="flex-shrink-0" />
                <span className="">Content</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="pl-3 pr-1 py-1 bg-black/5 dark:bg-white/5 rounded-md flex items-center gap-2">
                      <button
                        onClick={() => setNoteSearchOpen(true)}
                        className="pr-2 text-sm whitespace-nowrap flex-1 sm:flex-none justify-center w-fit flex items-center gap-2 transition-colors"
                      >
                        <IoSearchSharp size={14} />
                        Open Note
                      </button>
                      {noteSearchOpen && (
                        <FaTimes
                          size={14}
                          onClick={() => setNoteSearchOpen(false)}
                        />
                      )}
                    </div>
                    {noteSearchOpen && (
                      <div className="absolute right-0 top-[calc(100%+4px)] w-80 bg-white dark:bg-dark-variant border border-black/5 dark:border-white/5 rounded-lg overflow-hidden z-[999]">
                        <div className="p-2 border-b border-black/5 dark:border-white/5">
                          <div className="relative">
                            <input
                              value={noteSearchQuery}
                              onChange={(e) =>
                                setNoteSearchQuery(e.target.value)
                              }
                              type="text"
                              placeholder="Search notes..."
                              className="w-full px-8 py-2 bg-white-light-variant dark:bg-dark-light-variant rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                            <IoSearchSharp
                              size={16}
                              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                          </div>
                        </div>

                        <div className="max-h-[300px] overflow-y-auto pr-2">
                          <InfiniteScroll
                            dataLength={questions.length}
                            next={() => {
                              setNotePagination({
                                ...notePagination,
                                page: notePagination.page + 1,
                              });
                            }}
                            hasMore={notePagination.total > notePagination.page}
                            loader={loadingNote ? <Spinner /> : null}
                          >
                            {noteList.map((note: any, index: number) => (
                              <button
                                key={note.id}
                                onClick={() => {
                                  setNoteSearchOpen(false);
                                  fetchNote(note.id);
                                }}
                                className="w-full px-3 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 group transition-colors duration-150 rounded-md"
                              >
                                <span className="text-gray-500 dark:text-gray-400 text-sm min-w-[20px]">
                                  {index + 1}.
                                </span>

                                <div className="flex-1 flex items-center justify-between overflow-hidden">
                                  <div className="truncate">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                      {note.name}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                      ({note.subjectname.name})
                                    </span>
                                  </div>

                                  <div className="ml-2 flex-shrink-0 text-gray-400 dark:text-gray-500">
                                    {note.subjectname.visibility ===
                                    "public" ? (
                                      <FaGlobe size={14} />
                                    ) : note.subjectname.visibility ===
                                      "private" ? (
                                      <FaLock size={14} />
                                    ) : (
                                      <FaEye size={14} />
                                    )}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </InfiniteScroll>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <HoverButton
                  Icon={<AiOutlineCompress size={16} />}
                  direction="left"
                  hoverText="Hide"
                  backGround
                  onClick={() => setSidebarWidth(30)}
                />
              </div>
            </div>
            {question.question && (
              <div className="px-3 py-2 border-b border-10 sticky top-[45px] bg-gray-100 dark:bg-dark-bg z-[9]">
                <HtmlRenderer content={question?.question} />
              </div>
            )}

            <div className="px-3 space-y-6 min-h-[calc(100vh-180px)] pb-12">
              {loading && <SkeletonAnswer />}
              {allAnswers &&
                allAnswers.length > 0 &&
                allAnswers.map((answer: any, index) => (
                  <div key={answer.id} className="relative">
                    {index > 0 && (
                      <div className="flex items-center mb-10">
                        <div className="flex-grow border-t border-dashed border-gray-300 dark:border-gray-700"></div>
                        <div className="px-4 text-xs text-gray-500 dark:text-gray-400">
                          Answer {index + 1}
                        </div>
                        <div className="flex-grow border-t border-dashed border-gray-300 dark:border-gray-700"></div>
                      </div>
                    )}

                    <div className="prose dark:prose-invert max-w-full overflow-x-auto whitespace-normal mt-2.5">
                      <HtmlRenderer
                        content={answer?.answer}
                        style="border-l pl-5 md:pl-8 border-10"
                      />

                      {answer?.answer && (
                        <QuestionFooter
                          user={answer.user}
                          createdAt={answer.createdAt}
                          totalLikes={answer.TotalLikes}
                          totalViews={answer.totalViews}
                          isLiked={answer.isLiked}
                          answerId={answer.id}
                        />
                      )}
                    </div>
                  </div>
                ))}
              {sideBarNote && (
                <div className="py-2">
                  <HtmlRenderer content={sideBarNote} />
                </div>
              )}
              <div className="my-3">
                <PopupMessage messageShowOn={"note-sidebar"} />
              </div>
            </div>
          </>
        )}
      </div>
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
      {showChapterModal && (
        <ChapterModal
          allChapters={allChapters}
          handleToggleChapter={handleToggleChapter}
        />
      )}
    </div>
  );
}
