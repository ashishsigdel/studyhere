import Subjects from "./components/Subjects";
import Theme from "@/utils/Theme";

export default function Home() {
  return (
    <div className="p-5 mx-auto max-w-7xl">
      <div className="flex justify-between w-full">
        <p className="text-3xl pb-1 border-b w-full">All Subjects</p>
        <Theme />
      </div>
      <Subjects />
    </div>
  );
}
