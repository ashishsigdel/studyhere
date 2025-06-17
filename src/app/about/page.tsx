import MainLayout from "@/components/layout/MainLayout";
import Head from "next/head";

export default function About() {
  return (
    <MainLayout>
      <Head>
        <title>About Us | StudyHere</title>
        <meta
          name="description"
          content="StudyHere – A platform for focused learning with AI-powered solutions solutions"
        />
      </Head>

      <main className="min-h-screen px-4 py-12">
        <section className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">About StudyHere</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Welcome to <strong>StudyHere</strong>, your go-to platform for
            focused, chapter-wise learning. Whether you&apos;re reviewing past
            questions, building study materials, or seeking instant AI-powered
            solutions, we&apos;ve got you covered.
          </p>
        </section>

        <section className="mt-12 max-w-4xl mx-auto grid gap-8 md:grid-cols-2">
          <div className="p-6 bg-white-light-variant dark:bg-dark-light-variant rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-300">
              To simplify study routines and boost academic confidence by
              structuring practice around chapters, questions, and intelligent
              feedback.
            </p>
          </div>

          <div className="p-6 bg-white-light-variant dark:bg-dark-light-variant rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Core Features</h2>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
              <li>Question‑wise practice with dedicated chapter categories</li>
              <li>Comprehensive archive of past exam questions</li>
              <li>Instant AI‑generated solutions and explanations</li>
              <li>Create and manage your own study materials</li>
            </ul>
          </div>
        </section>

        <section className="mt-12 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Why Choose Us?</h2>
          <p className="text-gray-700 dark:text-gray-300 space-y-4">
            • Every question is tagged per chapter, giving you laser-focused
            practice. <br />• We archive actual past questions so you can see
            what matters most. <br />
            • AI-powered instant explanations help you understand concepts in
            real time. <br />• It’s not just about questions—you can upload and
            organize your own notes and study files.
          </p>
        </section>

        <section className="mt-12 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Our Journey</h2>
          <p className="text-gray-600 dark:text-gray-300">
            StudyHere was created to address the challenges of modern academic
            study. We believe that strategic, chapter‑based practice—backed by
            insightful AI tools—can make learning more effective and less
            overwhelming.
          </p>
        </section>

        <section className="mt-12 flex justify-center">
          <a
            href={"/"}
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition duration-200"
          >
            Try StudyHere Now
          </a>
        </section>
      </main>
    </MainLayout>
  );
}
