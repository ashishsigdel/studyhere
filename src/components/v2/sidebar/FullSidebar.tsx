import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { HiMiniBars3CenterLeft } from "react-icons/hi2";
import { Menu } from "./menus";
import { usePathname } from "next/navigation";
import useSubjects from "./useSubjects";
import AddModal from "./AddModal";
import { User } from "@/types/user";
import { useTheme } from "next-themes";

type Props = {
  sidebarWidth: "min" | "full";
  toggleSidebar: () => void;
  style?: string;
};

export default function FullSidebar({
  sidebarWidth,
  toggleSidebar,
  style,
}: Props) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(user);
  }, []);

  const pathname = usePathname();
  const {
    formData,
    setFormData,
    showForm,
    setShowForm,
    loadingAdd,
    handleSaveSubject,
  } = useSubjects();
  const { theme } = useTheme();

  const toggleForm = () => {
    setShowForm(!showForm);
  };
  return (
    <div
      className={`${style} h-screen flex flex-col bg-gray-100 dark:bg-dark-bg ${
        sidebarWidth === "full" ? "w-64" : "w-16"
      } transition-all duration-300 ease-in-out border-r border-gray-200 dark:border-gray-700 z-[999]`}
    >
      <div
        className={`h-16 flex items-center ${
          sidebarWidth === "min" ? "justify-center" : "justify-start"
        }`}
      >
        {sidebarWidth === "min" ? (
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-white-variant dark:hover:bg-dark-variant transition-colors"
            aria-label="Expand sidebar"
          >
            <HiMiniBars3CenterLeft size={24} />
          </button>
        ) : (
          <div className="flex items-center px-2 gap-3">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-full hover:bg-white-variant dark:hover:bg-dark-variant transition-colors"
              aria-label="Collapse sidebar"
            >
              <HiMiniBars3CenterLeft size={24} />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={theme === "dark" ? "/logo_dark.png" : "/logo.png"}
                alt="studyHere Logo"
                width={100}
                height={100}
                className="w-12 h-12 "
              />

              <h3 className="text-2xl customfont-typoround text-[#1e1e1e] dark:text-gray-200">
                <span className="text-primary">Study</span>Here
              </h3>
            </Link>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="w-full px-3 mt-2">
          {user && (
            <button
              onClick={toggleForm}
              className="px-2 py-2 border border-10 bg-white-light-variant dark:bg-dark-light-variant rounded-full w-full flex items-center justify-center gap-2 font-medium hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all duration-300 group"
            >
              <FaPlus
                className="text-primary group-hover:text-white dark:group-hover:text-white transition-all duration-300"
                size={18}
              />
              {sidebarWidth === "full" && (
                <span className="whitespace-nowrap line-clamp-1">
                  Create Subject
                </span>
              )}
            </button>
          )}
        </div>
        <div className="mt-8">
          {Menu.map((menu) => {
            const Icon = menu.icon;

            const path = pathname === "/" ? "/home" : pathname;
            const url = menu.url === "/" ? "/home" : menu.url;

            return (
              <Link key={menu.name} href={menu.url}>
                <div
                  className={`py-3 ${
                    path.startsWith(url) &&
                    "bg-white-variant/60 dark:bg-dark-light-variant/60 border-r-2 border-black/60 dark:border-white/60"
                  } hover:bg-white-variant/60 hover:dark:bg-dark-light-variant/60`}
                >
                  <div
                    className={`px-5 flex items-center gap-3 ${
                      path.startsWith(url)
                        ? "text-black dark:text-white"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <Icon size={22} />
                    <span
                      className={`${
                        sidebarWidth === "full" ? "inline-block" : "hidden"
                      }`}
                    >
                      {menu.name}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      {user && showForm && (
        <AddModal
          handleSaveSubject={handleSaveSubject}
          loading={loadingAdd}
          setShowForm={setShowForm}
          formData={formData}
          setFormData={setFormData}
        />
      )}
    </div>
  );
}
