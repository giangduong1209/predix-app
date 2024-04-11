"use client";
import React, { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Button from "./ui/Button";
import getDataFileredByOnSnapshot from "@/helpers/getDataFilteredByOnSnapshot";
import { useAccount } from "wagmi";
import { DocumentData } from "firebase/firestore";
import { isEmpty } from "lodash";
import { publicClient } from "@/lib/contract-config";
import { CONSTANTS, CURRENCY_UNIT } from "@/constants";
import { ethers } from "ethers";
import { Icons } from "./Icons";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";

const ConnectWallet = () => {
  const { isConnected, address } = useAccount();
  const [usersInfo, setUserInfo] = useState<DocumentData[]>([]);
  const [balance, setBalance] = useState<number>(0);

  const { bettedStatus } = useAppSelector(
    (state: RootState) => state.betReducer
  );

  useEffect(() => {
    if (isConnected && address && bettedStatus) {
      getDataFileredByOnSnapshot(
        "users",
        [["user_address", "==", address]],
        (docs) => {
          setUserInfo(docs as DocumentData[]);
        }
      );
      getBalance();
    }
  }, [isConnected, address, bettedStatus]);

  const getBalance = async () => {
    const data: any = await publicClient.readContract({
      address: CONSTANTS.ADDRESS.TOKEN,
      abi: CONSTANTS.ABI.TOKEN,
      functionName: "balanceOf",
      args: [address],
    });
    if (data) {
      setBalance(Number(ethers.formatEther(data.toString())));
    }
  };

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    variant="success"
                    onClick={openConnectModal}
                    type="button"
                  >
                    Connect Wallet
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button
                    variant="error"
                    onClick={openChainModal}
                    type="button"
                  >
                    Wrong network
                  </Button>
                );
              }

              return (
                <div style={{ display: "flex", gap: 12 }}>
                  {/* {chain.iconUrl && (
                    <Image
                      alt={chain.name ?? "Chain icon"}
                      src={chain.iconUrl}
                      width={12}
                      height={12}
                    />
                  )} */}
                  <Button onClick={openAccountModal} type="button">
                    <Icons.AvatarUser className="mr-2" />
                    {!isEmpty(usersInfo)
                      ? usersInfo?.[0]?.nickname
                      : account.displayName}
                    {balance
                      ? ` (${(+balance.toFixed(2)).toLocaleString(
                          "en-US"
                        )} ${CURRENCY_UNIT})`
                      : ` (0 ${CURRENCY_UNIT})`}

                    {}
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default ConnectWallet;
