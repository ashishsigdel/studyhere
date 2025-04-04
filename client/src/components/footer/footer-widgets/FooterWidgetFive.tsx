"use client";

import Link from "next/link";
import { FaGithub, FaGlobe, FaInstagram } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const FooterWidgetFive = () => {
  return (
    <div
      className="min-[992px]:w-[20%] px-[12px] w-full wow fadeInUp"
      data-wow-delay="0.2s"
    >
      <div className="py-2.5 border-b w-full border-black/15 dark:border-white/10">
        <h4 className="text-base lg:text-lg font-medium font-Poppins">
          Contact
        </h4>
      </div>
      <ul className="mt-4 flex flex-col gap-4">
        <li className="flex items-center">
          <span className="w-[25px] flex basis-auto grow-[0] shrink-[0]">
            <MdEmail className="h-[25px] text-[#5caf90] w-[auto]" />
          </span>
          <Link
            href={"https://ashishsigdel.com.np/contact"}
            className="ml-[10px] text-[14px] font-normal "
          >
            Write a message
          </Link>
        </li>

        <li className="items-center flex flex-wrap">
          <div className="pr-[12px]">
            <a
              href="https://github.com/ashishsigdel/studyhere.git"
              className="h-[30px] w-[30px] bg-gray-700 dark:bg-gray-300 rounded-full capitadivze flex items-center justify-center text-[15px]"
            >
              <FaGithub className="text-gray-100 dark:text-gray-700 text-[16px]" />
            </a>
          </div>
          <div className="pr-[12px]">
            <a
              href="https://www.instagram.com/aasissigdel"
              className="h-[30px] w-[30px] bg-gray-700 dark:bg-gray-300 rounded-full capitadivze flex items-center justify-center text-[15px]"
            >
              <FaInstagram className="text-gray-100 dark:text-gray-700 text-[16px]" />
            </a>
          </div>
          <div className="pr-[12px]">
            <a
              href="https://ashishsigdel.com.np/projects/14"
              className="h-[30px] w-[30px] bg-gray-700 dark:bg-gray-300 rounded-full capitadivze flex items-center justify-center text-[15px]"
            >
              <FaGlobe className="text-gray-100 dark:text-gray-700 text-[16px]" />
            </a>
          </div>
          {/* 
              <div className="pr-[12px]">
                <a
                  href="#"
                  className="h-[30px] w-[30px] bg-gray-700 dark:bg-gray-300 rounded-full capitadivze flex items-center justify-center text-[15px]"
                >
                  <FaTiktok className="text-gray-100 dark:text-gray-700 text-[16px]" />
                </a>
              </div>
               */}
        </li>
      </ul>
    </div>
  );
};

export default FooterWidgetFive;
