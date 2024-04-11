import React, { FC } from "react";

import Image from "next/image";
import { metadata } from "./ListNFTs";

const LayoutItem: FC<metadata> = ({ image, name, edition, description }) => {
  return (
    <div className="flex rounded-[10px] h-[200px] py-5 px-[10px] text-[#fff] relative mb-2 bg-[#ffb800]">
      <Image
        alt=""
        width={120}
        height={120}
        src={image}
        loading="lazy"
        className="rounded-md object-cover"
      />
      <div
        className="flex justify-center items-center w-full px-[10px] "
        style={{ flexDirection: "column" }}
      >
        <p className="text-sm"> {name}</p>
        <p className="text-[10px] leading-3 whitespace-normal overflow-hidden mb-3">
          {description}
        </p>
        <div className="w-full flex justify-center items-center gap-1">
          <button
            className="h-7 rounded font-bold text-xs pt-0 pb-0 w-full bg-white text-green-700 border-[1px] border-solid border-[#36a920] mb-[5px] mt-auto hover:text-white hover:bg-green-700"
            // loading={loadingStaking}
            // onClick={() => staking()}
            // block
          >
            Start Staking
          </button>
          <button
            className="h-7 rounded font-bold text-xs pt-0 pb-0 w-full bg-white text-green-700 border-[1px] border-solid border-[#36a920] mb-[5px] mt-auto hover:text-white hover:bg-green-700"
            // loading={loadingStaking}
            // onClick={handleTransferClick}
            // block
          >
            Transfer
          </button>
        </div>
      </div>
      {/* <Modal
        title={`Transfer NFT`}
        visible={visibleTransferModal}
        onCancel={() => setVisibilityTransferModal(false)}
        onOk={() => transfer(receiver)}
        confirmLoading={isPending}
        okText="Send"
      >
        <Input autoFocus placeholder="Receiver" onChange={changeAddHandler} />
      </Modal> */}
    </div>
  );
};

export default LayoutItem;
