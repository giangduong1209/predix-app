"use client";
import React, { useEffect, useState } from "react";
import Button from "../ui/Button";
import { CONSTANTS, CURRENCY_UNIT } from "@/constants";
import Input from "../ui/Input";
import { formatInputField } from "@/utils/format-inputField";
import { useAccount, useWalletClient } from "wagmi";
import { publicClient } from "@/lib/contract-config";
import toast from "react-hot-toast";
import { changeBettedStatusHandler } from "@/redux/features/bet/betSlice";
import { getEllipsisTxt } from "@/utils/formmater-address";
import { Icons } from "../Icons";
import { ethers } from "ethers";

const MintNFTs = () => {
  const [quantity, setQuantity] = useState<number>(1);
  const { data: walletClient } = useWalletClient();
  const { address, isConnected } = useAccount();
  const [approveValue, setApproveValue] = useState<number>(0);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isApproveLoading, setIsApproveLoading] = useState<boolean>(false);

  // UseEffects

  useEffect(() => {
    setIsClient(true);
    if (isConnected && address) {
      getApprove();
    }
  }, [isConnected, address]);

  // Functions
  const getApprove = async () => {
    const data: any = await publicClient.readContract({
      address: CONSTANTS.ADDRESS.TOKEN,
      abi: CONSTANTS.ABI.TOKEN,
      functionName: "allowance",
      args: [address, CONSTANTS.ADDRESS.NFT],
    });

    setApproveValue(Number(ethers.formatEther(data.toString())));
  };

  const approveHandler = async () => {
    setIsApproveLoading(true);
    try {
      const { request: reqToken } = await publicClient.simulateContract({
        account: address,
        address: CONSTANTS.ADDRESS.TOKEN,
        abi: CONSTANTS.ABI.TOKEN,
        functionName: "approve",
        args: [
          CONSTANTS.ADDRESS.NFT,
          ethers.parseEther((quantity * 300).toString()),
        ],
      });
      if (reqToken) {
        const hash = await walletClient?.writeContract(reqToken);
        if (hash) {
          const transactionToken = await publicClient.waitForTransactionReceipt(
            {
              hash,
            }
          );
          if (transactionToken?.status === "success") {
            setIsApproveLoading(false);
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
                        Transaction Submitted!
                      </p>
                      <p className="mt-1 text-sm text-[--colors-text]">
                        Your transaction has been sent!
                      </p>
                      {/* <a
                            href={`https://testnet.bscscan.com/tx/${transaction.transactionHash}`}
                            className="mt-1 text-sm text-[--colors-primary]"
                            target="_blank"
                          >
                            View on BscScan:{" "}
                            {getEllipsisTxt(transaction.transactionHash)}
                          </a> */}
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
            getApprove();
          }
          if (transactionToken.status === "reverted") {
            setIsApproveLoading(false);
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
                        Transaction did not submit!
                      </p>
                      <p className="mt-1 text-sm text-[--colors-text]">
                        Your transaction has not been sent!
                      </p>
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
      setIsApproveLoading(false);
      console.log(error);
    }
  };

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const { request } = await publicClient.simulateContract({
        account: address,
        address: CONSTANTS.ADDRESS.NFT,
        abi: CONSTANTS.ABI.NFT,
        functionName: "mint",
        args: [address, quantity],
      });
      if (request) {
        const hash = await walletClient?.writeContract(request);

        if (hash) {
          const transaction = await publicClient.waitForTransactionReceipt({
            hash,
          });
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
                      Transaction Submitted!
                    </p>
                    <p className="mt-1 text-sm text-[--colors-text]">
                      Your transaction has been sent!
                    </p>
                    {/* <a
                          href={`https://testnet.bscscan.com/tx/${transaction.transactionHash}`}
                          className="mt-1 text-sm text-[--colors-primary]"
                          target="_blank"
                        >
                          View on BscScan:{" "}
                          {getEllipsisTxt(transaction.transactionHash)}
                        </a> */}
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

          if (transaction?.status === "success") {
            setIsLoading(false);

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
                        Mint is successfull!
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
            setIsLoading(false);
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
                        Mint is failed!
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
      setIsLoading(false);
      console.log(error);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setQuantity(+value);
  };

  const updateQuantity = (operator: string) => {
    if (operator === "+") {
      setQuantity((prevQuantity) => prevQuantity + 1);
    } else if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    } else {
      setQuantity(1);
    }
  };

  return (
    <div className="metaportal_fn_mintbox">
      <div className="mint_right">
        {/* <Card
            hoverable
            cover={
              <Image
                className="imageBox"
                width={600}
                height={425}
                alt="example"
                src="/manahubs-box.gif"
              />
            }
          /> */}
      </div>
      <div className="mint_left">
        <div className="mint_title">
          <span>Public Mint is Live</span>
        </div>
        <div className="mint_list">
          <ul>
            <li>
              <div className="item">
                <h4>Price</h4>
                <div className="text-2xl flex justify-between">
                  <span>{CONSTANTS.COLLECTIONS?.statistics.floorPrice}</span>
                  <span>{CURRENCY_UNIT}</span>
                  {/* <select style={{ border: "none" }} onChange={selectCurrent}>
                        <option value="BNB">BNB</option>
                        <option value="BUSD">BUSD</option>
                        <option value="USDT">USDT</option>
                      </select> */}
                </div>
              </div>
            </li>
            <li>
              <div className="item">
                <h4>Remaining</h4>
                <h3>{CONSTANTS.COLLECTIONS?.statistics?.totalItems}</h3>
              </div>
            </li>
            <li>
              <div className="item">
                <h4>Quantity</h4>
                <div className="flex items-center">
                  <span
                    className="decrease cursor-pointer"
                    onClick={() => updateQuantity("-")}
                  >
                    -
                  </span>
                  <Input
                    min={0}
                    placeholder="0.0"
                    onKeyDown={formatInputField}
                    onChange={handleChange}
                    className="mx-4 text-right px-2"
                    value={quantity}
                  />

                  <span
                    className="increase cursor-pointer"
                    onClick={() => updateQuantity("+")}
                  >
                    +
                  </span>
                </div>
              </div>
            </li>
            <li>
              <div className="item">
                <h4>Total Price</h4>
                <h3>
                  <span className="total_price">
                    {(
                      (CONSTANTS.COLLECTIONS?.statistics
                        ? +CONSTANTS.COLLECTIONS.statistics.floorPrice
                        : 0) * quantity
                    ).toFixed(2)}
                  </span>
                  <span> {CURRENCY_UNIT} + GAS</span>
                </h3>
              </div>
            </li>
          </ul>
        </div>
        <div
          className="mint_desc"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          {isClient &&
            (!isConnected ? (
              <Button
                className="w-full md:w-1/2 bg-[--colors-primary] text-[--colors-white] hover:bg-[--colors-primary] hover:opacity-[0.8] rounded-2xl"
                type="button"
                disabled
              >
                Please Connect Wallet
              </Button>
            ) : approveValue < quantity * 300 ? (
              <Button
                className="w-full md:w-1/2 bg-[--colors-primary] text-[--colors-white] hover:bg-[--colors-primary] hover:opacity-[0.8] rounded-2xl"
                type="button"
                disabled={isApproveLoading}
                onClick={approveHandler}
                isLoading={isApproveLoading}
              >
                Approve
              </Button>
            ) : (
              <Button
                className="w-full md:w-1/2 bg-[--colors-primary] text-[--colors-white] hover:bg-[--colors-primary] hover:opacity-[0.8] rounded-2xl"
                type="button"
                disabled={isLoading}
                onClick={handleClick}
                isLoading={isLoading}
              >
                Unbox
              </Button>
            ))}

          <p
            style={{ marginTop: "0", marginLeft: "20px" }}
            className="text-[--colors-textSub]"
          >
            By clicking UNBOX button, you agree to our{" "}
            <a href="#">Terms of Service</a> and our{" "}
            <a href="#">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MintNFTs;
