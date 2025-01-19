import { Subjects } from "@/components/subject";
import Theme from "@/utils/Theme";

export default function Home() {
  return (
    <div className="p-5 mx-auto max-w-7xl">
      <div className="flex justify-between w-full">
        <p className="text-3xl pb-1 border-b w-full">
          <span
            className="px-3 py-2 rounded-lg text-gray-800 dark:text-gray-200
                truncate max-w-[150px] sm:max-w-[200px] md:max-w-[300px] block"
            title="Questions"
          >
            Subjects
          </span>
        </p>
        <Theme />
      </div>
      <Subjects />
    </div>
  );
}
