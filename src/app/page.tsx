"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";
import SliderBannerGame from "@/components/sliderBannerGame";

export default function Home() {
  return (
    <main className="bg-[--colors-background] overflow-hidden">
      {/* <SliderBannerGame /> */}

      <div className="px-4 flex flex-col items-center lg:flex-row justify-between md:px-28 pb-3">
        <div className="flex flex-col gap-3 md:gap-10 w-full lg:w-1/2">
          <h1 className="text-[#28C38B] text-3xl md:text-6xl font-semibold">
            Unlimited & Advanced Defi Playground
          </h1>
          <p className="mt-[10px] mb-5 text-sm md:text-2xl text-[--colors-textSub]">
            Powered by Blockchain technology, giving users transparency and
            fairness to deliver thrilling and enjoyable experiences
          </p>
          <div className="flex gap-2 items-center">
            <Button
              variant="success"
              className="rounded-full px-9 hover:opacity-90"
            >
              Categories
            </Button>
            <Button
              variant="success"
              className="bg-[--colors-white] rounded-full border-2 border-[--colors-primary] text-[--colors-primary] px-9 hover:text-[--colors-white] hover:opacity-1"
            >
              Roadmap
            </Button>
          </div>
        </div>

        <div className="w-full lg:w-1/2">
          <Image
            src="/images/banners/PRX_herobanner-01 1.png"
            width={680}
            height={800}
            alt="banner hero"
            className="!w-full"
          />
        </div>
      </div>
    </main>
  );
}
