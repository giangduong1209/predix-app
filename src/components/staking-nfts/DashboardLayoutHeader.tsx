import React from "react";
import Button from "../ui/Button";
import { Icons } from "../Icons";

interface IDashboardLayoutHeader {
  onActionHeader: () => void;
}

const DashboardLayoutHeader: React.FC<IDashboardLayoutHeader> = ({
  onActionHeader,
}) => {
  return (
    <div className="bg-[#222] flex text-white py-4 px-3">
      <div className="flex flex-1 flex-col justify-center text-xs mr-3">
        <p>$USD Balance</p>
        <div className="flex justify-center items-center text-black bg-white rounded-md h-7 font-bold"></div>
      </div>
      <div className="flex flex-1 flex-col justify-center text-xs mr-3 md:mr-0">
        <p>My Total NFTs</p>
        <div className="flex justify-center items-center text-black bg-white rounded-md h-7 font-bold">
          0
        </div>
      </div>

      <div
        className="flex flex-1 flex-col justify-center text-xs md:hidden"
        style={{ flex: 0 }}
      >
        <p className="opacity-0">a</p>
        <Button
          className="h-7 w-8 bg-white text-black px-2 py-1 focus:bg-white hover:bg-white "
          onClick={onActionHeader}
        >
          <Icons.MenuIcon />
        </Button>
      </div>
    </div>
  );
};

export default DashboardLayoutHeader;
