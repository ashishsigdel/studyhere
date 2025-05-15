import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import Home from "@/components/v2/home/Home";
import MainLayout from "@/components/layout/MainLayout";
import { Subjects } from "@/components/subject";

export default function page() {
  return (
    <MainLayout>
      <Home />
    </MainLayout>
  );
}
