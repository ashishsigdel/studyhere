"use client";
import { ChangeEvent, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

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
    <div className="flex items-center w-full gap-3 px-2.5 py-1.5 border border-gray-200 dark:border-[#4b4b4b] rounded-lg bg-white dark:bg-[#3c3c3c]">
      <input
        type="text"
        className="w-full bg-transparent focus:outline-none placeholder-[#9b9b9b] text-gray-800 dark:text-gray-200"
        placeholder="Search..."
        value={search}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchBar;
