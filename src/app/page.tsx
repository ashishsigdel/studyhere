import CardAds from "@/components/ads/CardAds";
import Hero from "@/components/home/Hero";
import { Subjects } from "@/components/subject";

export default function Home() {
  return (
    <>
      <Hero />
      <div className="container p-5 mx-auto max-w-6xl">
        <Subjects />
      </div>
    </>
  );
}
