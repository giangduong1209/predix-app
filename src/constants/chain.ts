import { Chain } from "wagmi";
export const chain: {
  [key: string]: Chain;
} = {
  bscTestnet: {
    id: 97,
    name: "BSC",
    network: "BSC Testnet",
    nativeCurrency: {
      decimals: 18,
      name: "TBNB",
      symbol: "TBNB",
    },
    rpcUrls: {
      default: {
        http: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
      },
      public: {
        http: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
      },
    },
    blockExplorers: {
      default: { name: "Bscscan", url: "https://testnet.bscscan.com/" },
    },
    testnet: true,
  },
  sepolia: {
    id: 11155111,
    name: "Sepolia",
    network: "Sepolia Testnet",
    nativeCurrency: {
      decimals: 18,
      name: "ETH",
      symbol: "ETH",
    },
    rpcUrls: {
      default: {
        http: ["https://rpc.sepolia.org"],
      },
      public: {
        http: ["https://rpc.sepolia.org"],
      },
    },
    blockExplorers: {
      default: { name: "Etherscan", url: "https://sepolia.etherscan.io" },
    },
    testnet: true,
  },

  //   bsc: {
  //     id: 56,
  //     name: "BSC",
  //     network: "BSC Mainnet",
  //     nativeCurrency: {
  //       decimals: 18,
  //       name: "BNB",
  //       symbol: "BNB",
  //     },
  //     rpcUrls: {
  //       default: "https://bsc-dataseed.binance.org/",
  //     },
  //     blockExplorers: {
  //       default: { name: "Bscscan", url: "https://bscscan.com/" },
  //     },
  //     testnet: false,
  //   },
};

export enum ChainType {
  BSC = "bsc",
  BSCTESTNET = "bscTestnet",
  SEPOLIA = "sepolia",
}
