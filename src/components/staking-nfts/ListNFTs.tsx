"use client";
import { isEmpty } from "lodash";
import LayoutItem from "./LayoutItem";
import React, { useState } from "react";

export interface metadata {
  name: string;
  description: string;
  image: string;
  dna: string;
  edition: number;
  date?: number;
}

const ListNFTs = () => {
  const [NFTs, setNFTs] = useState<metadata[]>([]);

  if (isEmpty(NFTs))
    return (
      <div className="text-[#fff] ml-2 text-lg">
        Looks like you do not have any NFTs
      </div>
    );
  return (
    <div
      className="max-h-[800px] overflow-y-auto mx-[10px]"
      // className={clsx(styles.gameLayoutBody, styles.dashboardLayoutBody)}
    >
      {NFTs.map((items, index) => (
        <LayoutItem
          key={index}
          image={items.image}
          description={items.description}
          name={items.name}
          dna={items.dna}
          edition={items.edition}
        />
      ))}
    </div>
  );
};

export default ListNFTs;
