"use client";
import { Spinner } from "@/utils";
import { useEffect, useState, useRef, useCallback } from "react";
import { myAxios } from "@/services/apiServices";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { bookThumbnail } from "@/data/BookThumbnail";
import TopBar from "./Topbar";
import { loadDataFromIndexedDB, saveDataToIndexedDB } from "@/utils/indexdb";
import useSubjects from "./useSubjects";
import bookCover from "@/assets/bookcover.png";
import AddModal from "./AddModal";
import { FaSearch } from "react-icons/fa";
import Pagination from "../utils/Pagination";

const STORE_NAME = "subjects";
const DEBOUNCE_DELAY = 500; // milliseconds

const renderSubject = (subject: { id: number; name: string }) => {
  return (
    <div
      key={subject.id}
      className="relative border border-black/10 dark:border-white/30 shadow-lg rounded-lg overflow-hidden group"
    >
      <Link href={`/questions/${subject.id}`}>
        <h3 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-semibold px-4 py-1 rounded-md group-hover:scale-105 transition duration-300">
          {subject.name}
        </h3>
      </Link>

      <Image src={bookCover} alt={subject.name} className="pb-[0.8]" priority />
    </div>
  );
};

export const AllSubjects = () => {
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<{ id: number; name: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const user = useSelector((state: any) => state.auth.user);
  const {
    subject,
    setSubject,
    showForm,
    setShowForm,
    loadingAdd,
    handleSaveSubject,
  } = useSubjects();

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Function to fetch subjects without search term (initial load)
  const fetchSubjects = async () => {
    try {
      try {
        const cachedSubjects = await loadDataFromIndexedDB(
          STORE_NAME,
          "subjects"
        );
        if (cachedSubjects) {
          setSubjects(cachedSubjects);
        } else {
          setLoading(true);
        }
      } catch (error) {
        setLoading(true);
      }

      if (navigator.onLine) {
        const response = await myAxios.get("/subject");
        setSubjects(response.data.data);

        await saveDataToIndexedDB(STORE_NAME, "subjects", response.data.data);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to search subjects with debouncing
  const searchSubjects = useCallback(async (term: string) => {
    if (!term.trim()) {
      fetchSubjects();
      return;
    }

    setIsSearching(true);
    try {
      const response = await myAxios.get(
        `/subject?search=${encodeURIComponent(term)}`
      );
      setSubjects(response.data.data);
    } catch (error) {
      console.error("Error searching subjects:", error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Handle search input change with debouncing
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set a new timeout
    searchTimeoutRef.current = setTimeout(() => {
      searchSubjects(value);
    }, DEBOUNCE_DELAY);
  };

  // Clear timeout on component unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Initial fetch on component mount
  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <>
      <div id="featured-subjects" className="mt-8 min-[900px]:mt-16 ">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 md:mb-12 gap-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200">
            All Subjects 📚
          </h2>

          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="relative flex items-center flex-1 md:w-auto">
              <input
                type="text"
                placeholder="Search subjects..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="px-4 pr-12 py-2 w-full md:w-[250px] lg:w-[300px] border border-gray-300 rounded-full dark:bg-gray-800/30 dark:text-white dark:border-gray-600 focus:outline-none transition-all duration-300"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {isSearching ? (
                  <div className="w-5 h-5 border-t-2 border-primary rounded-full animate-spin"></div>
                ) : (
                  <FaSearch className="text-primary text-lg" />
                )}
              </div>
            </div>

            {user && <TopBar showForm={showForm} setShowForm={setShowForm} />}
          </div>
        </div>

        {loading && subjects.length === 0 && <Spinner />}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5 md:gap-6">
          {!loading && !isSearching && subjects.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
              No subjects available
            </div>
          )}

          {!loading && isSearching && subjects.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
              No subjects match your search
            </div>
          )}

          {subjects.map((subject) => renderSubject(subject))}
        </div>
        <Pagination
          currentPage={1}
          totalPages={8}
          handlePageChange={() => null}
          color="text-primary"
          activeBg="bg-primary"
          activeText="text-white"
          hoverBg="hover:bg-primary"
          hoverText="hover:text-white"
        />
      </div>

      {showForm && (
        <AddModal
          handleSaveSubject={handleSaveSubject}
          loading={loadingAdd}
          setShowForm={setShowForm}
          subject={subject}
          setSubject={setSubject}
        />
      )}
    </>
  );
};
