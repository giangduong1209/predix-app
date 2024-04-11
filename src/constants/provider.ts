import { ethers } from "ethers";
import { ChainType } from "./chain";

// 2. Define network configurations
const providerRPC = {
  [ChainType.BSCTESTNET]: {
    name: "bscTestnet",
    rpc: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    chainId: 97,
  },
  [ChainType.BSC]: {
    name: "bscMainnet",
    rpc: "https://bsc-dataseed.binance.org/",
    chainId: 56,
  },
  [ChainType.SEPOLIA]: {
    name: "Sepolia",
    rpc: "https://rpc.sepolia.org",
    chainId: 11155111,
  },
};
// 3. Create ethers provider
const provider = (env: ChainType) => {
  return new ethers.JsonRpcProvider(providerRPC[env].rpc, {
    chainId: providerRPC[env].chainId,
    name: providerRPC[env].name,
  });
  //   return new ethers.providers.StaticJsonRpcProvider(providerRPC?.[env].bsc.rpc, {
  //     chainId: providerRPC?.[env].bsc.chainId,
  //     name: providerRPC?.[env].bsc.name,
  //   });
};
export default provider;
