import Hero from "@/components/home/Hero";
import { Subjects } from "@/components/subject";

export default function Home() {
  return (
    <div className="px-7">
      <Hero />
      <div className="mx-auto max-w-[1400px]">
        <Subjects />
      </div>
    </div>
  );
}
