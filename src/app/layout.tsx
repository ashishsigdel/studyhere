import type { Metadata, Viewport } from "next";
import "./globals.css";
import "@/styles/prose.css";
import CustomThemeProvider from "@/utils/ThemeProvider";
import { Toaster } from "react-hot-toast";
import { Header } from "@/components/header";
import { NetworkStatus } from "@/components/utils";
import { Cookies } from "@/components/floatmessages";
import { Footer } from "@/components/footer";
import NextTopLoader from "nextjs-toploader";
import { StoreProvider } from "@/providers";
import Script from "next/script";

export const metadata: Metadata = {
  title: "LearnHere - Best Learning Platform",
  description:
    "Join LearnHere to access expert learn materials, Q&A discussions, and learning resources.",
  keywords: [
    "LearnHere",
    "online learning",
    "education",
    "learn resources",
    "student help",
    "learn",
    "here",
    "ioeexam",
    "ioe",
    "exam",
    "exam preparation",
    "best learing",
    "learning",
  ],
  authors: [{ name: "LearnHere", url: "https://learnhere.asigdel.com.np" }],
  // manifest: "/manifest.json",
  openGraph: {
    title: "LearnHere - Best Learning Platform",
    description:
      "Explore high-quality learn guides, Q&A, and expert resources.",
    url: "https://learnhere.asigdel.com.np",
    siteName: "LearnHere",
    images: [
      {
        url: "https://learnhere.asigdel.com.np/og-image.png",
        width: 1200,
        height: 630,
        alt: "LearnHere - Best Learning Platform",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@learnhere", // Replace with your Twitter handle
    title: "LearnHere - Best Learning Platform",
    description: "Discover expert learning resources and Q&A discussions.",
    images: ["https://learnhere.asigdel.com.np/og-image.png"],
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
        <head>
          {/* Google AdSense verification meta tag */}
          <meta
            name="google-adsense-account"
            content="ca-pub-9557309412103379"
          />
        </head>
        <body className="bg-gray-100 dark:bg-[#323232] text-black dark:text-[#ffffff]">
          {/* Google AdSense script */}
          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9557309412103379"
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />

          <CustomThemeProvider>
            <NextTopLoader showSpinner={false} color="#68ac5d" height={2} />
            <Header />
            {children}
            <Toaster position="bottom-center" reverseOrder={true} />
            <NetworkStatus />
            <Cookies />
            <Footer />
          </CustomThemeProvider>
        </body>
      </html>
    </StoreProvider>
  );
}
