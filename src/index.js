const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting deployment...\n");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Deploy NFT contract
  console.log("📝 Deploying NFT contract...");
  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy();
  await nft.waitForDeployment();
  const nftAddress = await nft.getAddress();
  console.log("✅ NFT deployed to:", nftAddress);

  // Deploy Marketplace contract
  console.log("\n📝 Deploying Marketplace contract...");
  const Marketplace = await hre.ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy();
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("✅ Marketplace deployed to:", marketplaceAddress);

  // Save contract addresses and ABIs
  const contractsDir = path.join(__dirname, "..", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  // Save addresses
  const addresses = {
    NFT: nftAddress,
    Marketplace: marketplaceAddress,
    network: hre.network.name,
    deployedAt: new Date().toISOString()
  };

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify(addresses, null, 2)
  );

  // Save ABIs
  const NFTArtifact = await hre.artifacts.readArtifact("NFT");
  const MarketplaceArtifact = await hre.artifacts.readArtifact("Marketplace");

  fs.writeFileSync(
    path.join(contractsDir, "NFT.json"),
    JSON.stringify(NFTArtifact, null, 2)
  );

  fs.writeFileSync(
    path.join(contractsDir, "Marketplace.json"),
    JSON.stringify(MarketplaceArtifact, null, 2)
  );

  console.log("\n📄 Contract addresses and ABIs saved to src/contracts/");
  
  console.log("\n🎉 Deployment complete!");
  console.log("\n📋 Summary:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("NFT Contract:", nftAddress);
  console.log("Marketplace Contract:", marketplaceAddress);
  console.log("Network:", hre.network.name);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });