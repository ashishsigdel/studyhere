"use client";
import AddModal from "./AddModal";
import ChapterAds from "../ads/ChapterAds";
import { FeaturedSubjects } from "./FeaturedSubjects";
import { FavSubjects } from "./FavSubjects";
import RecentChapter from "./RecentChapter";
import useSubjects from "./useSubjects";

export default function Subjects() {
  const {
    subject,
    setSubject,
    showForm,
    setShowForm,
    loadingAdd,
    handleSaveSubject,
  } = useSubjects();

  return (
    <>
      <FavSubjects />

      <FeaturedSubjects showForm={showForm} setShowForm={setShowForm} />
      <div className="mt-10">
        <ChapterAds />
      </div>

      <RecentChapter />
      {showForm && (
        <AddModal
          handleSaveSubject={handleSaveSubject}
          loading={loadingAdd}
          setShowForm={setShowForm}
          subject={subject}
          setSubject={setSubject}
        />
      )}
    </>
  );
}
