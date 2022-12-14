async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const K4_NFT_Car_Signature_Edition_2 = await ethers.getContractFactory("K4NftCarSignatureEdition2");
  const k4_NFT_Car_Signature_Edition_2 = await K4_NFT_Car_Signature_Edition_2.deploy();

  console.log("K4NftCarSignatureEdition2 contract address:-", k4_NFT_Car_Signature_Edition_2.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });