import { CONSTANTS } from "@/constants";
import { createPublicClient, createWalletClient, custom, http } from "viem";

export const publicClient = createPublicClient({
  chain: CONSTANTS.CHAIN,
  transport: http(),
});
// export const walletClient = createWalletClient({
//   chain: CONSTANTS.CHAIN,
//   transport: custom(window.ethereum as any),
// });
