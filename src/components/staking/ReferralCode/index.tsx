import React from "react";

const ReferralCode = () => {
  return (
    <div className="p-3 rounded-md border-2 border-[--colors-secondary]">
      <div className="p-5 border rounded-xl text-center text-3xl">
        <span>400000</span>
      </div>
      <div className="p-2 my-5 border rounded-xl flex justify-between items-center">
        <span>google.com</span>
        <button className="p-2 border rounded">Coppy</button>
      </div>
      <div>
        <div className="flex justify-between">
          <span>Total Sponsor Count:</span>
          <span>0</span>
        </div>
        <div className="flex justify-between">
          <span>Direct Sponsor Count:</span>
          <span>0</span>
        </div>
        <div className="flex justify-between">
          <span>Deposit Amount:</span>
          <span>0</span>
        </div>
        <div className="flex justify-between">
          <span>Total Group:</span>
          <span>0</span>
        </div>
      </div>
    </div>
  );
};

export default ReferralCode;
