"use client";
import React from "react";
import { Icons } from "./Icons";
import ChangeMode from "./ui/ChangeMode";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const [showElement, setShowElement] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const documentHeight = document.documentElement.scrollHeight;

      const scrollThreshold = 70;

      if (documentHeight - scrollTop - windowHeight < scrollThreshold) {
        setShowElement(true);
      } else {
        setShowElement(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <footer className="bg-[--colors-backgroundAlt] pb-[63px] md:pb-0">
      <div className=" md:block relative container px-3 sm:px-5 pt-3 md:pt-10 mx-auto">
        {/* <div className=" flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
          <div className="flex-grow gap-[33px] flex flex-wrap md:flex-nowrap  md:text-left text-center ">
            <div className="hidden md:block lg:w-1/3 md:w-1/2 text-left w-full ">
              <h2 className="font-bold text-[--colors-secondary] tracking-widest text-sm mb-3">
                ABOUT
              </h2>
              <nav className="list-none mb-10 leading-8">
                <ItemList
                  content="Contact"
                  style={{ color: "var(--colors-warning)" }}
                />
                <ItemList content="Brand" />
                <ItemList content="Blog" />
                <ItemList content="Community" />
                <ItemList content="Litepaper" />
                <ItemList content="" />
                <ItemList content="CAKE Emission Projection" />
                <ItemList content="Terms Of Service" />
              </nav>
            </div>
            <div className="hidden md:block lg:w-1/3 md:w-1/2 text-left w-full md:px-4">
              <h2 className="font-bold text-[--colors-secondary] tracking-widest text-sm mb-3">
                HELP
              </h2>
              <nav className="list-none mb-10 leading-8">
                <ItemList content="Customer Support" />
                <ItemList content="Troubleshooting" />
                <ItemList content="Guides" />
              </nav>
            </div>
            <div className="hidden md:block lg:w-1/3 md:w-1/2 text-left w-full md:px-4">
              <h2 className="font-bold text-[--colors-secondary] tracking-widest text-sm mb-3">
                DEVELOPERS
              </h2>
              <nav className="list-none mb-10 leading-8">
                <ItemList content="Github" />
                <ItemList content="Documentation" />
                <ItemList content="Bug Bounty" />
                <ItemList content="Audits" />
                <ItemList content="Careers" />
              </nav>
            </div>
          </div>
          <div className="hidden md:flex w-64 md:mx-0 md:h-[250px] items-start md:justify-end lg:justify-center justify-start text-center md:text-left md:mt-0  order-first md:order-none mb-14 ">
            <h1 className="text-[--colors-secondary] text-3xl">
              <Link href={"/"}>
                <Image src="/svgs/logo.svg" width={110} height={40} alt="" />
              </Link>
            </h1>
          </div>

          <div className="md:hidden mb-5 container -order-2 md:order-none md:justify-between items-center py-3  md:py-10 flex md:flex-row md:flex-nowrap flex-wrap flex-col">
            <div className="mr-auto mt-5">
              <ChangeMode HWrapper={"50px"} WWrapper={"100px"} />
            </div>
            <div className="flex items-center gap-5 order-first md:order-none justify-between  w-full md:w-[45%] lg:w-[30%]">
              <div className="flex items-center gap-2">
                <Image src="/svgs/prx-logo.svg" width={30} height={30} alt="" />
                <p className="text-[#00CEEA] text-xl font-medium">$0.01</p>
              </div>
              <div className="text-[--colors-invertedContrast] flex w-[38%] md:w-[48%] px-2 items-center justify-center py-1 bg-[--colors-primary] rounded-full font-bold">
                <button className="text-xl">Buy PRX</button>
                <Icons.ArrowRight />
              </div>
            </div>
          </div>
        </div> */}
        <div className="mx-auto pb-3 md:pb-10 flex items-center flex-nowrap justify-between">
          <div className="hidden lg:flex items-center md:mx-0 mx-auto gap-5">
            <Icons.Twitter
              fill="var(--colors-contrast)"
              size={20}
              color="var(--colors-contrast)"
              cursor="pointer"
            />
            <Icons.Telegram
              fill="var(--colors-contrast)"
              color="var(--colors-contrast)"
            />
            <Icons.Reddit
              fill="var(--colors-contrast)"
              color="var(--colors-contrast)"
            />
            <Icons.Instagram
              color="var(--colors-contrast)"
              size={20}
              cursor="pointer"
            />
            <Icons.GithubIcon
              color="var(--colors-contrast)"
              fill="var(--colors-contrast)"
              size={20}
              cursor="pointer"
            />

            <Icons.YoutubeIcon
              fill="var(--colors-contrast)"
              color="var(--colors-contrast)"
            />

            <ChangeMode />
          </div>

          <div className="block lg:hidden">
            <ChangeMode />
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <div className="flex items-center gap-2">
              <Image src="/svgs/prx-logo.svg" width={30} height={30} alt="" />
              <p className="text-[--colors-primary] text-base md:text-xl font-medium">
                $0.01
              </p>
            </div>
            <div className="text-[--colors-invertedContrast] flex px-2 items-center justify-center py-1 bg-[--colors-primary] rounded-full font-bold">
              <button className="text-base">Buy PRX</button>
              {/* <Icons.ArrowRight /> */}
            </div>
          </div>
        </div>

        {/* {showElement && (
          <div
            className="fixed cursor-pointer right-[30px] bottom-[88px] md:right-[65px] md:bottom-[45px] flex w-[7%] sm:w-[5%] items-center justify-around bg-[--colors-primary] rounded-xl font-bold py-1 md:py-3 text-[--colors-invertedContrast]"
            onClick={() => {
              if (typeof window !== "undefined")
                window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <Icons.ArrowUp size={20} />
          </div>
        )} */}
      </div>
    </footer>
  );
}

const ItemList: React.FC<{ content: string; style?: React.CSSProperties }> = ({
  content,
  style,
}) => (
  <li className="relative group w-max cursor-pointer">
    <a
      style={{
        ...style,
        color: style ? "var(--colors-warning)" : "var(--colors-text)",
      }}
    >
      {content}
    </a>
    <span
      className={`absolute -bottom-[2px] left-0 w-0 transition-all h-1 ${
        style ? "bg-[--colors-warning]" : "bg-[--colors-secondary]"
      } rounded group-hover:w-full`}
    />
  </li>
);
