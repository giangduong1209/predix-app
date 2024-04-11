import React from "react";

const TokenStake = () => {
  return (
    <div className="col-span-2 p-3 rounded-md border-2 border-[--colors-secondary]">
      <div className="border border-gray-700 rounded-md p-5">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <div className="border rounded-full p-[7px]">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
                height="16"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"></path>
              </svg>
            </div>
            <span className="border rounded p-1">Half</span>
            <span className="border rounded p-1">Max</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 24 24"
              height="16"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path d="M18 4H6C3.79 4 2 5.79 2 8v8c0 2.21 1.79 4 4 4h12c2.21 0 4-1.79 4-4V8c0-2.21-1.79-4-4-4zm-1.86 9.77c-.24.2-.57.28-.88.2L4.15 11.25C4.45 10.52 5.16 10 6 10h12c.67 0 1.26.34 1.63.84l-3.49 2.93zM6 6h12c1.1 0 2 .9 2 2v.55c-.59-.34-1.27-.55-2-.55H6c-.73 0-1.41.21-2 .55V8c0-1.1.9-2 2-2z"></path>
            </svg>
            0.00
          </div>
        </div>
        <div className="my-5 flex justify-between items-center">
          <span className="text-2xl font-bold">250</span>
          <span>Sakai</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Pay:$132.1038</span>
          <span>Stake: 250.0</span>
        </div>
      </div>
      <div className="bg-green-500 rounded-lg py-2 text-xl text-center font-bold my-10">
        <button>Stake</button>
      </div>
      <div>
        <div className="flex justify-between">
          <span>Wallet balance:</span>
          <span>40000 $SAKAI</span>
        </div>
        <div className="flex justify-between">
          <span>Staked balance:</span>
          <span>40000 $SAKAI</span>
        </div>
        <div className="flex justify-between">
          <span>Total balance:</span>
          <span>40000 $SAKAI</span>
        </div>
        <div className="flex justify-between">
          <span>Your Claimed Rewards:</span>
          <span>40000 $SAKAI</span>
        </div>
      </div>
      <div className="my-10 border rounded-xl p-5 flex items-center justify-between">
        <span>Claimable Est.: 0.00</span>
        <span>SAKAI</span>
      </div>
      <div className="bg-green-500 rounded-lg py-2 text-xl text-center font-bold my-10">
        <button>CLAIM</button>
      </div>
    </div>
  );
};

export default TokenStake;
