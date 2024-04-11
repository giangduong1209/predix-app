import React from "react";

import ListNFTs from "./ListNFTs";
import DashboardLayoutHeader from "./DashboardLayoutHeader";

interface IDashboardLayout {
  onActionHeader: () => void;
}

const DashboardLayout: React.FC<IDashboardLayout> = ({ onActionHeader }) => {
  return (
    <div className="md:shrink-0 md:w-[400px] bg-[#333]">
      <DashboardLayoutHeader onActionHeader={onActionHeader} />

      <div className="hidden md:block">
        <ListNFTs />
      </div>
    </div>
  );
};

export default DashboardLayout;
