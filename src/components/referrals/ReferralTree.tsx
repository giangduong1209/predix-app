"use client";
import getDataFileredByOnSnapshot from "@/helpers/getDataFilteredByOnSnapshot";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { getEllipsisTxt } from "@/utils/formmater-address";
import { isEmpty } from "lodash";
interface IUser {
  user_address: string;
  ref: string;
  user_tree_belong: [];
  user_tree_commissions: string[];
  show: boolean;
}

const ReferralTree = () => {
  const { isConnected, address } = useAccount();
  const [visibleNodes, setVisibleNodes] = React.useState<any[]>([]);
  const [child, setChild] = React.useState<string[]>([]);
  const [allTreeData, setAllTreeData] = React.useState<IUser[]>([]);
  const [isClient, setIsClient] = React.useState<boolean>(false);
  const [tempArr, setTempArr] = React.useState<any>([]);
  const [id, setId] = useState<string>("");

  useEffect(() => {
    setIsClient(true);
    if (isConnected && address) {
      getDataFileredByOnSnapshot(
        "users",
        [["user_tree_commissions", "array-contains", address]],
        (docs) => {
          setAllTreeData(docs as IUser[]);
          let max = 0;
          for (const item of allTreeData) {
            if (item.user_tree_commissions.length > max) {
              max = item.user_tree_commissions.length;
            }
          }
          // setFloorTree(max);
        }
      );
    }
  }, [isConnected, address]);

  const floorTree =
    allTreeData.reduce(
      (max, value, index, arr) =>
        max < value.user_tree_commissions.length
          ? value.user_tree_commissions.length
          : max,
      0
    ) + 1;
  let data: any = [];

  for (let i = 0; i < floorTree; i++) {
    let belongArr: IUser[] = [];
    let currentArr: IUser[] = [];

    if (data.length > 0) {
      belongArr = data[data.length - 1];

      for (const belong of belongArr) {
        allTreeData.map((item) => {
          if (item.ref === belong.user_address) {
            item.show = false;
            currentArr.push(item);
          }
        });
      }
    } else {
      currentArr.push({
        user_address: address as `0x${string}`,
        ref: "",
        user_tree_belong: [],
        user_tree_commissions: [],
        show: true,
      });
    }

    data.push(currentArr);
  }

  const handleToggleNode = (
    nodeId: string,
    _arr: IUser[],
    idx: number
  ): any => {
    console.log(tempArr);
    data = tempArr?.length > 0 ? tempArr : data;
    console.log(data);

    if (!isEmpty(_arr)) {
      for (let i = 0; i < _arr.length; i++) {
        let obj = {};
        if (_arr[i].ref === nodeId) {
          obj = {
            ..._arr[i],
            show: true,
          };
          // console.log(obj);
        } else {
          obj = { ..._arr[i] };
        }

        data[idx][i] = obj;
      }

      // setTempArr(data);
      return data;
    }
  };

  const renderNode = (idx: number, _arr: IUser[]) => {
    return (
      _arr && (
        <div className="block mx-auto px-5 h-[500px] overflow-y-scroll">
          {_arr.map((rootNode: any) => {
            return (
              <div key={rootNode.user_address} className="flex relative">
                <div
                  className={`flex items-center ${
                    rootNode.show ? "" : "hidden"
                  } justify-center border-2 border-black cursor-pointer m-2`}
                  onClick={() => {
                    const result = handleToggleNode(
                      rootNode.user_address,
                      data[idx + 1],
                      idx + 1
                    );
                    setTempArr(result);
                  }}
                >
                  <ButtonItem
                    text={`${getEllipsisTxt(rootNode.user_address)}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )
    );
  };

  return (
    <div className="text-white p-3 border-2 border-[--colors-secondary] rounded-xl">
      <div>
        <div className="text-xl mb-8 md:text-3xl">Referral Tree</div>

        <div className={`grid grid-cols-4 gap-5`}>
          {isClient &&
            isConnected &&
            (tempArr?.length > 0
              ? tempArr?.map((item: IUser[], idx: number) => {
                  // console.log({ idx, item, stt: "first" });
                  return renderNode(idx, item);
                })
              : data?.map((item: IUser[], idx: number) => {
                  // console.log({ idx, item, stt: "second" });
                  return renderNode(idx, item);
                }))}
        </div>
      </div>
    </div>
  );
};

const ButtonItem: React.FC<{
  text: string;
  handle?: () => void;
  disnable?: boolean;
  isRoot?: boolean;
}> = ({ handle, text, disnable, isRoot }) => (
  <button
    disabled={disnable}
    onClick={() => handle?.()}
    className={`${
      isRoot
        ? "bg-gradient-to-r from-[#00CEEA] to-[#28C38B] text-white"
        : "bg-white text-black"
    } text-center py-2 rounded-[60px] px-5`}
  >
    {text}
  </button>
);

export default ReferralTree;
