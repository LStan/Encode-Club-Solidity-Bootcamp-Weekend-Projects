import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { createClient, WagmiConfig } from "wagmi";
import MainLayout from "../layout/mainLayout";
import { getChainsConfig } from "../assets/utils";

const { chains, provider } = getChainsConfig(process.env.ALCHEMY_API_KEY);

const { connectors } = getDefaultWallets({
  appName: "SmartBnb",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider modalSize="compact" chains={chains}>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
