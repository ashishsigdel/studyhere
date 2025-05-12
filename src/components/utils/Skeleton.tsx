export function SkeletonAnswer() {
  return (
    <div className="animate-pulse space-y-2 mt-10">
      <div className="h-4 bg-gray-300 dark:bg-gray-500 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-500 rounded w-2/4"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-500 rounded w-full"></div>
    </div>
  );
}
export function SkeletonQuestion() {
  return (
    <div className="animate-pulse space-y-2 mt-10">
      <div className="h-4 bg-gray-300 dark:bg-gray-500 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-500 rounded w-2/4"></div>
    </div>
  );
}
