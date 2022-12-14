// scripts/deploy_upgradeable_box.js
const { ethers, upgrades } = require("hardhat");

async function main() {
    const K4NftCarSignatureEdition1V1 = await ethers.getContractFactory("K4NftCarSignatureEdition1V1");
    console.log("Deploying K4NftCarSignatureEdition1V1...");
    const k4NftCarSignatureEdition1V1 = await upgrades.deployProxy(K4NftCarSignatureEdition1V1, [true], {
        initializer: "initialize",
    });
    await k4NftCarSignatureEdition1V1.deployed();
    console.log("K4NftCarSignatureEdition1V1 deployed to:", k4NftCarSignatureEdition1V1.address);
}

main();
