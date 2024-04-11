"use client";
import React, { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { Address } from "viem";

const TokenFaucet = () => {
  const [addressValue, setAddressValue] = useState<Address>();

  const changeAddressHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (value.trim().length !== 0 && value !== undefined) {
      setAddressValue(addressValue);
    }
  };

  const onSubmit = () => {
    setAddressValue(undefined);
  };

  return (
    <>
      <h1 className="text-[--colors-textSub] text-4xl mt-6">Token Faucet</h1>
      <div className=" min-h-[50vh] md:min-h-screen flex flex-col justify-center md:px-96">
        <h2 className="text-[--colors-textSub] text-xl">
          Ethereum ERC20 Token Faucet
        </h2>
        <h1 className="text-4xl text-[--colors-primaryDark]">
          Mint tokens to an address
        </h1>
        <form className="flex flex-col gap-2 mt-7">
          <label htmlFor="address" className="text-[--colors-textSub]">
            Address
          </label>
          <Input
            className="text-[--colors-textSub] px-2"
            placeholder="0x0000"
            onChange={changeAddressHandler}
            value={addressValue}
          />
          <Button variant="success" onClick={onSubmit}>
            Submit
          </Button>
        </form>
      </div>
    </>
  );
};

export default TokenFaucet;
