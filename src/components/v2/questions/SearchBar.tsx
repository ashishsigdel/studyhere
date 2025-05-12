"use client";
import { ChangeEvent, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { IoSearchSharp } from "react-icons/io5";

const SearchBar: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialSearch = searchParams.get("search") || "";
  const [search, setSearch] = useState(initialSearch);

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearch(newValue);
    const params = new URLSearchParams(window.location.search);
    if (newValue) {
      params.set("search", newValue);
    } else {
      params.delete("search");
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-1 items-center gap-2 rounded-full px-3 py-0.5 bg-white-light-variant dark:bg-dark-light-variant hover:bg-opacity-80 transition-all duration-200 max-w-2xl">
      <IoSearchSharp className="text-gray-500 dark:text-gray-400" />
      <input
        type="text"
        className="w-full bg-transparent border-none outline-none text-gray-700 dark:text-gray-300 placeholder-gray-500"
        placeholder="Search questions..."
        value={search}
        onChange={handleChange}
        aria-label="Search questions"
      />
    </div>
  );
};

export default SearchBar;
