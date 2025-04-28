import { SubjectType } from "@/types/subject";
import Link from "next/link";

type Props = {
  subject: SubjectType;
};

export default function SubjectCard({ subject }: Props) {
  const now: any = new Date();
  const createdAt: any = new Date(subject.createdAt);
  const daysOld = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));

  let badge = null;
  if (subject.views > 100) {
    badge = {
      text: "🔥 Hot",
      color: "bg-red-100 dark:bg-red-700/50 text-red-800 dark:text-red-300",
    };
  } else if (subject.views > 500) {
    badge = {
      text: "⭐ Popular",
      color:
        "bg-yellow-100 dark:bg-yellow-700/50 text-yellow-800 dark:text-yellow-300",
    };
  } else if (daysOld <= 7) {
    badge = {
      text: "🕒 Recent",
      color:
        "bg-green-100 dark:bg-green-700/50 text-green-800 dark:text-green-300",
    };
  }

  return (
    <Link href={`/subject/${subject.slug}`} key={subject.id}>
      <div className="group relative overflow-hidden w-full h-32 rounded-xl bg-white dark:bg-[#424242] shadow-lg hover:shadow-xl hover:bg-gradient-to-r hover:from-primary/10 hover:to-transparent transition-all duration-300 ease-in-out hover:-translate-y-1 border border-gray-200 dark:border-[#505050]">
        {/* Badge (top-right corner) */}
        {badge && (
          <span
            className={`absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded-full ${badge.color}`}
          >
            {badge.text}
          </span>
        )}

        <div className="relative h-full flex flex-col justify-between p-5">
          {/* Subject name with lock icon */}
          <div>
            <h3 className="text-md md:text-lg font-bold text-gray-800 dark:text-white line-clamp-2 flex items-center gap-3 capitalize">
              {subject.name}
              {!subject.isPublic && (
                <span className="text-gray-500 dark:text-gray-400">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
            </h3>
          </div>

          {/* Bottom info bar */}
          <div className="flex justify-end items-end">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
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
              {subject.views > 1000
                ? `${(subject.views / 1000).toFixed(1)}k`
                : subject.views}
            </div>
          </div>

          {/* Hover effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>
    </Link>
  );
}
