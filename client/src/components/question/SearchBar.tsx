import { ChangeEvent } from "react";
import { FaPlus } from "react-icons/fa";
import Spinner from "@/utils/Spinner";

interface SearchBarProps {
  search: string;
  loading: boolean;
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  setSearch: (search: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  search,
  loading,
  setShowForm,
  showForm,
  setSearch,
}) => {
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="flex items-center justify-between gap-4 mb-4">
      <div className="flex items-center w-full gap-3 px-2.5 py-1.5 border border-gray-200 dark:border-[#4b4b4b] rounded-lg bg-white dark:bg-[#3c3c3c]">
        <input
          type="text"
          className="w-full bg-transparent focus:outline-none placeholder-[#9b9b9b] text-gray-800 dark:text-gray-200"
          placeholder="Search Question or Year..."
          value={search}
          onChange={handleSearchChange}
        />
        {loading && (
          <div className="flex-shrink-0">
            <Spinner />
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="p-1.5 cursor-pointer border border-gray-200 dark:border-[#4b4b4b] rounded-lg bg-white dark:bg-[#3c3c3c]"
          onClick={toggleForm}
          aria-label="Add new item"
        >
          <FaPlus size={20} />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
