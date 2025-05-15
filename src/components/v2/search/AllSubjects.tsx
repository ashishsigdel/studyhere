"use client";
import { Spinner } from "@/utils";
import { FaBookOpen, FaWifi } from "react-icons/fa";
import React from "react";
import { SubjectType } from "@/types/subject";
import SubjectCard from "../home/SubjectCard";
import Pagination from "@/components/utils/Pagination";

interface Props {
  subjects: SubjectType[] | [];
  loading: boolean;
  pagination: {
    currentPage: number;
    totalPages: number;
  };
  handlePageChange: (page: number) => void;
}

export const AllSubjects = ({
  subjects,
  loading,
  pagination,
  handlePageChange,
}: Props) => {
  return (
    <div id="search" className="mt-8 xl:mt-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 md:mb-8 gap-4">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200">
          Search Result
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {subjects.length} results
        </div>
      </div>

      {loading && (
        <div className="p-8 flex justify-center">
          <Spinner />
        </div>
      )}

      {!navigator.onLine && subjects.length === 0 && (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          <FaWifi size={24} className="mx-auto mb-2" />
          <p>
            You are offline. Please connect to the internet to view subjects.
          </p>
        </div>
      )}

      {navigator.onLine && !loading && subjects.length === 0 && (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          <FaBookOpen size={24} className="mx-auto mb-2" />
          <p>No subjects match your filters.</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.length > 0 &&
          subjects.map((subject) => (
            <SubjectCard subject={subject} key={subject.id} />
          ))}
      </div>

      {/* Updated pagination to use handlePageChange */}
      {pagination.totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            handlePageChange={handlePageChange}
            color="text-primary"
            activeBg="bg-primary"
            activeText="text-white"
            hoverBg="hover:bg-primary"
            hoverText="hover:text-white"
          />
        </div>
      )}
    </div>
  );
};
