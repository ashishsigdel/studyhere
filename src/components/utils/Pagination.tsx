"use client";

import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
  color?: string; // Tailwind text color class, e.g., 'text-blue-600'
  activeBg?: string; // Tailwind background class for active page, e.g., 'bg-blue-600'
  activeText?: string; // Tailwind text color for active page
  hoverBg?: string; // Background color on hover
  hoverText?: string; // Text color on hover
}

export default function Pagination({
  currentPage,
  totalPages,
  handlePageChange,
  color = "text-primary",
  activeBg = "bg-primary",
  activeText = "text-white",
  hoverBg = "hover:bg-primary",
  hoverText = "hover:text-white",
}: PaginationProps) {
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [1];

    if (totalPages <= 7) {
      for (let i = 2; i < totalPages; i++) pageNumbers.push(i);
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(2, 3, 4, "...", totalPages - 1);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push("...", totalPages - 3, totalPages - 2, totalPages - 1);
      } else {
        pageNumbers.push(
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "..."
        );
      }
    }

    if (totalPages > 1) pageNumbers.push(totalPages);
    return pageNumbers;
  };

  return (
    <div className="mt-6 flex w-full items-center justify-between border-t border-15 pt-4 max-sm:flex-col max-sm:space-y-3">
      <span className="text-sm text-gray-600 dark:text-gray-400">
        Showing page {currentPage} of {totalPages} pages
      </span>

      <ul className="flex items-center flex-wrap">
        {currentPage > 1 && (
          <li
            className="mr-1 cursor-pointer"
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <p
              className={`flex h-8 items-center justify-center rounded bg-gray-200 px-3 text-base font-light ${color} ${hoverBg} ${hoverText}`}
            >
              <FaChevronLeft className="mr-1" /> Prev
            </p>
          </li>
        )}

        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <li key={`ellipsis-${index}`} className="mx-1">
              <p className="flex h-8 w-8 items-center justify-center text-base font-light">
                ...
              </p>
            </li>
          ) : (
            <li key={`page-${page}`} className="mx-1 cursor-pointer">
              <p
                onClick={() =>
                  typeof page === "number" && handlePageChange(page)
                }
                className={`flex h-8 w-8 items-center justify-center rounded text-base font-light ${
                  currentPage === page
                    ? `${activeBg} ${activeText}`
                    : `bg-gray-200 ${color} ${hoverBg} ${hoverText}`
                }`}
              >
                {page}
              </p>
            </li>
          )
        )}

        {currentPage < totalPages && (
          <li
            className="ml-1 cursor-pointer"
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <p
              className={`flex h-8 items-center justify-center rounded bg-gray-200 px-3 text-base font-light ${color} ${hoverBg} ${hoverText}`}
            >
              Next <FaChevronRight className="ml-1" />
            </p>
          </li>
        )}
      </ul>
    </div>
  );
}
