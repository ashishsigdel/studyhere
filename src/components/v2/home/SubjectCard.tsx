import { SubjectType } from "@/types/subject";
import { formatNumbers } from "@/utils/formatNumber";
import Link from "next/link";

type Props = {
  subject: SubjectType;
};

export default function SubjectCard({ subject }: Props) {
  // Parse faculties into an array
  const faculties = subject.faculties
    ? subject.faculties.split(",").map((f) => f.trim())
    : [];

  return (
    <Link href={`/subject/${subject.slug}`} key={subject.id}>
      <div className="group relative overflow-hidden w-full h-36 rounded-2xl bg-white dark:bg-[#424242] border border-neutral-200 dark:border-neutral-700 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        <div className="relative z-10 h-full flex flex-col justify-between p-4">
          {/* Header with title and privacy icon */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base md:text-lg font-semibold text-gray-800 dark:text-white capitalize line-clamp-2 flex-1">
              {subject.name}
            </h3>
            {!subject.isPublic && (
              <svg
                className="w-4 h-4 text-gray-400 dark:text-gray-300 flex-shrink-0 mt-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>

          {/* Content area with faculties and semester/views */}
          <div className="flex flex-col gap-2">
            {/* Faculties section */}
            {faculties.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {faculties.map((faculty, index) => (
                  <span
                    key={index}
                    className="text-xs px-1 py-0.5 border border-5 rounded-md bg-primary/30"
                  >
                    {faculty}
                  </span>
                ))}
              </div>
            )}

            {/* Bottom row with semester and views */}
            <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300">
              {/* Semester info */}
              {subject.semester && (
                <div className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <span>Semester {subject.semester}</span>
                </div>
              )}

              {/* Views info */}
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <span>{formatNumbers(subject.views)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
