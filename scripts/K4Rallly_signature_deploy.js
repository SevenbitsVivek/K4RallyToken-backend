const ethers = require('ethers');
const main = async () => {
    const allowlistedAddresses = [
        '0x69321A1231687C9D55BbA0e37560a7058210B379'
        // '0xccdb17b8eF68ffFdbCA4bf4AB6B765e41d61733A',
    ];
    // const owner = '0x69321A1231687C9D55BbA0e37560a7058210B379';
    // const privateKey = 'de3498d1ef1ee0f3afd9ce6868f9912e52bbac7c8cf6bc43e169bbb80a70bc86';
    const owner = '0x8DADF9aCaBEe5595a55eaF41c074d8e60A1bC3f8';
    const privateKey = '9549755e8d90d277f1e2494b7de07dcad85241eacf7d769b7b983992bce14542';
    const signer = new ethers.Wallet(privateKey);
    console.log("Signer Wallet Address ===>", signer.address)

    // Get first allowlisted address
    let message = 'hello'
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