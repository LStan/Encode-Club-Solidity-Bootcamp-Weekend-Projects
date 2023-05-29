const hre = require("hardhat");

async function main() {
	const Contract = await hre.ethers.getContractFactory("Test721");
	const contract = await Contract.deploy();

	await contract.deployed();

	console.log("Test721 deployed to:", contract.address);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});