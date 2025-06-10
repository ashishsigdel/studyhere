import type { Metadata, Viewport } from "next";
import "./globals.css";
import "@/styles/prose.css";
import CustomThemeProvider from "@/utils/ThemeProvider";
import { Toaster } from "react-hot-toast";
import { NetworkStatus } from "@/components/utils";
import { Cookies, ReportBug } from "@/components/floatmessages";
import NextTopLoader from "nextjs-toploader";
import { StoreProvider } from "@/providers";
import ClientWrapper from "@/components/layout/ClientWrapper";

export const metadata: Metadata = {
  title: "Study Here",
  description:
    "Join studyHere to access expert study materials, Q&A discussions, and studying resources.",
  keywords: [
    "ioe past questions",
    "ioe exam",
    "ioe notes and syllabus",
    "study resources",
    "student help",
    "study notes nepal",
  ],
  authors: [{ name: "StudyHere", url: "https://studyhere.asigdel.com.np" }],
  manifest: "/manifest.json",
  openGraph: {
    title: "StudyHere",
    description:
      "Explore high-quality study guides, Q&A, and expert resources.",
    url: "https://studyhere.asigdel.com.np",
    siteName: "StudyHere",
    images: [
      {
        url: "https://studyhere.asigdel.com.np/og-image.webp",
        width: 1200,
        height: 630,
        alt: "studyHere",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@studyhere", // Replace with your Twitter handle
    title: "StudyHere",
    description: "Discover expert studying resources and Q&A discussions.",
    images: ["https://studyhere.asigdel.com.np/og-image.webp"],
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
    <StoreProvider>
      <html lang="en" suppressHydrationWarning>
        <head></head>
        <body
          className="bg-gray-100 dark:bg-dark-bg text-[#202124] dark:text-[#ffffff]"
          suppressHydrationWarning
        >
          <ClientWrapper>
            <CustomThemeProvider>
              <NextTopLoader showSpinner={false} color="#68ac5d" height={2} />
              {children}
              <Toaster
                position="bottom-center"
                reverseOrder={true}
                toastOptions={{
                  className:
                    "bg-white dark:bg-dark-bg text-[#202124] dark:text-[#ffffff] border border-black/5 dark:border-white/5",
                }}
              />
              <NetworkStatus />
              <ReportBug />
              <Cookies />
            </CustomThemeProvider>
          </ClientWrapper>
        </body>
      </html>
    </StoreProvider>
  );
}
