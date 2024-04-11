"use client";
import React, { useEffect, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import getDataFileredByOnSnapshot from "@/helpers/getDataFilteredByOnSnapshot";
import { DocumentData } from "firebase/firestore";
import { ethers } from "ethers";
import { toFixedEtherNumber } from "@/utils/format-number";
import Button from "../ui/Button";
import { CONSTANTS, CURRENCY_UNIT } from "@/constants";
import { publicClient } from "@/lib/contract-config";
import toast from "react-hot-toast";
import { Icons } from "../Icons";
import { getEllipsisTxt } from "@/utils/formmater-address";

const InfoReferral = () => {
  const { isConnected, address } = useAccount();
  const [userCommission, setUserCommission] = useState<DocumentData[]>([]);
  const [point, setPoint] = useState<number>(0);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [isClaimCommisionLoading, setIsClaimCommisionLoading] =
    useState<boolean>(false);
  const { data: walletClient } = useWalletClient();

  useEffect(() => {
    setIsClient(true);
    if (isConnected && address) {
      getDataFileredByOnSnapshot(
        "users",
        [["user_address", "==", address as `0x${string}`]],
        (docs) => {
          setUserCommission(docs as DocumentData[]);
          setPoint(docs?.[0]?.point);
        }
      );
    } else {
      setUserCommission([]);
      setPoint(0);
    }
  }, [isConnected, address]);

  const claimCommisionHandler = async () => {
    setIsClaimCommisionLoading(true);
    const point = userCommission?.[0]?.point
      ? BigInt(userCommission?.[0]?.point)
      : 0;
    const signer = new ethers.Wallet(
      process.env.NEXT_PUBLIC_OWNER_PRIVATE_KEY!,
      CONSTANTS.PROVIDER
    );
    let message = ethers.solidityPacked(["uint256"], [point]);
    message = ethers.solidityPackedKeccak256(["bytes"], [message]);
    try {
      const signature = await signer.signMessage(ethers.getBytes(message));

      const { request } = await publicClient.simulateContract({
        account: address,
        address: CONSTANTS.ADDRESS.PREDICTION,
        abi: CONSTANTS.ABI.PREDICTION,
        functionName: "claimCommission",
        args: [point, signature],
      });
      if (request) {
        const hash = await walletClient?.writeContract(request);

        if (hash) {
          const transaction = await publicClient.waitForTransactionReceipt({
            hash,
          });

          if (transaction?.status === "success") {
            setIsClaimCommisionLoading(false);
            toast.custom((t) => (
              <div
                className={`${
                  t.visible ? "animate-enter" : "animate-leave"
                } max-w-md w-full bg-[--colors-backgroundAlt] shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
              >
                <div className="flex bg-[--colors-success] p-4 rounded-l-lg">
                  <Icons.CheckCircle className="text-[--colors-white]" />
                </div>
                <div className="flex-1 w-0 p-2">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5"></div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-[--colors-text]">
                        Success!
                      </p>
                      <p className="mt-1 text-sm text-[--colors-text]">
                        Token {CURRENCY_UNIT} has been sent to your wallet!
                      </p>
                      <a
                        href={`https://testnet.bscscan.com/tx/${transaction.transactionHash}`}
                        className="mt-1 text-sm text-[--colors-primary]"
                        target="_blank"
                      >
                        View on BscScan:{" "}
                        {getEllipsisTxt(transaction.transactionHash)}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="flex">
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-start justify-end text-sm font-medium focus:outline-none"
                  >
                    <Icons.X className="text-[--colors-primary]" />
                  </button>
                </div>
              </div>
            ));
          }
          if (transaction?.status === "reverted") {
            setIsClaimCommisionLoading(false);
            toast.custom((t) => (
              <div
                className={`${
                  t.visible ? "animate-enter" : "animate-leave"
                } max-w-md w-full bg-[--colors-backgroundAlt] shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
              >
                <div className="flex bg-[--colors-failure] p-4 rounded-l-lg">
                  <Icons.XCircle className="text-[--colors-white]" />
                </div>
                <div className="flex-1 w-0 p-2">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5"></div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-[--colors-text]">
                        Error!
                      </p>
                      <p className="mt-1 text-sm text-[--colors-text]">
                        Claim failed!
                      </p>
                      <a
                        href={`https://testnet.bscscan.com/tx/${transaction.transactionHash}`}
                        className="mt-1 text-sm text-[--colors-failure]"
                        target="_blank"
                      >
                        View on BscScan:{" "}
                        {getEllipsisTxt(transaction.transactionHash)}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="flex">
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-start justify-end text-sm font-medium focus:outline-none"
                  >
                    <Icons.X className="text-[--colors-primary]" />
                  </button>
                </div>
              </div>
            ));
          }
        }
      }
    } catch (error) {
      setIsClaimCommisionLoading(false);
      console.log(error);
    }
  };

  return (
    <>
      <div className="gap-5 items-center flex text-[--colors-text] my-5 flex-col md:flex-row">
        {/* <div className="border-2 border-[--colors-secondary] rounded-xl w-full md:w-[225px] h-[40px] flex justify-between p-5 items-center">
        <span>Level</span>
        <Icons.MedalIcon />
      </div>
      <div className="border-2 border-[--colors-secondary] rounded-xl w-full md:w-[225px] h-[40px] flex justify-between p-5 items-center">
        <span>Deposit Amount</span>
        <span>$00.00</span>
      </div>
      <div className="border-2 border-[--colors-secondary] rounded-xl w-full md:w-[225px] h-[40px] flex justify-between p-5 items-center">
        <span>Direct Referrals</span>
        <div className="flex items-center gap-2 ">
          <span>0</span>
          <Icons.UserIcon />
        </div>
      </div> */}
        <div className="border-2 border-[--colors-secondary] rounded-xl w-full md:max-w-[320px] h-[40px] flex justify-between p-5 items-center">
          <span>Total Referrals</span>
          <span>
            {userCommission?.[0]?.point
              ? toFixedEtherNumber(
                  ethers.formatEther(BigInt(userCommission?.[0]?.point)),
                  4
                )
              : 0}{" "}
            {CURRENCY_UNIT}
          </span>
        </div>

        {isClient &&
          (isConnected && userCommission?.[0]?.point !== "undefined" ? (
            <Button
              variant="success"
              onClick={claimCommisionHandler}
              className="w-full lg:max-w-[200px]"
              isLoading={isClaimCommisionLoading}
              disabled={point <= 0}
            >
              Claim
            </Button>
          ) : (
            <Button
              className="w-full lg:max-w-[200px]"
              variant="success"
              disabled={true}
            >
              Please connect wallet
            </Button>
          ))}
      </div>
    </>
  );
};

export default InfoReferral;
