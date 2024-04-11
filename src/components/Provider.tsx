"use client";
import React from "react";
import { Toaster } from "react-hot-toast";
import {
  connectorsForWallets,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  trustWallet,
  rainbowWallet,
  coinbaseWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { CONSTANTS } from "@/constants";
import { MetaMaskWalletOptions } from "@rainbow-me/rainbowkit/dist/wallets/walletConnectors/metaMaskWallet/metaMaskWallet";
import { ThemeProvider } from "../context/change-mode";
import { store } from "@/redux/store";
import { Provider as ProviderRedux } from "react-redux";
import { TrustWalletOptions } from "@rainbow-me/rainbowkit/dist/wallets/walletConnectors/trustWallet/trustWallet";
import { SkeletonTheme } from "react-loading-skeleton";
import { CoinbaseWalletOptions } from "@rainbow-me/rainbowkit/dist/wallets/walletConnectors/coinbaseWallet/coinbaseWallet";

// Walet connect
const { chains, publicClient } = configureChains(
  [CONSTANTS.CHAIN],
  [publicProvider()]
);

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      metaMaskWallet({
        projectId: "bd9d8fac308dbb3111f4f6027617462e",
        chains,
      } as MetaMaskWalletOptions),

      // trustWallet({
      //   projectId: "7a8d1dd7222aa046c6766da9c1ba436a",
      //   chains,
      // } as TrustWalletOptions),

      // rainbowWallet({
      //   projectId: "7a8d1dd7222aa046c6766da9c1ba436a",
      //   chains,
      // }),
      // coinbaseWallet({
      //   appName: "notthing",
      //   chains,
      // }),
    ],
  },
]);

// const { connectors } = getDefaultWallets({
//   appName: "My RainbowKit App",
//   projectId: "7a8d1dd7222aa046c6766da9c1ba436a",
//   chains,
// });

const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient,
  connectors,
});

interface ProviderProps {
  children: React.ReactNode;
}

const Provider: React.FC<ProviderProps> = ({ children }) => {
  return (
    <SkeletonTheme baseColor="#a8a3a3" highlightColor="#716d6d">
      <ProviderRedux store={store}>
        <ThemeProvider>
          <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider chains={chains}>
              <Toaster position="top-right" reverseOrder={false} />
              {children}
            </RainbowKitProvider>
          </WagmiConfig>
        </ThemeProvider>
      </ProviderRedux>
    </SkeletonTheme>
  );
};

export default Provider;
