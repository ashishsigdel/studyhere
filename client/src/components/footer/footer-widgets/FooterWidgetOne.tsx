import Image from "next/image";

const FooterWidgetOne = () => {
  return (
    <div className="min-[992px]:w-[20%] px-[12px] w-full">
      <div className="flex w-full flex-col items-center justify-center text-center mb-[20px]">
        <div className="flex items-center gap-3">
          <Image
            src={"/icon192.png"}
            alt="logo"
            width={30}
            height={30}
            className="rounded-full"
          />
          <h3 className="text-[26px] font-semibold customfont-typoround ">
            <span className="text-[#4caf50]">Study</span>
            Here
          </h3>
        </div>
      </div>
    </div>
  );
};

export default FooterWidgetOne;
