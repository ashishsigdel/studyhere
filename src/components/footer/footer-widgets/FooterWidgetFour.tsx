import Link from "next/link";

const FooterWidgetFour = () => {
  return (
    <div
      className="min-[992px]:w-[20%] px-[12px] w-full wow fadeInUp"
      data-wow-delay="0.2s"
    >
      <div className="py-2.5 border-b w-full border-black/15 dark:border-white/10">
        <h4 className="text-base lg:text-lg font-medium font-Poppins">
          LearnHere
        </h4>
      </div>
      <ul className="mt-4 flex flex-col gap-4">
        <li>
          <Link href="/privacy">Privacy and Policy</Link>
        </li>
        <li>
          <Link href="/report">Report a bug</Link>
        </li>
      </ul>
    </div>
  );
};

export default FooterWidgetFour;
