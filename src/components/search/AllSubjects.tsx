// AllSubjects.tsx (updated)
"use client";
import { Spinner } from "@/utils";
import Link from "next/link";
import Pagination from "../utils/Pagination";
import useSearch from "./useSearch";
import { FaBookOpen, FaWifi } from "react-icons/fa";
import React from "react";

interface AllSubjectsProps {
  sortOrder: "newest" | "oldest";
  filters: {
    type: string;
    category: string;
  };
}

const renderSubject = (subject: {
  id: number;
  name: string;
  createdAt: string;
  isPremium: boolean;
}) => {
  return (
    <div
      key={subject.id}
      className="bg-white dark:bg-gray-800/40 rounded-md shadow-sm hover:shadow-md hover:-translate-y-1 transition-all overflow-hidden relative border border-black/10 dark:border-white/10"
    >
      <div className="p-5">
        {/* Icon area */}
        <div className="flex justify-between items-center mb-2">
          <p className="text-lg">📚</p>
          {subject.isPremium && (
            <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full">
              Premium
            </span>
          )}
        </div>

        {/* Subject title */}
        <h3 className="text-lg font-semibold mb-5 line-clamp-2 capitalize">
          {subject.name}
        </h3>

        {/* View subject link */}
        <Link
          href={`/questions/${subject.id}`}
          className="absolute bottom-3 right-3 text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
        >
          View subject →
        </Link>
      </div>
    </div>
  );
};

export const AllSubjects = ({ sortOrder, filters }: AllSubjectsProps) => {
  const { subjects, loading } = useSearch();

  // Apply filters and sorting
  const filteredSubjects = React.useMemo(() => {
    let result = [...subjects];

    // Apply type filter
    if (filters.type === "free") {
      result = result.filter((subject) => !subject.isPremium);
    } else if (filters.type === "premium") {
      result = result.filter((subject) => subject.isPremium);
    }

    // Apply category filter
    if (filters.category !== "all") {
      result = result.filter(
        (subject) => subject.category === filters.category
      );
    }

    // Apply sorting
    if (sortOrder === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else {
      result.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }

    return result;
  }, [subjects, sortOrder, filters]);

  return (
    <div id="featured-subjects" className="mt-8 min-[900px]:mt-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 md:mb-8 gap-4">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200">
          All Subjects 📚
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredSubjects.length} results
        </div>
      </div>

      {loading && (
        <div className="p-8 flex justify-center">
          <Spinner />
        </div>
      )}

      {!navigator.onLine && filteredSubjects.length === 0 && (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          <FaWifi size={24} className="mx-auto mb-2" />
          <p>
            You are offline. Please connect to the internet to view subjects.
          </p>
        </div>
      )}

      {navigator.onLine && !loading && filteredSubjects.length === 0 && (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          <FaBookOpen size={24} className="mx-auto mb-2" />
          <p>No subjects match your filters.</p>
        </div>
      )}

      <div className="grid grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredSubjects.map((subject) => renderSubject(subject))}
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
  );
};
