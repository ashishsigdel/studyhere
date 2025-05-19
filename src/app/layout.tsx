import type { Metadata, Viewport } from "next";
import "./globals.css";
import "@/styles/prose.css";
import CustomThemeProvider from "@/utils/ThemeProvider";
import { Toaster } from "react-hot-toast";
import { NetworkStatus } from "@/components/utils";
import { Cookies, ReportBug } from "@/components/floatmessages";
import NextTopLoader from "nextjs-toploader";
import { StoreProvider } from "@/providers";

export const metadata: Metadata = {
  title: "LearnHere",
  description:
    "Join LearnHere to access expert learn materials, Q&A discussions, and learning resources.",
  keywords: [
    "ioe past questions",
    "ioe exam",
    "ioe notes and syllabus",
    "learn resources",
    "student help",
    "study notes nepal",
  ],
  authors: [{ name: "LearnHere", url: "https://learnhere.asigdel.com.np" }],
  manifest: "/manifest.json",
  openGraph: {
    title: "LearnHere",
    description:
      "Explore high-quality learn guides, Q&A, and expert resources.",
    url: "https://learnhere.asigdel.com.np",
    siteName: "LearnHere",
    images: [
      {
        url: "https://learnhere.asigdel.com.np/og-image.webp",
        width: 1200,
        height: 630,
        alt: "LearnHere",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@learnhere", // Replace with your Twitter handle
    title: "LearnHere",
    description: "Discover expert learning resources and Q&A discussions.",
    images: ["https://learnhere.asigdel.com.np/og-image.webp"],
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
      <html lang="en">
        <head></head>
        <body className="bg-gray-100 dark:bg-dark-bg text-[#202124] dark:text-[#ffffff]">
          <CustomThemeProvider>
            <NextTopLoader showSpinner={false} color="#68ac5d" height={2} />
            {children}
            <Toaster position="bottom-center" reverseOrder={true} />
            <NetworkStatus />
            <ReportBug />
            <Cookies />
          </CustomThemeProvider>
        </body>
      </html>
    </StoreProvider>
  );
}
