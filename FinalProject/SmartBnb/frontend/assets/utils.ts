import contractJson from "./SmartBnb.json";
import { localhost, sepolia, polygonMumbai, goerli } from "wagmi/chains";
import { configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { ethers } from "ethers";

const SMARTBNB_CONTRACT_ADDRESS_LOCALHOST =
  "0x40d3989CF95885f6456aCe44beC69Ac198Eb06F9";

const SMARTBNB_CONTRACT_ADDRESS_GOERLI = "0x5712DE56c5E00CE7223D6554617700B988DA1E5D";

const SMARTBNB_CONTRACT_ADDRESS_MUMBAI = "";

const SMARTBNB_CONTRACT_ADDRESS_SEPOLIA = "";

export function getSmartBnbContract(signer, chain) {
  switch (chain.network) {
    case "localhost":
      return new ethers.Contract(
        SMARTBNB_CONTRACT_ADDRESS_LOCALHOST,
        contractJson.abi,
        signer
      );
    case "goerli":
      return new ethers.Contract(SMARTBNB_CONTRACT_ADDRESS_GOERLI, contractJson.abi, signer);
    case "sepolia":
      return new ethers.Contract(
        SMARTBNB_CONTRACT_ADDRESS_MUMBAI,
        contractJson.abi,
        signer
      );
    case "maticmum":
      return new ethers.Contract(
        SMARTBNB_CONTRACT_ADDRESS_SEPOLIA,
        contractJson.abi,
        signer
      );
    default:
      throw new Error("Unknown network!");
  }
}

export function getSupportedChains() {
  return [localhost, goerli, sepolia, polygonMumbai];
}

export function getChainsConfig(apiKey) {
  return configureChains(getSupportedChains(), [
    jsonRpcProvider({
      rpc: (chain) => {
        let rpcUrl;
        switch (chain.network) {
          case "localhost":
            rpcUrl = `https://localhost:8545/`;
            break;
          case "goerli":
            rpcUrl = `https://eth-goerli.g.alchemy.com/v2/${apiKey}`;
          case "sepolia":
            rpcUrl = `https://eth-sepolia.g.alchemy.com/v2/${apiKey}`;
            break;
          case "maticmum":
            rpcUrl = `https://polygon-mumbai.g.alchemy.com/v2/${apiKey}`;
            break;
          default:
            throw new Error("Unknown network!");
        }

        return { http: rpcUrl };
      },
    }),
    publicProvider(),
  ]);
}
