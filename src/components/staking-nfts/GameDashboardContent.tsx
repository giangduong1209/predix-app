"use client";
import React, { useEffect, useState } from "react";
import Button from "../ui/Button";
import LayoutItemContent from "./LayoutItemContent";
import { ethers } from "ethers";
import { CONSTANTS } from "@/constants";
import { useAccount } from "wagmi";
import axios from "axios";

export interface metadata {
  name: string;
  description: string;
  image: string;
  dna: string;
  edition: number;
  date?: number;
}
import ListNFTs from "./ListNFTs";

interface IGameDashboardContent {
  isShowListNFTsMobile: boolean;
}

const GameDashboardContent: React.FC<IGameDashboardContent> = ({
  isShowListNFTsMobile,
}) => {
  const [reward, setReward] = useState<string>("0.0");
  const { address } = useAccount();

  const [NFTs, setNFTs] = useState<metadata[]>([]);
  const nftContract = new ethers.Contract(
    CONSTANTS.ADDRESS.NFT,
    CONSTANTS.ABI.NFT,
    CONSTANTS.PROVIDER
  );

  const getNFTs = async () => {
    // if (!isConnected || !address) {
    if (false) {
      setNFTs([]);
    } else {
      const balanceOfUser = await nftContract.walletOfOwner(address);

      for (const tokenId of balanceOfUser) {
        // const tokenId = await nftContract.tokenOfOwnerByIndex(address, i);
        let tokenURI = (await nftContract.tokenURI(tokenId)).toString();

        // if (gatewayTools.containsCID(tokenURI).containsCid) {
        //   tokenURI = gatewayTools.convertToDesiredGateway(
        //     tokenURI,
        //     Constants.GATEWAY
        //   );
        // }
        try {
          const response = await axios.get<metadata>(
            tokenURI.replace("ipfs://", "https://myipfs.mypinata.cloud/ipfs/")
          );

          if (response) {
            // ipfs://[CID]/1.png

            const metadata: metadata = response.data;

            const imageUrl = metadata.image.replace(
              "ipfs://",
              "https://myipfs.mypinata.cloud/ipfs/"
            );

            const item: metadata = {
              date: metadata.date,
              image: imageUrl,
              description: metadata.description,
              edition: tokenId,
              dna: metadata.dna,
              name: metadata.name,
            };
            console.log(item);

            setNFTs((nfts) => [...nfts, item]);
          }
        } catch (error) {
          const item: metadata = {
            date: 1660416694432,
            image:
              "https://myipfs.mypinata.cloud/ipfs/bafybeicf2k4yqwp2kunqyn75v232wu6htvghjuwrg7qi2fbat6uw65wfqe/2111.png",
            description:
              "This is the NFT collection of the Manahubs Marketplace named - Guardians of the Galaxy",
            edition: tokenId,
            dna: "affd711ec5a942796ae44e2326a1eeb2a99131f8",
            name: `Guardians of the Galaxy #${tokenId}`,
          };

          setNFTs((nfts) => [...nfts, item]);
        }
      }
    }
  };

  useEffect(() => {
    getNFTs();
  }, [address]);

  const claimReward = () => {};

  const renderContent = () => {
    if (isShowListNFTsMobile)
      return (
        <div className="block md:hidden">
          <ListNFTs />
        </div>
      );

    return (
      <div className="flex flex-wrap max-h-[656px] overflow-y-auto pt-3 gap-2">
        {Array(3)
          .fill(0)
          .map((item, index) => (
            <LayoutItemContent
              key={index}
              // image={item.image}
              // description={item.description}
              // title={item.title}
              // dna={item.dna}
              // date={item.date}
              // tokenId={item.tokenId}
            />
          ))}
      </div>
    );
  };

  return (
    <div className="md:px-24 md:grow md:pt-10">
      <div className="hidden md:block text-4xl text-[--colors-textSub] font-bold">
        Staking
      </div>
      <div>
        <div className="flex items-center justify-center text-[--colors-textSub] gap-2 mt-2">
          <div className="flex-1">
            <p>Total Rewards</p>
            <div className="flex items-center justify-center h-10 bg-black rounded-xl text-white">
              {reward ? reward : 0.0}
            </div>
          </div>
          <div className="flex-1">
            <p>Daily NFTs Staking</p>
            <Button
              disabled={+reward <= 0}
              className="w-full"
              onClick={() => claimReward()}
            >
              Claim
            </Button>
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

export default GameDashboardContent;
