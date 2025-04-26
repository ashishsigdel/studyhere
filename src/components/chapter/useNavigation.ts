"use client";
import { useEffect, useState } from "react";

export default function useNavigation() {
  const [activeSection, setActiveSection] = useState("");

  const MenuData: { id: number; name: string; link: string }[] = [
    {
      id: 1,
      name: "chapters",
      link: "chapters",
    },
    {
      id: 2,
      name: "syllabus",
      link: "syllabus",
    },
    {
      id: 3,
      name: "resources",
      link: "resources",
    },
  ];

  useEffect(() => {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        console.log(entries);

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    // Observe all sections
    MenuData.forEach((menu) => {
      const section = document.getElementById(menu.link);
      if (section) {
        sectionObserver.observe(section);
      }
    });

    return () => {
      sectionObserver.disconnect();
    };
  }, []);

  const isActive = (sectionId: string) => {
    return sectionId === activeSection;
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return { isActive, scrollToSection, MenuData };
}
