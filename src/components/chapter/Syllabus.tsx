import { FaBookOpen, FaPlus, FaWifi } from "react-icons/fa";

type Props = {};

export default function Syllabus({}: Props) {
  return (
    <div id="syllabus" className="">
      <div className="flex flex-col py-6 border-b border-black/20 dark:border-white/20">
        <div className="flex flex-col justify-between w-full">
          <div className="w-full justify-between flex items-center mb-4">
            <h2 className="text-2xl font-semibold">Syllabus</h2>
          </div>
        </div>

        {!navigator.onLine && (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <FaWifi size={24} className="mx-auto mb-2" />
            <p>
              You are offline. Please connect to the internet to view syllabus.
            </p>
          </div>
        )}
        {navigator.onLine && (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <FaBookOpen size={24} className="mx-auto mb-2" />
            <p>No Syllabus available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
