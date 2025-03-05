"use client";

import Link from "next/link";
import { useState } from "react";
import {
  FaFacebook,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaTiktok,
  FaTwitter,
} from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { IoLocationSharp } from "react-icons/io5";
import { MdEmail, MdSettingsPhone } from "react-icons/md";

const FooterWidgetFive = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="min-[992px]:w-[20%] px-[12px] w-full" data-wow-delay="0.2s">
      <div className="relative">
        <div
          className="flex items-center justify-between cursor-pointer border-b border-gray-200 dark:border-gray-700 pb-[15px] capitalize"
          onClick={toggleDropdown}
        >
          <h4 className="text-base lg:text-lg font-medium text-gray-500 font-Poppins">
            Contact
          </h4>
          <IoIosArrowDown
            className={`transition-transform duration-300 text-gray-500 lg:hidden ${
              showDropdown ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>
        <div
          className={`transition-all duration-700 ease-in-out transform origin-top overflow-hidden ${
            showDropdown
              ? "opacity-100 scale-y-100 max-h-[200px]"
              : "opacity-0 scale-y-0 max-h-0"
          } lg:opacity-100 lg:max-h-none lg:scale-y-100 lg:transition-none`}
        >
          <ul className="mt-4">
            {/* <li className="m-[0] leading-[1.5] border-[0] p-[0] font-normal text-[16px] text-[#5caf90] flex items-center mb-[16px]">
              <span className="w-[25px] flex basis-auto grow-[0] shrink-[0]">
                <IoLocationSharp className="h-[25px] text-[#5caf90] w-[auto]" />
              </span>
              <p className="ml-[10px] text-[14px] font-normal text-gray-500">
                Zero KM, Pokhara-5 Kaski, Nepal.
              </p>
            </li> */}
            {/* <li className="m-[0] leading-[1.5] border-[0] p-[0] font-normal text-[16px] text-[#5caf90] flex items-center mb-[16px]">
              <span className="w-[25px] flex basis-auto grow-[0] shrink-[0]">
                <MdSettingsPhone className="h-[25px] text-[#5caf90] w-[auto]" />
              </span>
              <p className="ml-[10px] text-[14px] font-normal text-gray-500">
                061-575771
              </p>
            </li> */}
            <li className="m-[0] leading-[1.5] border-[0] p-[0] font-normal text-[16px] text-[#5caf90] flex items-center mb-[16px]">
              <span className="w-[25px] flex basis-auto grow-[0] shrink-[0]">
                <MdEmail className="h-[25px] text-[#5caf90] w-[auto]" />
              </span>
              <Link
                href={"https://ashishsigdel.com.np/contact"}
                className="ml-[10px] text-[14px] font-normal text-gray-500"
              >
                Write a message
              </Link>
            </li>
          </ul>

          <div
            className={`transition-all duration-1000 ease-in transform ${
              showDropdown
                ? "opacity-100 translate-y-0 h-auto"
                : "opacity-0 -translate-y-8 h-0 overflow-hidden"
            } lg:opacity-100 lg:h-auto lg:mt-14 lg:transition-none`}
          >
            <ul className="items-center flex flex-wrap">
              <li className="pr-[12px]">
                <a
                  href="https://github.com/ashishsigdel/studyhere.git"
                  className="h-[30px] w-[30px] bg-gray-700 dark:bg-gray-300 rounded-full capitalize flex items-center justify-center text-[15px]"
                >
                  <FaGithub className="text-gray-100 dark:text-gray-700 text-[16px]" />
                </a>
              </li>
              <li className="pr-[12px]">
                <a
                  href="https://www.instagram.com/aasissigdel"
                  className="h-[30px] w-[30px] bg-gray-700 dark:bg-gray-300 rounded-full capitalize flex items-center justify-center text-[15px]"
                >
                  <FaInstagram className="text-gray-100 dark:text-gray-700 text-[16px]" />
                </a>
              </li>
              <li className="pr-[12px]">
                <a
                  href="https://ashishsigdel.com.np/projects/14"
                  className="h-[30px] w-[30px] bg-gray-700 dark:bg-gray-300 rounded-full capitalize flex items-center justify-center text-[15px]"
                >
                  <FaGlobe className="text-gray-100 dark:text-gray-700 text-[16px]" />
                </a>
              </li>
              {/* 
              <li className="pr-[12px]">
                <a
                  href="#"
                  className="h-[30px] w-[30px] bg-gray-700 dark:bg-gray-300 rounded-full capitalize flex items-center justify-center text-[15px]"
                >
                  <FaTiktok className="text-gray-100 dark:text-gray-700 text-[16px]" />
                </a>
              </li>
               */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterWidgetFive;
