async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contract with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const K4NftCarSignatureEdition1V2 = await ethers.getContractFactory("K4NftCarSignatureEdition1V2");
  const k4NftCarSignatureEdition1V2 = await K4NftCarSignatureEdition1V2.deploy();

  console.log("K4NftCarSignatureEdition1V2 contract address:-", k4NftCarSignatureEdition1V2.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });