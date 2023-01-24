async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contract with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const K4NftCarSignatureEdition4 = await ethers.getContractFactory("K4NftCarSignatureEdition4");
  const k4NftCarSignatureEdition4 = await K4NftCarSignatureEdition4.deploy();

  console.log("K4NftCarSignatureEdition4 contract address:-", k4NftCarSignatureEdition4.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });