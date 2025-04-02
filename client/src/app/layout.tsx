import type { Metadata, Viewport } from "next";
import "./globals.css";
import "@/styles/prose.css";
import CustomThemeProvider from "@/utils/ThemeProvider";
import { Toaster } from "react-hot-toast";
import { Header } from "@/components/header";
import { NetworkStatus } from "@/components/utils";
import { Cookies } from "@/components/floatmessages";
import { Footer } from "@/components/footer";
import Head from "next/head";

export const metadata: Metadata = {
  title: "StudyHere - Best Learning Platform",
  description:
    "Join StudyHere to access expert study materials, Q&A discussions, and learning resources.",
  keywords: [
    "StudyHere",
    "online learning",
    "education",
    "study resources",
    "student help",
    "study",
    "here",
    "ioeexam",
    "ioe",
    "exam",
    "exam preparation",
    "best learing",
    "learning",
  ],
  authors: [{ name: "StudyHere", url: "https://studyhere.asigdel.com.np" }],
  manifest: "/manifest.json",
  openGraph: {
    title: "StudyHere - Best Learning Platform",
    description:
      "Explore high-quality study guides, Q&A, and expert resources.",
    url: "https://studyhere.asigdel.com.np",
    siteName: "StudyHere",
    images: [
      {
        url: "https://studyhere.asigdel.com.np/og-image.png",
        width: 1200,
        height: 630,
        alt: "StudyHere - Best Learning Platform",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@studyhere", // Replace with your Twitter handle
    title: "StudyHere - Best Learning Platform",
    description: "Discover expert learning resources and Q&A discussions.",
    images: ["https://studyhere.asigdel.com.np/og-image.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "StudyHere",
              url: "https://studyhere.asigdel.com.np",
              logo: "https://studyhere.asigdel.com.np/icon192.png",
              description:
                "Find the best study resources, Q&A, and expert guidance on StudyHere.",
            }),
          }}
        />
      </Head>
      <body className="bg-white dark:bg-[#323232] text-black dark:text-[#ffffff]">
        <CustomThemeProvider>
          <Header />
          {children}
          <Toaster position="bottom-center" reverseOrder={true} />
          <NetworkStatus />
          <Cookies />
          <Footer />
        </CustomThemeProvider>
      </body>
    </html>
  );
}
