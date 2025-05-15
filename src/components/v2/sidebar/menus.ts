import type { IconType } from "react-icons";
import { FaRegCompass } from "react-icons/fa";
import { IoSearchSharp } from "react-icons/io5";
import { IoIosBook } from "react-icons/io";
import { FiFlag } from "react-icons/fi";

type MenuItem = {
  name: string;
  url: string;
  icon: IconType;
};

export const Menu: MenuItem[] = [
  {
    name: "Home",
    url: "/",
    icon: FaRegCompass,
  },
  {
    name: "Search",
    url: "/search",
    icon: IoSearchSharp,
  },
  {
    name: "Subjects",
    url: "/subject",
    icon: IoIosBook,
  },
  {
    name: "Questions",
    url: "/flag-questions",
    icon: FiFlag,
  },
];
