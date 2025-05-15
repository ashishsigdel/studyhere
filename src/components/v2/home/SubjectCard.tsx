import { SubjectType } from "@/types/subject";
import { formatNumbers } from "@/utils/formatNumber";
import Link from "next/link";

type Props = {
  subject: SubjectType;
};

export default function SubjectCard({ subject }: Props) {
  const now = new Date();
  const createdAt = new Date(subject.createdAt);
  const updatedAt = new Date(subject.updatedAt);
  const daysOld = Math.floor((+now - +createdAt) / (1000 * 60 * 60 * 24));
  const daysSinceUpdate = Math.floor(
    (+now - +updatedAt) / (1000 * 60 * 60 * 24)
  );

  let badge = null;
  if (subject.views > 500 && daysOld <= 30) {
    badge = {
      text: "🔥 Hot",
      color: "bg-red-100 dark:bg-red-700/30 text-red-800 dark:text-red-200",
    };
  } else if (subject.views > 3000 && daysOld > 60 && daysSinceUpdate <= 7) {
    badge = {
      text: "📈 Comeback",
      color:
        "bg-purple-100 dark:bg-purple-700/30 text-purple-800 dark:text-purple-200",
    };
  } else if (subject.views > 1500 && daysOld <= 90) {
    badge = {
      text: "⭐ Popular",
      color:
        "bg-yellow-100 dark:bg-yellow-700/30 text-yellow-800 dark:text-yellow-200",
    };
  } else if (daysOld <= 7 && subject.views > 50) {
    badge = {
      text: "🕒 New",
      color:
        "bg-green-100 dark:bg-green-700/30 text-green-800 dark:text-green-200",
    };
  }

  return (
    <Link href={`/subject/${subject.slug}`} key={subject.id}>
      <div className="group relative overflow-hidden w-full h-36 rounded-2xl bg-white dark:bg-[#424242] border border-neutral-200 dark:border-neutral-700 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        <div className="relative z-10 h-full flex flex-col justify-between p-4">
          <h3 className="pt-6 text-base md:text-lg font-semibold text-gray-800 dark:text-white capitalize line-clamp-2 flex items-center gap-2">
            {subject.name}
            {!subject.isPublic && (
              <svg
                className="w-4 h-4 text-gray-400 dark:text-gray-300"
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
          </h3>

          <div className="flex justify-end items-center text-sm mt-3 text-gray-600 dark:text-gray-300">
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
              {formatNumbers(subject.views)}
            </div>
          </div>
        </div>

        {badge && (
          <div
            className={`absolute top-3 right-4 px-2 py-0.5 rounded-full text-xs font-semibold z-20 ${badge.color}`}
          >
            {badge.text}
          </div>
        )}
      </div>
    </Link>
  );
}
