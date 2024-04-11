import TokenFaucet from "@/components/token-faucet/TokenFaucet";
import React from "react";

const Faucet = () => {
  return (
    <div className="container mx-auto px-4 min-h-[65vh] md:min-h-screen">
      <TokenFaucet />
    </div>
  );
};

export default Faucet;
