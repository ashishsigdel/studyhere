type Props = {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick?: any;
};

export default function TabItem({ label, icon, active, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={`flex cursor-pointer items-center justify-center space-x-3 rounded-lg px-3 py-1 text-sm font-medium transition-all ${
        active
          ? "bg-blue-600 text-white shadow-md"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
      }`}
    >
      {icon}
      <span>{label}</span>{" "}
    </div>
  );
}
