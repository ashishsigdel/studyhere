const FooterBottom = () => {
  return (
    <div className="footer-bottom py-[10px] max-[991px]:py-[15px] border-t-[1px] border-solid border-[#eee] dark:border-gray-700">
      <div className="flex flex-wrap justify-between items-center mx-auto max-w-7xl">
        <div className="w-full flex flex-wrap">
          <div className="flex items-center justify-between w-full px-[12px] flex-col gap-y-1">
            <div className="text-[13px] tracking-[1px] text-center font-medium ">
              LearnHere &copy; {new Date().getFullYear()} - all rights reserved.
            </div>
            <div className="text-[13px] tracking-[1px] text-center font-medium">
              Develop by{" "}
              <a
                target="__blank"
                className="text-blue-500"
                href="https://ashishsigdel.com.np"
              >
                Ashish Sigdel
              </a>
              .
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;
