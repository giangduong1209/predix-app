"use client";
import React from "react";
import { useEffect, useState } from "react";

import { useAccount } from "wagmi";
import Modal from "@/components/ui/Modal/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import getDataFileredByOnSnapshot from "@/helpers/getDataFilteredByOnSnapshot";
import userApi from "@/services/user-api";
import toast from "react-hot-toast";

import { useSearchParams } from "next/navigation";
import { Icons } from "@/components/Icons";

const NickNameModal = () => {
  const { isConnected, address } = useAccount();
  const [showUserNickname, setShowUserNickname] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [nicknameValue, setNicknameValue] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const searchParams = useSearchParams();

  const recommendId = searchParams.get("id");

  useEffect(() => {
    if (isConnected && address) {
      getDataFileredByOnSnapshot(
        "users",
        [["user_address", "==", address]],
        (docs) => {
          if (docs?.[0]?.nickname === "") {
            return setShowUserNickname(true);
          }
          if (docs.length === 0) {
            return setShowUserNickname(true);
          }
          setShowUserNickname(false);
        }
      );
    }
  }, [isConnected, address]);

  const changeNicknameValueHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const {
      target: { value },
    } = e;
    setNicknameValue(value);
  };

  const submitNicknameHandler = async () => {
    setIsLoading(true);
    if (nicknameValue.trim().length === 0) {
      setErrorMessage("Nick name is not empty!");
      setIsLoading(false);
      return;
    }
    try {
      const response = await userApi.nickname({
        user_address: address!,
        nickname: nicknameValue,
        recommend_id: recommendId ? recommendId : "",
      });
      if (response) {
        setIsLoading(false);
        setShowUserNickname(false);
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
                    Your nickname has been updated!
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
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  return (
    <Modal
      show={showUserNickname}
      title="Username"
      width={500}
      styleContent={{
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        backgroundColor: "transparent !important",
        backgroundImage:
          "linear-gradient(100%, var(--colors-lightBlueLeft), var(--colors-lightBlueRight))",
      }}
    >
      <div>
        <p>Enter your nickname:</p>
        <Input
          className="bg-white border-[--colors-success] border-2 rounded-2xl text-black px-2 py-4"
          onChange={changeNicknameValueHandler}
          onFocus={() => setErrorMessage("")}
        />
        <span className="text-sm text-red-500">{errorMessage}</span>
      </div>
      <Button
        variant="success"
        onClick={submitNicknameHandler}
        isLoading={isLoading}
      >
        Confirm
      </Button>
    </Modal>
  );
};

export default NickNameModal;
