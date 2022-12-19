const ethers = require('ethers');
const main = async () => {
    const allowlistedAddresses = [
        '0x69321A1231687C9D55BbA0e37560a7058210B379'
        // '0xccdb17b8eF68ffFdbCA4bf4AB6B765e41d61733A',
    ];
    const privateKey = 'c244b6e8ae351e71fa353515c55a4e0be82fb5bf7186c18419f89421805f74b7';
    // const owner = 'Owner_Wallet_Address';
    // const privateKey = 'Owner_Private_Key';
    const signer = new ethers.Wallet(privateKey);
    console.log("Signer Wallet Address ===>", signer.address)

    // Get first allowlisted address
    let message = 'hello' + Date.now();
    // Compute hash of the address
    let messageHash = ethers.utils.id(message);
    console.log("Message Hash ===>", messageHash);
    // Sign the hashed address
    let messageBytes = ethers.utils.arrayify(messageHash);
    console.log("messageBytes ===>", messageBytes)
    let signature = await signer.signMessage(messageBytes);
    console.log("Signature ===> ", signature);
}


const runMain = async () => {
    try {
        await main();
        process.exit(0);
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
};
runMain();