async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const K4_NFT_Car_Signature_Edition_1 = await ethers.getContractFactory("K4NftCarSignatureEdition1");
  const k4_NFT_Car_Signature_Edition_1 = await K4_NFT_Car_Signature_Edition_1.deploy();

  console.log("K4NftCarSignatureEdition1 contract address:-", k4_NFT_Car_Signature_Edition_1.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });