import { Header } from "@/components/header";
import Hero from "@/components/home/Hero";
import { Subjects } from "@/components/subject";

export default function Home() {
  return (
    <div className="">
      <Hero />
      <div className="px-4 mx-auto max-w-[1400px]">
        <Subjects />
      </div>
    </div>
  );
}
