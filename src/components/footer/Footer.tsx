import {
  FooterBottom,
  FooterWidgetFive,
  FooterWidgetFour,
  FooterWidgetOne,
} from "@/components/footer";

const Footer = () => {
  return (
    <footer className="px-5 mx-auto max-w-[1400px] border-t-[1px] border-solid border-black/15 dark:border-white/15 mt-[40px]">
      <div className="footer-container">
        <div className="footer-top py-[30px] max-[767px]:py-[40px]">
          <div className="flex flex-wrap justify-between items-center mx-auto max-w-7xl">
            <div className="w-full flex flex-wrap justify-between gap-y-3">
              <FooterWidgetOne />
              <FooterWidgetFour />
              <FooterWidgetFive />
            </div>
          </div>
        </div>
        <FooterBottom />
      </div>
    </footer>
  );
};

export default Footer;
