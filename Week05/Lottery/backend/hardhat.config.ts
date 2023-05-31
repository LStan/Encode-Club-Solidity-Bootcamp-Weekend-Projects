import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require('dotenv').config()

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        runs: 100,
        enabled: true,
      },
    },
  },
  networks: {
    hardhat: {},
    GOERLI: {
      accounts: [`${process.env.PRIVATE_KEY}`],
      url: `https://eth-goerli.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
    },
    SEPOLIA: {
      accounts: [`${process.env.PRIVATE_KEY}`],
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    },
  },
  etherscan: {
    apiKey: `${process.env.ETHERSCAN_API_KEY}`,
  },
};

export default config;
