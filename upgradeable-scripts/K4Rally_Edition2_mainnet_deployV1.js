// scripts/deploy_upgradeable_box.js
const { ethers, upgrades } = require("hardhat");

async function main() {
    const K4NftCarSignatureEdition2V1 = await ethers.getContractFactory("K4NftCarSignatureEdition2V1");
    console.log("Deploying K4NftCarSignatureEdition2V1...");
    const k4NftCarSignatureEdition2V1 = await upgrades.deployProxy(K4NftCarSignatureEdition2V1, [true], {
        initializer: "initialize",
    });
    await k4NftCarSignatureEdition2V1.deployed();
    console.log("K4NftCarSignatureEdition2V1 deployed to:", k4NftCarSignatureEdition2V1.address);
}

main();
