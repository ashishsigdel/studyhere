"use client";

import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

const FooterWidgetFour = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div
      className="min-[992px]:w-[20%] px-[12px] w-full wow fadeInUp"
      data-wow-delay="0.2s"
    >
      <div className="relative">
        <div
          className="flex items-center justify-between cursor-pointer border-b border-gray-200 dark:border-gray-700 pb-[15px] capitalize"
          onClick={toggleDropdown}
        >
          <h4 className="text-base lg:text-lg font-medium text-gray-500 font-Poppins">
            Study Here
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
              <a
                href={"/#aboutus"}
                className="transition-all duration-[0.3s] ease-in-out text-[14px] leading-[20px] p-[0] text-gray-500 mb-[0] inline-block relative break-all tracking-[0] font-normal hover:text-[#5caf90] hover:opacity-[1]"
              >
                About Us
              </a>
            </li> */}
            <li className="m-[0] leading-[1.5] border-[0] p-[0] font-normal text-[16px] text-[#5caf90] flex items-center mb-[16px]">
              <a
                href={"/privacy"}
                className="transition-all duration-[0.3s] ease-in-out text-[14px] leading-[20px] p-[0] text-gray-500 mb-[0] inline-block relative break-all tracking-[0] font-normal hover:text-[#5caf90] hover:opacity-[1]"
              >
                Privacy Policy
              </a>
            </li>

            {/* <li className="m-[0] leading-[1.5] border-[0] p-[0] font-normal text-[16px] text-[#5caf90] flex items-center mb-[16px]">
              <a
                href={"/interior#livingroom"}
                className="transition-all duration-[0.3s] ease-in-out text-[14px] leading-[20px] p-[0] text-gray-500 mb-[0] inline-block relative break-all tracking-[0] font-normal hover:text-[#5caf90] hover:opacity-[1]"
              >
                FAQ&#39;s
              </a>
            </li> */}
            <li className="m-[0] leading-[1.5] border-[0] p-[0] font-normal text-[16px] text-[#5caf90] flex items-center mb-[16px]">
              <a
                href={"/report"}
                className="transition-all duration-[0.3s] ease-in-out text-[14px] leading-[20px] p-[0] text-gray-500 mb-[0] inline-block relative break-all tracking-[0] font-normal hover:text-[#5caf90] hover:opacity-[1]"
              >
                Report a bug
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FooterWidgetFour;
