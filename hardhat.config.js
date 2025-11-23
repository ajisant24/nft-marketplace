require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const rawPrivateKey = process.env.PRIVATE_KEY ?? "";
// Accept keys with or without the 0x prefix. Validate length (32 bytes / 64 hex chars).
const PRIVATE_KEY = rawPrivateKey
  ? rawPrivateKey.startsWith("0x3342a49183b836489e2bdaff5a5458465b835a81")
    ? rawPrivateKey
    : `0x${rawPrivateKey}`
  : "";
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "";
const MUMBAI_RPC_URL = process.env.MUMBAI_RPC_URL || "";

function maybeAccounts() {
  if (!PRIVATE_KEY) return undefined;
  if (!/^0x[0-9a-fA-F]{64}$/.test(PRIVATE_KEY)) {
    console.warn("Warning: Invalid PRIVATE_KEY in .env; ignoring accounts for networks.");
    return undefined;
  }
  return [PRIVATE_KEY];
}

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: maybeAccounts(0x3342a49183b836489e2bdaff5a5458465b835a81),
      chainId: 11155111
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};