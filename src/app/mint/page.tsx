import React from "react";
import MintNFTs from "@/components/mint-nfts/MintNFTs";
import { CONSTANTS } from "@/constants";
import Image from "next/image";

const Mint = () => {
  return (
    <div className="bg-[--colors-background]">
      <div className="container mx-auto px-4 pb-44">
        <div className="metaportal_fn_mint_top">
          <h3
            className="fn__maintitle text-[--colors-textSub] md:hidden"
            data-text={CONSTANTS.COLLECTIONS?.title}
            data-align="left"
          >
            {CONSTANTS.COLLECTIONS.title}
          </h3>
          <div className="flex flex-col md:flex-row">
            <div className="mint_left">
              <div className="img">
                <div
                  className="img_in"
                  //   style={{ backgroundImage: `url(${colection?.banner})` }}
                >
                  <Image
                    width={100}
                    height={100}
                    src={CONSTANTS.COLLECTIONS.banner}
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className="mint_right text-[--colors-textSub]">
              <h3
                className="fn__maintitle hidden md:block"
                data-text={CONSTANTS.COLLECTIONS?.title}
                data-align="left"
              >
                {CONSTANTS.COLLECTIONS.title}
              </h3>
              <div className="desc">
                <p>{CONSTANTS.COLLECTIONS.description}</p>
                {/* <p>
                A 1% NFT transaction fee will be collected; this fee comes from
                NFT trading and transfer activities between e-wallets.
              </p> */}
              </div>
            </div>
          </div>
        </div>

        <MintNFTs />
      </div>
    </div>
  );
};

export default Mint;
