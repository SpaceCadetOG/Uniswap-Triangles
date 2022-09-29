import { HardhatUserConfig } from "hardhat/config";
require("dotenv").config();
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      { version: "0.8.10" },
      { version: "0.7.6" },
      { version: "0.6.6" },
      { version: "0.6.12" },
      { version: "0.8.0" },
      { version: "0.8.4" },
      { version: "0.8.0" },
    ],
  },
  networks: {
    local: {
      url: "http://127.0.0.1:8545/",
    },
  },
  gasReporter: {
    currency: "USD",
  },
};

export default config;
