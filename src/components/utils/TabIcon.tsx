type Props = {
  label: string | React.ReactNode;
  icon: React.ReactNode;
  active: boolean;
  onClick?: any;
  padding?: string;
};

export default function TabItem({
  label,
  icon,
  active,
  onClick,
  padding = "1.5",
}: Props) {
  return (
    <div
      onClick={onClick}
      className={`flex flex-1 whitespace-nowrap cursor-pointer items-center justify-center space-x-3 rounded-lg px-3 py-${padding} text-sm font-medium transition-all ${
        active
          ? "bg-blue-600 text-white shadow-md"
          : "bg-black/5 hover:bg-black/10 dark:bg-white/5 hover:dark:bg-white/10 "
      }`}
    >
      {icon}
      {typeof label === "string" ? <span>{label}</span> : label}
    </div>
  );
}
