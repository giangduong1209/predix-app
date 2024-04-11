import InfoReferral from "@/components/referrals/InfoReferral";
import ReferralTree from "@/components/referrals/ReferralTree";
import ReferralTreeBackup from "@/components/referrals/ReferralTreeBackup";
import WalletUser from "@/components/referrals/WalletUser";
import React from "react";

const Referrals = () => {
  return (
    <main className="w-full min-h-[90vh] bg-[--colors-background]">
      <div className="p-6">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="text-5xl font-semibold text-[--colors-secondary] md:text-6xl">
            Referrals
          </h1>
        </div>
      </div>
      <div className="bg-[--colors-background] p-6">
        <div className="max-w-[1200px] mx-auto">
          <WalletUser />
          <InfoReferral />
          {/* <ReferralTree /> */}
          <ReferralTreeBackup />
        </div>
      </div>
    </main>
  );
};

export default Referrals;
