import MainLayout from "@/components/layout/MainLayout";
import PreviewQuestions from "@/components/v2/questions/PreviewQuestions";
import PreviewSidebar from "@/components/v2/questions/PreviewSidebar";

export default function page() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-3 px-8 sm:px-10 mt-10">
        <PreviewSidebar />
        <PreviewQuestions />
      </div>
    </MainLayout>
  );
}
