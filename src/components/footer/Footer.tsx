import { FooterBottom } from "@/components/footer";

const Footer = () => {
  return (
    <footer className="px-5 mx-auto max-w-[1400px] border-t-[1px] border-solid border-black/15 dark:border-white/15 mt-[40px]">
      <div className="footer-container">
        <FooterBottom />
      </div>
    </footer>
  );
};

export default Footer;
