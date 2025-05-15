import React from "react";
import { Footer } from "../footer";
import Sidebar from "../v2/sidebar/Sidebar";
import Header from "../v2/header/Header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Header style="max-w-7xl ml-10 px-4 md:px-8 sm:mx-auto" />
        {children}
        <Footer />
      </div>
    </div>
  );
}
