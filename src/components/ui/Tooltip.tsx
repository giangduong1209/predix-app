import React from "react";

const TooltipElement: React.FC<{
  title?: React.ReactNode | string;
  classNameText?: string;
  children?: React.ReactNode;
}> = ({ title, classNameText, children }) => (
  <div className="group max-w-max relative mx-1 flex flex-col items-center justify-center rounded-full">
    <p className={`text-xs text-center py-[1px] px-[5px] ${classNameText}`}>
      {children}
    </p>
    <div className="[transform:perspective(50px)_translateZ(0)_rotateX(10deg)] group-hover:[transform:perspective(0px)_translateZ(0)_rotateX(0deg)] absolute bottom-0 mb-6 origin-bottom  rounded text-white opacity-0 transition-all duration-300 group-hover:opacity-100">
      <div className="flex max-w-lg flex-col items-center">
        <div className="rounded bg-[--colors-tertiary] text-[--colors-text-special] p-2 text-xs text-center shadow-lg">
          {title}
        </div>
        <div
          className=" h-2 w-4 bg-[--colors-tertiary]"
          style={{
            clipPath: "polygon(100% 50%, 0 0, 100% 0, 50% 100%, 0 0)",
          }}
        />
      </div>
    </div>
  </div>
);

export default TooltipElement;
