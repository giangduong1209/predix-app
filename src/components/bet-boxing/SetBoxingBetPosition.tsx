"use client";
import React, { useEffect, useState } from "react";
import { formatInputField } from "@/utils/format-inputField";
import { nanoid } from "nanoid";
import { Icons } from "../Icons";
import { isEmpty } from "lodash";
import { CONSTANTS, CURRENCY_UNIT } from "@/constants";
import { toast } from "react-hot-toast";
import { useAccount, useWalletClient } from "wagmi";
import { ethers } from "ethers";
import { publicClient } from "@/lib/contract-config";
import { getEllipsisTxt } from "@/utils/formmater-address";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  changeBettedStatusHandler,
  resetState,
} from "@/redux/features/bet/betSlice";
import Button from "../ui/Button";
import { RootState } from "@/redux/store";

interface ISetBoxingBetPositionProps {
  showSetBetCard?: boolean;
  elonOrMarkStatus?: string;
  onEnterElonOrMark?: (status: string) => void;
  onBackward?: (status: boolean) => void;
  currentRound: string;
  onPlacedBet?: (status: boolean) => void;
  inputRef?: React.MutableRefObject<HTMLInputElement | null>;
}

const SetBetBoxingPosition: React.FC<ISetBoxingBetPositionProps> = ({
  showSetBetCard,
  elonOrMarkStatus,
  onEnterElonOrMark,
  onBackward,
  currentRound,
  onPlacedBet,
  inputRef,
}) => {
  const { isConnected, address } = useAccount();
  const dispatch = useAppDispatch();
  const { bettedStatus } = useAppSelector(
    (state: RootState) => state.betReducer
  );
  const { data: walletClient } = useWalletClient();
  // Fix hydrate by using isClient
  const [isClient, setIsClient] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>("");
  const [balance, setBalance] = useState<number>(0);
  const [percentage, setPercentage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isApproveLoading, setIsApproveLoading] = useState<boolean>(false);
  const [approveValue, setApproveValue] = useState<number>(0);

  useEffect(() => {
    if (elonOrMarkStatus !== "") inputRef?.current?.focus();
  }, [inputRef, elonOrMarkStatus]);

  useEffect(() => {
    setIsClient(true);
    if (isConnected && address && currentRound && bettedStatus) {
      getApprove();
      getBalance();
      dispatch(resetState());
    }
  }, [isConnected, address, bettedStatus, currentRound, dispatch]);

  const getApprove = async () => {
    const data: any = await publicClient.readContract({
      address: CONSTANTS.ADDRESS.TOKEN,
      abi: CONSTANTS.ABI.TOKEN,
      functionName: "allowance",
      args: [address, CONSTANTS.ADDRESS.MARKET],
    });

    setApproveValue(Number(ethers.formatEther(data.toString())));
  };

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

  const changeElonOrMarkHandler = (status: string) => {
    if (onEnterElonOrMark) return onEnterElonOrMark(status);
  };

  const backwardHandler = () => {
    if (onBackward) return onBackward(false);
  };

  const changeAmountHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    const percentage = ((+value * 100) / +balance!).toFixed(2);
    setPercentage(+percentage);
    setAmount(value);
  };

  const changePercentageHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const {
      target: { value },
    } = event;

    const amountModified = ((+balance! * +value) / 100).toString();

    setPercentage(+value);
    setAmount(amountModified);
  };

  const validatorInputField = () => {
    let errorMessage = "";
    if (+amount < CONSTANTS.AMOUNT_REQUIRED && !isEmpty(amount))
      return (errorMessage = `A minimum amount of ${CONSTANTS.AMOUNT_REQUIRED} ${CURRENCY_UNIT} is required`);
    if (+balance! < +amount)
      return (errorMessage = `Insufficient ${CURRENCY_UNIT} balance`);
    return errorMessage;
  };

  const choosePercentageAmountHandler = (value: number) => {
    const amountModified = ((+balance! * value) / 100).toString();
    setPercentage(value);
    setAmount(amountModified);
  };

  const buttonName = () => {
    let name = "Approve";

    if (+balance! < +amount || balance! === 0)
      return (name = `Insufficient ${CURRENCY_UNIT} balance`);

    if (Number(amount) === 0 || +amount < CONSTANTS.AMOUNT_REQUIRED)
      return (name = "Enter an amount");
    return name;
  };

  const activeButton = () => {
    let inActive = true;
    if (+amount < +balance!) inActive = false;
    if (+amount === 0 || +amount < CONSTANTS.AMOUNT_REQUIRED) inActive = true;
    return inActive;
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
          CONSTANTS.ADDRESS.MARKET,
          ethers.parseEther((+amount + 1).toString()),
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

  const chooseQuickAmountHandler = (amount: number) => {
    const percentage = ((+amount! * 100) / balance).toFixed(2);
    setPercentage(+percentage);
    setAmount(amount.toString());
  };

  const placeBetHandler = async () => {
    setIsLoading(true);
    try {
      // betBull is Bet up

      if (elonOrMarkStatus === "ELON") {
        const { request } = await publicClient.simulateContract({
          account: address,
          address: CONSTANTS.ADDRESS.MARKET,
          abi: CONSTANTS.ABI.MARKET,
          functionName: "betBull",
          args: [currentRound, ethers.parseUnits(amount, "ether")],
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
                          {elonOrMarkStatus} position entered
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
              dispatch(changeBettedStatusHandler("Boxing Betted"));
              if (onPlacedBet) onPlacedBet(false);
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
                          {elonOrMarkStatus} position entered
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
      }
      if (elonOrMarkStatus === "MARK") {
        const { request } = await publicClient.simulateContract({
          account: address,
          address: CONSTANTS.ADDRESS.MARKET,
          abi: CONSTANTS.ABI.MARKET,
          functionName: "betBear",
          args: [currentRound, ethers.parseUnits(amount, "ether")],
        });
        if (request) {
          const hash = await walletClient?.writeContract(request);

          if (hash) {
            const transaction = await publicClient.waitForTransactionReceipt({
              hash,
            });

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
                          {elonOrMarkStatus} position entered
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
              dispatch(changeBettedStatusHandler("Betted"));
              if (onPlacedBet) onPlacedBet(false);
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
                          {elonOrMarkStatus} position entered
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
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  // console.log({ approveValue });

  return (
    <div
      className={`card w-96 absolute top-0 z-10 shadow-xl backface-hidden translate-rotateY bg-[--colors-backgroundAlt] ${
        showSetBetCard && "z-20"
      }`}
    >
      <div className="flex justify-between items-center bg-gradient-to-r from-[--colors-gradientCardHeaderFrom] to-[--colors-gradientCardHeaderTo] p-4 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <Icons.ArrowLeft
            className="text-[--colors-text] cursor-pointer"
            onClick={backwardHandler}
          />
          <span className="text-[--colors-text]">Set Position</span>
        </div>
        {elonOrMarkStatus === "ELON" ? (
          <Button
            className="text-[--colors-white] bg-[--colors-success] hover:bg-[--colors-success] hover:opacity-[0.8]"
            type="button"
            onClick={() => changeElonOrMarkHandler("MARK")}
          >
            <span>ELON MUSK</span>
          </Button>
        ) : (
          <Button
            className="text-[--colors-white] bg-[--colors-failure] hover:bg-[--colors-failure] hover:opacity-[0.8]"
            type="button"
            onClick={() => changeElonOrMarkHandler("ELON")}
          >
            <span>MARK ZUCKERBERG</span>
          </Button>
        )}
      </div>
      <div className="card-body p-4">
        <div className="flex items-center justify-between">
          <span className="text-[--colors-textSubtle] font-medium text-base">
            Commit:
          </span>
          <div className="flex items-center gap-1">
            <Icons.PRXIcon />
            <span className="text-[--colors-text] font-semibold text-base">
              {CURRENCY_UNIT}
            </span>
          </div>
        </div>
        <div className="px-4 py-2 bg-[--colors-input] rounded-2xl">
          <input
            className="text-[--colors-white] text-right rounded-sm py-2 w-full focus:outline-none  disabled:cursor-not-allowed bg-[--colors-input] boder-[--colors-inputSecondary] "
            placeholder="0.0"
            ref={inputRef}
            onKeyDown={formatInputField}
            disabled={isClient && (isConnected ? false : true)}
            onChange={changeAmountHandler}
            value={amount}
          />
        </div>
        <span className="text-[--colors-failure] font-medium mt-1 text-right text-xs">
          {validatorInputField()}
        </span>
        {isClient &&
          (isConnected ? (
            <div className="text-[--colors-textSubtle] font-medium text-sm text-right">
              Balance: {balance.toLocaleString("en-US")} {CURRENCY_UNIT}
            </div>
          ) : null)}
        <div className="w-full h-12 relative mb-6">
          <div className="h-8">
            <Icons.HeartIcon />
          </div>

          <input
            type="range"
            min={1}
            max={100}
            step={0.1}
            value={percentage}
            disabled={isClient && (isConnected ? false : true)}
            onChange={changePercentageHandler}
            className="relative w-full bg-transparent z-50 disabled:cursor-not-allowed"
          />

          <div
            className={`-bottom-6 text-[--colors-text] text-xs absolute text-center min-w-[24px]`}
            style={{
              left:
                percentage === 100
                  ? `calc(${percentage}% - 5%)`
                  : `${percentage}%`,
            }}
          >
            {percentage}%
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          {BUTTONS_PERCENT.map((buttonPrecent) => (
            <Button
              key={buttonPrecent.id}
              className="flex items-center rounded-2xl font-semibold justify-center h-5 py-0 px-2 bg-[--colors-tertiary] text-[--colors-primary] text-xs flex-1 hover:bg-[--colors-tertiary] hover:opacity-80 focus:ring-offset-0 focus:ring-0"
              disabled={isClient && (isConnected ? false : true)}
              onClick={() => choosePercentageAmountHandler(buttonPrecent.value)}
            >
              {buttonPrecent.name}
            </Button>
          ))}
        </div>
        <div className="flex items-center justify-between mb-4">
          {BUTTONS_AMOUNT.map((buttonAmount) => (
            <Button
              key={buttonAmount.id}
              className="flex items-center rounded-2xl font-semibold justify-center h-5 py-0 px-2 bg-[--colors-tertiary] text-[--colors-primary] text-xs flex-1 hover:bg-[--colors-tertiary] hover:opacity-80 focus:ring-offset-0 focus:ring-0"
              disabled={isClient && (isConnected ? false : true)}
              onClick={() => chooseQuickAmountHandler(buttonAmount.value)}
            >
              {buttonAmount.name}
            </Button>
          ))}
        </div>
        <div>
          {isClient &&
            (!isConnected ? (
              <Button
                className="w-full bg-[--colors-primary] text-[--colors-white] hover:bg-[--colors-primary] hover:opacity-[0.8] rounded-2xl"
                type="button"
                disabled
              >
                Please Connect Wallet
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  className="w-full bg-[--colors-primary] text-[--colors-white] hover:bg-[--colors-primary] hover:opacity-[0.8] rounded-2xl"
                  type="button"
                  disabled={
                    activeButton() ||
                    isApproveLoading ||
                    approveValue >= +amount
                  }
                  onClick={approveHandler}
                  isLoading={isApproveLoading}
                >
                  {buttonName()}
                </Button>

                <Button
                  className="w-full bg-[--colors-primary] text-[--colors-white] hover:bg-[--colors-primary] hover:opacity-[0.8] rounded-2xl"
                  type="button"
                  disabled={
                    activeButton() || isLoading || approveValue < +amount
                  }
                  onClick={placeBetHandler}
                  isLoading={isLoading}
                >
                  Place bet
                </Button>
              </div>
            ))}
        </div>
        <p className="text-[--colors-textSubtle] font-medium text-xs">
          You won&apos;t be able to remove or change your position once you
          enter it.
        </p>
      </div>
    </div>
  );
};

export default React.memo(SetBetBoxingPosition);

const BUTTONS_PERCENT = [
  {
    id: nanoid(),
    name: "10%",
    value: 10,
  },
  {
    id: nanoid(),
    name: "25%",
    value: 25,
  },
  {
    id: nanoid(),
    name: "50%",
    value: 50,
  },
  {
    id: nanoid(),
    name: "75%",
    value: 75,
  },
  {
    id: nanoid(),
    name: "Max",
    value: 100,
  },
];

const BUTTONS_AMOUNT = [
  {
    id: nanoid(),
    value: 100,
    name: "100",
  },
  {
    id: nanoid(),
    value: 200,
    name: "200",
  },
  {
    id: nanoid(),
    value: 500,
    name: "500",
  },
  {
    id: nanoid(),
    value: 1000,
    name: "1000",
  },
];
