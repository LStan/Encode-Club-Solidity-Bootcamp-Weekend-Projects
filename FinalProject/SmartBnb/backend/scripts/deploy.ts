import { ethers } from "hardhat";

const LISTING_FEE = 0.0001;

async function main() {
  const Contract = await ethers.getContractFactory("SmartBnb");
  const contract = await Contract.deploy(
    ethers.utils.parseEther(LISTING_FEE.toFixed(18))
  );

  await contract.deployed();

  console.log("Deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
