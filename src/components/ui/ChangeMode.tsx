import React from "react";
import { motion } from "framer-motion";
import { Icons } from "../Icons";
import { useTheme } from "@/context/change-mode";

interface IChangeModeProps {
  HWrapper?: string | number;
  WWrapper?: string | number;
  H?: string | number;
  W?: string | number;
}

const ChangeMode: React.FC<IChangeModeProps> = (props) => {
  const { H, HWrapper, W, WWrapper } = props;
  const { isOn, toggleSwitch } = useTheme();

  const spring = {
    type: "spring",
    stiffness: 700,
    damping: 30,
  };

  return (
    <div
      onClick={toggleSwitch}
      style={{ height: HWrapper ?? "40px", width: WWrapper ?? "70px" }}
      className={`transition-colors duration-500 flex-start flex  rounded-[50px] ${
        isOn ? "bg-yellow-300" : "bg-black/90"
      } p-[5px] shadow-inner hover:cursor-pointer  ${
        isOn && "place-content-end"
      }`}
      data-toggle-theme="dark,light"
    >
      <motion.div
        style={{ height: H ?? "30px", width: W ?? "30px" }}
        className={`flex
        }] items-center justify-center rounded-full ${
          isOn ? "bg-yellow-500" : "bg-gray-800"
        }`}
        layout
        transition={{ ...spring }}
        whileTap={{ rotate: 360 }}
      >
        <div>
          {isOn ? (
            <Icons.SunDim color="white" />
          ) : (
            <Icons.MoonStar color="white" />
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ChangeMode;
