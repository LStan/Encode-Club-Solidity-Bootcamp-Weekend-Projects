import contractJson from "./SmartBnb.json";
import { localhost, sepolia, polygonMumbai, goerli, Chain } from "wagmi/chains";
import { configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { ethers } from "ethers";

export const LISTING_FEE = 0.0001;

const SMARTBNB_CONTRACT_ADDRESS_LOCALHOST =
  "0x40d3989CF95885f6456aCe44beC69Ac198Eb06F9";

const SMARTBNB_CONTRACT_ADDRESS_GOERLI =
  "0x92A36101B55e8118e36F4b67383aA8A4D4aEc8b5";

const SMARTBNB_CONTRACT_ADDRESS_MUMBAI =
  "0x95769608CaE7BF8F4694985F8F82dD950337d068";

const SMARTBNB_CONTRACT_ADDRESS_SEPOLIA =
  "0x861F65C60264AfC84db7dA97bF28cBA74d63e08D";

export function getSmartBnbContract(
  signerOrProvider: ethers.providers.Provider | ethers.Signer,
  chain: Chain
) {
  console.log(chain);
  switch (chain.network) {
    case "localhost":
      return new ethers.Contract(
        SMARTBNB_CONTRACT_ADDRESS_LOCALHOST,
        contractJson.abi,
        signerOrProvider
      );
    case "goerli":
      return new ethers.Contract(
        SMARTBNB_CONTRACT_ADDRESS_GOERLI,
        contractJson.abi,
        signerOrProvider
      );
    case "sepolia":
      return new ethers.Contract(
        SMARTBNB_CONTRACT_ADDRESS_SEPOLIA,
        contractJson.abi,
        signerOrProvider
      );
    case "maticmum":
      return new ethers.Contract(
        SMARTBNB_CONTRACT_ADDRESS_MUMBAI,
        contractJson.abi,
        signerOrProvider
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

export function getTransactionLink(transaction, chain) {
  switch (chain.network) {
    case "goerli":
      return "https://goerli.etherscan.io/tx/" + transaction.transactionHash;
    case "sepolia":
      return "https://sepolia.etherscan.io/tx/" + transaction.transactionHash;
    case "maticmum":
      return "https://mumbai.polygonscan.com/" + transaction.transactionHash;
    default:
      throw new Error("Unknown network!");
  }
}
