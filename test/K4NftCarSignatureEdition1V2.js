const K4NftCarSignatureEdition1V2 = artifacts.require("K4NftCarSignatureEdition1V2");
const MyToken = artifacts.require("MyToken")

contract('K4NftCarSignatureEdition1V2', function (accounts) {

    let instance1 = null
    let instance2 = null
    before(async () => {
        instance1 = await K4NftCarSignatureEdition1V2.new({ from: accounts[3] });
        instance2 = await MyToken.new("test", "T", 1000000000000000);
        K4NftCarSignatureEdition1V2Instance = instance1;
        MyTokenInstance = instance2
    })
    var K4NftCarSignatureEdition1V2Instance, MyTokenInstance

    const tempUser1 = {
        tokenId: [0],
        quantity: 1,
        hash: "0x1ef3741d5709d32a9a07cfaa8e766f2c08b0c55e13d957728654238a178250be",
        signature: "0x89069a996f581d33eda5ed2f9da89528d23b7f6d61aaf1bb6de5fa2b087cb529381993ee489f8bed7fab486d1bb2549ef6310c8282af7653e8424625a2a3e2231b"
    }

    const tempUser2 = {
        tokenId: [1],
        quantity: 1,
        amount: 1000,
        hash: "0x16f0564edd6bde081bfc26c61023308fb1a9adda719ba96c9bc79ff263e2b8db",
        signature: "0xfa90e9e3d67047bf30e4afede12a8a4e92600d04586ec6fe65f6f3ec1255fab56a0a5cd62f93b55619c1fa3da5cbf8a0ed76fc6d2e955abe12c0e915d734bf8f1b"
    }

    const tempUser3 = {
        tokenId: [2],
        quantity: 1,
        hash: "0x75fe88d23d92dabef885de46e1242c5a8e2a49185a2154adc53311c79c45e278",
        signature: "0xbd4f3aeee3a48776f0202f1558835fdbd41257619d58b85114ce7088b95e575f700fcfe4c9cf36ae6b6f3b6c260d250a374f2d7ae06a2561b1ea01e28cc582ab1c"
    }

    const tempUser4 = {
        tokenId: [3],
        quantity: 1,
        amount: 1000,
        hash: "0xf69b3afc72e7b7065666cbd7f125a389e47e9f39f1dd23281dd5b741c7575518",
        signature: "0xc6e3c23f75feaf20975bc5014dd8a961e2b04f0babae566ea7ce6671c6e367d86380eea58e7e3a7fc600476241bd4122ce33ff2b79355c59a05b8676cd7015b31c"
    }

    const tempUser5 = {
        tokenId: [4],
        quantity: 1,
        to: accounts[1]
    }

    const tempUser6 = {
        tokenId: 9,
        hash: "0xe637013db7c3a0a22c0668f18b7092cb40754271cdb15353b05a5e56c760b197",
        signature: "0xc05ccc5477d24c45d1b6c55c3c673fb78f48cc8170e8cf8151820f360d4887df36f472fbd1d7bbaa00bc39ea5a43105757b51f121c34cccc3a22638ef7ed25c01b"
    }

    const accounts1 = config.networks.hardhat.accounts;
    const index = 0; // first wallet, increment for next wallets
    const index1 = 1; // first wallet, increment for next wallets
    const wallet1 = ethers.Wallet.fromMnemonic(accounts1.mnemonic, accounts1.path + `/${index}`);
    const wallet2 = ethers.Wallet.fromMnemonic(accounts1.mnemonic, accounts1.path + `/${index1}`);

    // const privateKey = wallet1.privateKey

    it('user mints the nft by using ether', async function () {
        await K4NftCarSignatureEdition1V2Instance.safeMintUsingEther(tempUser1.tokenId, tempUser1.quantity, tempUser1.hash, tempUser1.signature, { from: wallet1.address, value: 1000 });

        const getNftBalance = await K4NftCarSignatureEdition1V2Instance.balanceOf(wallet1.address)
        const getNftOwner = await K4NftCarSignatureEdition1V2Instance.ownerOf(tempUser1.tokenId)

        assert.equal(getNftBalance.toString(), 1, 'tokenId for respective owner should be same')
        assert.equal(getNftOwner.toString(), wallet1.address, 'nft owner for respective tokenId should be same')
    });

    it('user mints the nft by using token', async function () {
        await MyTokenInstance.transfer(wallet2.address, 1000)
        await MyTokenInstance.approve(K4NftCarSignatureEdition1V2Instance.address, tempUser2.amount, { from: wallet2.address })
        const getTokenBalance = await MyTokenInstance.balanceOf(wallet2.address)
        await K4NftCarSignatureEdition1V2Instance.safeMintUsingToken(tempUser2.tokenId, MyTokenInstance.address, tempUser2.amount, tempUser2.quantity, tempUser2.hash, tempUser2.signature, { from: wallet2.address });
        const getNftBalance = await K4NftCarSignatureEdition1V2Instance.balanceOf(wallet2.address)
        const getNftOwner = await K4NftCarSignatureEdition1V2Instance.ownerOf(tempUser2.tokenId)

        assert.equal(getTokenBalance.toNumber(), 1000, 'user token balance should be 1000')
        assert.equal(getNftBalance.toString(), 1, 'tokenId for respective owner should be same')
        assert.equal(getNftBalance.toString(), 1, 'tokenId for respective owner should be same')
        assert.equal(getNftOwner.toString(), wallet2.address, 'nft owner for respective tokenId should be same')
    });

    it('user mints the nft with hot wallet by using token', async function () {
        await K4NftCarSignatureEdition1V2Instance.setHotwalletAddress(wallet2.address, { from: '0x90F79bf6EB2c4f870365E785982E1f101E93b906' });
        await K4NftCarSignatureEdition1V2Instance.mintHotWallet(tempUser5.tokenId, tempUser5.quantity, tempUser5.to, { from: wallet2.address });
        const getNftBalance = await K4NftCarSignatureEdition1V2Instance.balanceOf(wallet2.address)
        const getNftOwner = await K4NftCarSignatureEdition1V2Instance.ownerOf(tempUser2.tokenId)

        assert.equal(getNftBalance.toString(), 2, 'tokenId for respective owner should be same')
        assert.equal(getNftOwner.toString(), wallet2.address, 'nft owner for respective tokenId should be same')
    });

    it('user directly mints the token with directMint function', async function () {
        await K4NftCarSignatureEdition1V2Instance.directMint(tempUser6.tokenId, tempUser6.hash, tempUser6.signature, { from: '0x90F79bf6EB2c4f870365E785982E1f101E93b906' });
        const getNftBalance = await K4NftCarSignatureEdition1V2Instance.balanceOf(wallet2.address)
        const getNftOwner = await K4NftCarSignatureEdition1V2Instance.ownerOf(tempUser6.tokenId)

        assert.equal(getNftBalance.toString(), 2, 'tokenId for respective owner should be same')
        assert.equal(getNftOwner.toString(), "0x90F79bf6EB2c4f870365E785982E1f101E93b906", 'nft owner for respective tokenId should be same')
    });

    it('if user mints the nft without whitelisting using hot wallet, then user will get an error', async () => {
        await K4NftCarSignatureEdition1V2Instance.setHotwalletAddress(accounts[4], { from: '0x90F79bf6EB2c4f870365E785982E1f101E93b906' });
        await K4NftCarSignatureEdition1V2Instance.mintHotWallet(tempUser5.tokenId, tempUser5.quantity, accounts[5], { from: accounts[4] });

        try {
            await K4NftCarSignatureEdition1V2Instance.setHotwalletAddress(accounts[5], { from: '0x90F79bf6EB2c4f870365E785982E1f101E93b906' });
            await K4NftCarSignatureEdition1V2Instance.mintHotWallet(tempUser5.tokenId, tempUser5.quantity, tempUser5.to, { from: accounts[5] });

        } catch (error) {
            console.log("Error handled")
            assert.equal(error.message, "VM Exception while processing transaction: reverted with reason string 'Not whitelisted'")
        }
    });

    it('if owner whitelist same user more than once, then user will get an error', async () => {
        await K4NftCarSignatureEdition1V2Instance.setHotwalletAddress(accounts[6], { from: '0x90F79bf6EB2c4f870365E785982E1f101E93b906' });

        try {
            await K4NftCarSignatureEdition1V2Instance.setHotwalletAddress(accounts[7], { from: '0x90F79bf6EB2c4f870365E785982E1f101E93b906' });
            // await K4NftCarSignatureEdition2Instance.setHotwalletAddress(accounts[7], { from: '0x90F79bf6EB2c4f870365E785982E1f101E93b906' });
        } catch (error) {
            console.log("Error handled")
            assert.equal(error.message, "VM Exception while processing transaction: reverted with reason string 'User already exists'")
        }
    });

    it('if owner non-whitelist same user more than once, then user will get an error', async () => {
        await K4NftCarSignatureEdition1V2Instance.setHotwalletAddress(accounts[8], { from: '0x90F79bf6EB2c4f870365E785982E1f101E93b906' });
        await K4NftCarSignatureEdition1V2Instance.removeHotwalletAddress(accounts[8], { from: '0x90F79bf6EB2c4f870365E785982E1f101E93b906' });

        try {
            await K4NftCarSignatureEdition1V2Instance.setHotwalletAddress(accounts[8], { from: '0x90F79bf6EB2c4f870365E785982E1f101E93b906' });
            await K4NftCarSignatureEdition1V2Instance.removeHotwalletAddress(accounts[8], { from: '0x90F79bf6EB2c4f870365E785982E1f101E93b906' });
            // await K4NftCarSignatureEdition1V2Instance.removeHotwalletAddress(accounts[8], { from: '0x90F79bf6EB2c4f870365E785982E1f101E93b906' });
        } catch (error) {
            console.log("Error handled")
            assert.equal(error.message, "VM Exception while processing transaction: reverted with reason string 'User is already removed from the whitelist.'")
        }
    });

    it('if user mints the nft after removing from the whitelisting, then user will get an error', async () => {
        await K4NftCarSignatureEdition1V2Instance.setHotwalletAddress(accounts[9], { from: '0x90F79bf6EB2c4f870365E785982E1f101E93b906' });
        await K4NftCarSignatureEdition1V2Instance.mintHotWallet(tempUser5.tokenId, tempUser5.quantity, tempUser5.to, { from: accounts[9] });

        try {
            await K4NftCarSignatureEdition1V2Instance.setHotwalletAddress(accounts[10], { from: '0x90F79bf6EB2c4f870365E785982E1f101E93b906' });
            await K4NftCarSignatureEdition1V2Instance.mintHotWallet(tempUser5.tokenId, tempUser5.quantity, tempUser5.to, { from: accounts[10] });
            await K4NftCarSignatureEdition1V2Instance.removeHotwalletAddress(accounts[10], { from: '0x90F79bf6EB2c4f870365E785982E1f101E93b906' });
            // await K4NftCarSignatureEdition1V2Instance.mintHotWallet(tempUser5.tokenId, tempUser5.quantity, tempUser5.to, { from: accounts[10] });
            const getWalletAddress = await K4NftCarSignatureEdition1V2Instance.getWhiteListedAddress(accounts[10], { from: '0x90F79bf6EB2c4f870365E785982E1f101E93b906' });
        } catch (error) {
            console.log("Error handled")
            assert.equal(error.message, "VM Exception while processing transaction: reverted with reason string 'You need to be whitelisted'")
        }
    });

    it('owner withdraw ethers and tokens from smart contract', async function () {
        const withdraw1 = await K4NftCarSignatureEdition1V2Instance.withdraw(accounts[3], { from: accounts[3] })
        const withdraw2 = await K4NftCarSignatureEdition1V2Instance.withdrawToken(MyTokenInstance.address, accounts[3], { from: accounts[3] })
        assert.equal(withdraw1.receipt.from, 0x90F79bf6EB2c4f870365E785982E1f101E93b906, 'contract owner account should be same')
        assert.equal(withdraw2.receipt.from, 0x90F79bf6EB2c4f870365E785982E1f101E93b906, 'contract owner account should be same')
    });

    it('if user uses the same hash and signature while minting nft using ether and token, then user will get an error', async () => {
        await MyTokenInstance.transfer(wallet1.address, 1000)
        await MyTokenInstance.approve(K4NftCarSignatureEdition1V2Instance.address, tempUser2.amount, { from: wallet1.address })
        await K4NftCarSignatureEdition1V2Instance.safeMintUsingToken(tempUser3.tokenId, MyTokenInstance.address, tempUser4.amount, tempUser3.quantity, tempUser3.hash, tempUser3.signature, { from: wallet1.address });
        await K4NftCarSignatureEdition1V2Instance.safeMintUsingEther(tempUser3.tokenId, tempUser3.quantity, "0x3e52b3a8e4b97cc23ffbdc4c2721ae918e1d409ff2dd9e20291111acb029b216", "0x3baa2f0e2d602f3b5545862ba9b9c5eef5049082495de80797feb67f47a889146e27b85330d77e2c3c2e35aa59b8042ef3766be65c489d4931a113bb2055b68a1b", { from: wallet1.address, value: 1000 });

        try {
            await MyTokenInstance.transfer(wallet1.address, 1000)
            await MyTokenInstance.approve(K4NftCarSignatureEdition1V2Instance.address, tempUser2.amount, { from: wallet1.address })
            await K4NftCarSignatureEdition1V2Instance.safeMintUsingToken(tempUser3.tokenId, MyTokenInstance.address, tempUser4.amount, tempUser3.quantity, tempUser4.hash, tempUser4.signature, { from: wallet1.address });
            await K4NftCarSignatureEdition1V2Instance.safeMintUsingEther(tempUser3.tokenId, tempUser3.quantity, "0xebd358a3d2ffd27dee33130d10b1b25dc0f70ba8d79f776794ce6305124437a8", "0xe9b60f51797a6001547445679b5998ff81cbc0b0196b79a002a84d26602b385d3a5d21597a24667c2df22bff588603bc18e2f12f88ae7a0eb1b6a484d894ee161b", { from: wallet1.address, value: 1000 });
        } catch (error) {
            console.log("Error handled")
            assert.equal(error.message, "VM Exception while processing transaction: reverted with reason string 'Already signature used'")
        }
    });

    it('if user buys more than 10 nfts by using ether and token, then user will get an error', async () => {
        await MyTokenInstance.transfer(wallet1.address, 1000)
        await MyTokenInstance.approve(K4NftCarSignatureEdition1V2Instance.address, tempUser2.amount, { from: wallet1.address })
        await K4NftCarSignatureEdition1V2Instance.safeMintUsingToken(tempUser3.tokenId, MyTokenInstance.address, tempUser4.amount, tempUser3.quantity, "0x04e47e084b55fd31c4a3c07cea4d8e2595e975e948e12f2c86f9aeb6ac5d53c8", "0x4c9fec7e633b65c9849e5e9bbcb0713eca41eee1e44cab982365213861b373cc4a9eed6550bea66c1eba3a5bf333012a47372a4dd5e4bd633e4adf0e04bdc5a71c", { from: wallet1.address });
        await K4NftCarSignatureEdition1V2Instance.safeMintUsingEther(tempUser3.tokenId, tempUser3.quantity, "0x9a282e199e22b81c0a2cdbaa1dc9077fc64983cfd618e2f413aa879155ce86cf", "0xc5f8b85d1f15fd81c0b67dc02fbed444db905c4873ed94b5a3cd69716249fbae6cfceb36e0e03ef993692d3b1698e4403cd37ea753df4a3cab8df018fbc7c38b1c", { from: wallet1.address, value: 1000 });
        try {
            await MyTokenInstance.transfer(wallet1.address, 1000)
            await MyTokenInstance.approve(K4NftCarSignatureEdition1V2Instance.address, tempUser2.amount, { from: wallet1.address })
            await K4NftCarSignatureEdition1V2Instance.safeMintUsingToken([4, 5, 6, 7, 8, 9, 10, 11, 12, 13], MyTokenInstance.address, tempUser4.amount, 10, "0x0b8d27304c7fcbf822eab658c6e30d7dbb44f1e12d68762345bd1b6f68df971c", "0x31289bcdfe370186a482747f3ff652ef68d7422e3bb26c224ef708eb0f62fb3157b9363ac8e26576d5dfe7271667b609916ecf7cec378fda86f5d60f232b8e7a1c", { from: wallet1.address });
            await K4NftCarSignatureEdition1V2Instance.safeMintUsingEther([4, 5, 6, 7, 8, 9, 10, 11, 12, 13], 10, "0x245ca1d3d5b1bbebc13b9c2bf90ebfb09e99299701ee5465f6f7fb167f0cb156", "0x1a03bd277e748ecf272a68d8a211823259e153ed6a356f35e3d7ef63c29161e264cf618b37e6e5f083850276a995cc35d1ed4397701512c2227fcc95ff997d091b", { from: wallet1.address, value: 1000 });
        } catch (error) {
            console.log("Error handled")
            assert.equal(error.message, "VM Exception while processing transaction: reverted with reason string 'Cannot buy more than 10 nfts'")
        }
    });

    it('if user buys nft more than totalSupply using token, then user will get an mint status', async () => {
        var tx1, tx2
        await MyTokenInstance.transfer(wallet1.address, 1000)
        await MyTokenInstance.approve(K4NftCarSignatureEdition1V2Instance.address, tempUser2.amount, { from: wallet1.address })
        tx1 = await K4NftCarSignatureEdition1V2Instance.safeMintUsingToken([20], MyTokenInstance.address, tempUser4.amount, tempUser3.quantity, "0x41b7fa740697da272779c47d81fce86dfe333e7dcc1a12b6cdbe8e47b0a6dc4e", "0xf9559abc3d5def386a9049df198925a264417135b205e021b5078766c1bdb39d6e5462df3de85e3ac9a8df02e9342c0fb5335af374f5463b5d5e4693eb63f92b1b", { from: wallet1.address });
        const { logs } = tx1;
        assert.ok(Array.isArray(logs));
        const log = logs[1];
        assert.equal(log.event, 'NFTMinted');
        assert.equal(log.args._to.toString(), wallet1.address);
        assert.equal(log.args._tokenId.toNumber(), [20]);
        assert.equal(log.args._quantity, tempUser3.quantity);
        assert.equal(log.args._success, true);
        assert.equal(log.args._contractID.toNumber(), 11);
        try {
            await MyTokenInstance.transfer(wallet1.address, 1000)
            await MyTokenInstance.approve(K4NftCarSignatureEdition1V2Instance.address, tempUser2.amount, { from: wallet1.address })
            tx2 = await K4NftCarSignatureEdition1V2Instance.safeMintUsingToken([1000], MyTokenInstance.address, tempUser4.amount, 1, "0x1e138275fafac6befb1fcd9cb5495756e21650f4ac156962d6756c2700a9f08a", "0xf530c048833bfc3e44e7ebb4e2b7804ae07f2eea3984f6d4241de5e4bc9cd05713b47d9ad0a8d0057dfdd6d6363a5446077dea7145bbc04623d43bcf53b9e0221c", { from: wallet1.address });
            const { logs } = tx2;
            assert.ok(Array.isArray(logs));
            const log = logs[0];
            assert.equal(log.event, 'NFTMinted');
            assert.equal(log.args._to.toString(), wallet1.address);
            assert.equal(log.args._tokenId.toNumber(), [1000]);
            assert.equal(log.args._quantity, 1);
            assert.equal(log.args._success, false);
            assert.equal(log.args._contractID.toNumber(), 11);
        } catch (error) {
            console.log("Error handled")
            console.log("error.message ===>", error.message)
        }
    });

    it('if user buys nft more than totalSupply using ether, then user will get an mint status', async () => {
        var tx1, tx2
        tx1 = await K4NftCarSignatureEdition1V2Instance.safeMintUsingEther([21], tempUser3.quantity, "0x6af3fa03c0b40d028473bf77d676560198e19c14762864d1cd33338fb233ef5c", "0x7f76bc36edb71a335ab7bbfc3edce50358aa4032dd2f19ff8e62220aeb482846127a7024c3d68ad1c71c4bc99d219f7d09a78ec0f73030644f0899facf6c658b1c", { from: wallet1.address, value: 1000 });
        const { logs } = tx1;
        assert.ok(Array.isArray(logs));
        const log = logs[1];
        assert.equal(log.event, 'NFTMinted');
        assert.equal(log.args._to.toString(), wallet1.address);
        assert.equal(log.args._tokenId.toNumber(), [21]);
        assert.equal(log.args._quantity, tempUser3.quantity);
        assert.equal(log.args._success, true);
        assert.equal(log.args._contractID.toNumber(), 11);
        try {
            tx2 = await K4NftCarSignatureEdition1V2Instance.safeMintUsingEther([1001], 1, "0x0851b8e288d9e6709e9a8831912e0978a3098ac760e96e0d6f0998d557402475", "0xe4a003d0176387d65f4744900fe7adc6eb6bb65ff7790debcdbc22e69c68c523181f0a08fe7dcc2a0a95edecf510a5ecf0a5b5a496ba1dd1a8801c4efacc0d471c", { from: wallet1.address, value: 1000 });
            const { logs } = tx2;
            assert.ok(Array.isArray(logs));
            const log = logs[0];
            assert.equal(log.event, 'NFTMinted');
            assert.equal(log.args._to.toString(), wallet1.address);
            assert.equal(log.args._tokenId.toNumber(), [1001]);
            assert.equal(log.args._quantity, 1);
            assert.equal(log.args._success, false);
            assert.equal(log.args._contractID.toNumber(), 11);
        } catch (error) {
            console.log("Error handled")
            console.log("error.message ===>", error.message)
        }
    });

    it('if user buys nft more than totalSupply using hot wallet, then user will get an mint status', async () => {
        var tx1, tx2
        await K4NftCarSignatureEdition1V2Instance.setHotwalletAddress(accounts[10], { from: '0x90F79bf6EB2c4f870365E785982E1f101E93b906' });
        tx1 = await K4NftCarSignatureEdition1V2Instance.mintHotWallet([22], tempUser5.quantity, tempUser5.to, { from: accounts[10] });
        const { logs } = tx1;
        assert.ok(Array.isArray(logs));
        const log = logs[1];
        assert.equal(log.event, 'NFTMinted');
        assert.equal(log.args._to.toString(), tempUser5.to);
        assert.equal(log.args._tokenId.toNumber(), [22]);
        assert.equal(log.args._quantity, tempUser5.quantity);
        assert.equal(log.args._success, true);
        assert.equal(log.args._contractID.toNumber(), 11);
        try {
            await K4NftCarSignatureEdition1V2Instance.setHotwalletAddress(accounts[11], { from: '0x90F79bf6EB2c4f870365E785982E1f101E93b906' });
            tx2 = await K4NftCarSignatureEdition1V2Instance.mintHotWallet([1002], tempUser5.quantity, tempUser5.to, { from: accounts[11] });
            const { logs } = tx2;
            assert.ok(Array.isArray(logs));
            const log = logs[0];
            assert.equal(log.event, 'NFTMinted');
            assert.equal(log.args._to.toString(), tempUser5.to);
            assert.equal(log.args._tokenId.toNumber(), [1002]);
            assert.equal(log.args._quantity, tempUser5.quantity);
            assert.equal(log.args._success, false);
            assert.equal(log.args._contractID.toNumber(), 11);
        } catch (error) {
            console.log("Error handled")
            console.log("error.message ===>", error.message)
        }
    });

    it('if user buys nft more than totalSupply using directMint function, then user will get an mint status', async () => {
        var tx1, tx2
        tx1 = await K4NftCarSignatureEdition1V2Instance.directMint([23], "0xe2e581df73cc212616bb3cf7369b3f38f7dbdf94964bbb9d9c2ee5bc4cb20e60", "0xef6187719a185e8c9b110965a62e707fdad8323b765c6d90e7cd4790a084d7d977dda32ce23ea08b4a4409b083ba9e6e73d8117c243e57dc958780e3e0b56d8d1c", { from: '0x90F79bf6EB2c4f870365E785982E1f101E93b906' });
        const { logs } = tx1;
        assert.ok(Array.isArray(logs));
        const log = logs[1];
        assert.equal(log.event, 'NFTMinted');
        assert.equal(log.args._to.toString(), '0x90F79bf6EB2c4f870365E785982E1f101E93b906');
        assert.equal(log.args._tokenId.toNumber(), [23]);
        assert.equal(log.args._quantity, 1);
        assert.equal(log.args._success, true);
        assert.equal(log.args._contractID.toNumber(), 11);
        try {
            tx2 = await K4NftCarSignatureEdition1V2Instance.directMint(1003, "0xb0c901e6cd87e9b3466f493de763afe2dbabc0065c8e9e00fecc13ab91d71981", "0x43215faf37d396a113f7ebec3371dc69a61bb3eafcc634ae6c874d0309828f74760efe9b3f53559a86b72f5dc347e042078e8d66568108e004a0c3492019799f1b", { from: '0x90F79bf6EB2c4f870365E785982E1f101E93b906' });
            const { logs } = tx2;
            assert.ok(Array.isArray(logs));
            const log = logs[0];
            assert.equal(log.event, 'NFTMinted');
            assert.equal(log.args._to.toString(), '0x90F79bf6EB2c4f870365E785982E1f101E93b906');
            assert.equal(log.args._tokenId.toNumber(), [1003]);
            assert.equal(log.args._quantity, 0);
            assert.equal(log.args._success, false);
            assert.equal(log.args._contractID.toNumber(), 11);
        } catch (error) {
            console.log("Error handled")
            console.log("error.message ===>", error.message)
        }
    });

    it('if user buys 0 quantity using ether and token, then user will get an error', async () => {
        await MyTokenInstance.transfer(wallet1.address, 1000)
        await MyTokenInstance.approve(K4NftCarSignatureEdition1V2Instance.address, tempUser2.amount, { from: wallet1.address })
        await K4NftCarSignatureEdition1V2Instance.safeMintUsingToken(tempUser3.tokenId, MyTokenInstance.address, tempUser4.amount, tempUser3.quantity, "0x264628ef4be3d54f2a634fd0abcc5b3b2178ad2da9799fbf8120032e207edb90", "0xd273735b61c6d5701ee957202f3b0eea753a927b8ba92b9ddd2231828ff40fd12139af5705a1a7314e987700350b39c1a04110ae13157e7822ddd0e4089ba7091b", { from: wallet1.address });
        await K4NftCarSignatureEdition1V2Instance.safeMintUsingEther(tempUser3.tokenId, tempUser3.quantity, "0xd9b4db9d7fbecc8d811f69129195ef0ca2e5a6723caec61bcfb06d83067c508b", "0xfbb9cb0362438bc7e7663d885f19a842d8d24c6f066c29e3ad94c9fcf38a60e323f9ba81bdfe9e7c4db0cec43edbd0e6d09f95d28a98e6595a5043b1585ec8191b", { from: wallet1.address, value: 1000 });
        try {
            await MyTokenInstance.transfer(wallet1.address, 1000)
            await MyTokenInstance.approve(K4NftCarSignatureEdition1V2Instance.address, tempUser2.amount, { from: wallet1.address })
            await K4NftCarSignatureEdition1V2Instance.safeMintUsingToken([4, 5, 6, 7, 8, 9, 10, 11, 12, 13], MyTokenInstance.address, tempUser4.amount, 10, "0x62355a54844cbb69a8709a0b779a2433af6f728795386700ce9e969bc74ead56", "0xc85bc575f0b7db10935b0eaa93776086be4e3360245f14509fb4601e911a477a5545b2eb514001a89dc7ae3683c86f98f434be8cf2fc3a6443b5770dd4e534941c", { from: wallet1.address });
            await K4NftCarSignatureEdition1V2Instance.safeMintUsingEther([4, 5, 6, 7, 8, 9, 10, 11, 12, 13], 10, "0x77ad3796134186d94fb26d3bd9d00d5b091ac81c2b1d828d501a4e2d1eca5dd3", "0x1e38229b17707b2b7ba7e86f0c6aa12102643ab02ca25b7ab32b9e5a248012496ca77eade368090fdac67acdf26b8a4759b1631785413e0baa5d6071819113d11b", { from: wallet1.address, value: 1000 });
        } catch (error) {
            console.log("Error handled")
            assert.equal(error.message, "VM Exception while processing transaction: reverted with reason string 'Insufficient quantity'")
        }
    });

    it('if user buys nft with 0 value as an amount using ether and token, then user will get an error', async () => {
        await MyTokenInstance.transfer(wallet1.address, 1000)
        await MyTokenInstance.approve(K4NftCarSignatureEdition1V2Instance.address, tempUser2.amount, { from: wallet1.address })
        await K4NftCarSignatureEdition1V2Instance.safeMintUsingToken(tempUser3.tokenId, MyTokenInstance.address, tempUser4.amount, tempUser3.quantity, "0x377fc0ad05afb8388496cdb41b455e179865e747f3f122f29032d45b20b68b63", "0x24b17b09d510f8a62a619f8046e81f5477fb43a32fd52a818e6bebdff8bae6dd761cfc059c27d7c88adefeeeed0c92504485193575689fa1f860fcf88b1f7bab1b", { from: wallet1.address });
        await K4NftCarSignatureEdition1V2Instance.safeMintUsingEther(tempUser3.tokenId, tempUser3.quantity, "0xe300df893b6d717568053709351467f85f328bdd0641713f8eeebd61c0bb9c10", "0xc8c9a51fdcf19d8931daeafbc31f1eab5b8acd93c12d9e9b978568056e2e948043006ed26e27b339856f7fd4884abf15792e72a0672343549af2768b275cbf871c", { from: wallet1.address, value: 1000 });
        try {
            await MyTokenInstance.transfer(wallet1.address, 1000)
            await MyTokenInstance.approve(K4NftCarSignatureEdition1V2Instance.address, tempUser2.amount, { from: wallet1.address })
            await K4NftCarSignatureEdition1V2Instance.safeMintUsingToken([4, 5, 6, 7, 8, 9, 10, 11, 12, 13], MyTokenInstance.address, tempUser4.amount, 10, "0x5550c7dbba2f657185f8694f712063b1336304870994f58f41157aa7671b6b44", "0x806c5da81fde057dabf9d2a0a89a638e7ff3a476b5f38a817db302ea5aa2a1012923b97f9434d512648e88d3e301be59d685771a24adec9fd1269a36c65424fa1c", { from: wallet1.address });
            await K4NftCarSignatureEdition1V2Instance.safeMintUsingEther([4, 5, 6, 7, 8, 9, 10, 11, 12, 13], 10, "0x632b03473de0ef3a37d73d27878b3e04c28a3e364f6e0844346d6a30f5bb72ff", "0xa1827fcf8d049f3d1f1f10a8981d99d2129b8b37c4a84627e1785288a8a829ad27b6dd3baadea9c2313ff533a9db9c5027004503035c757126bfc4bb3bf218ba1b", { from: wallet1.address, value: 1000 });
        } catch (error) {
            console.log("Error handled")
            assert.equal(error.message, "VM Exception while processing transaction: reverted with reason string 'Insufficient amount'")
        }
    });

    it('if user buys nft with 0 token address using token, then user will get an error', async () => {
        await MyTokenInstance.transfer(wallet1.address, 1000)
        await MyTokenInstance.approve(K4NftCarSignatureEdition1V2Instance.address, tempUser2.amount, { from: wallet1.address })
        await K4NftCarSignatureEdition1V2Instance.safeMintUsingToken(tempUser3.tokenId, MyTokenInstance.address, tempUser4.amount, tempUser3.quantity, "0x92b7c922a5cb1ebb38350f514757f3b9214dbe5167fa0175a23d7679a54a68ef", "0xae34ebafee423f7d5bbc869f94f19f62441573f977083dd9514fe0355fafcaf0146fb4f3ca2a6a4849aa50bf2d8b62b2be550302e5fd2f93af4f81152403adc01c", { from: wallet1.address });
        try {
            await MyTokenInstance.transfer(wallet1.address, 1000)
            await MyTokenInstance.approve(K4NftCarSignatureEdition1V2Instance.address, tempUser2.amount, { from: wallet1.address })
            await K4NftCarSignatureEdition1V2Instance.safeMintUsingToken([4, 5, 6, 7, 8, 9, 10, 11, 12, 13], MyTokenInstance.address, tempUser4.amount, 10, "0xfc67b5236cf7af80ae56b01b8e65dbfc533c7a344224510ab98a804297b1f64f", "0x134c8ed1a5d768441072c2104a4c531ba114f36df96c658eb5d5f75056f25f637a8fc966e9d5114ea607fc5e08974b95ee55d12feaabb94eef379add83aff30e1b", { from: wallet1.address });
        } catch (error) {
            console.log("Error handled")
            assert.equal(error.message, "VM Exception while processing transaction: reverted with reason string 'Address cannot be zero'")
        }
    });

    it('if user buys nft in which length of tokenId and quantity dosen`t match using ether and token, then user will get an error', async () => {
        await MyTokenInstance.transfer(wallet1.address, 1000)
        await MyTokenInstance.approve(K4NftCarSignatureEdition1V2Instance.address, tempUser2.amount, { from: wallet1.address })
        await K4NftCarSignatureEdition1V2Instance.safeMintUsingToken(tempUser3.tokenId, MyTokenInstance.address, tempUser4.amount, tempUser3.quantity, "0x4efbafee9af13a022200bddf088751f756b4ef93b494ef698bf5b0ba7f5a477b", "0x21b071314c5518ff0321eab4fd5841cd9f412babacd3c1b99b6757c763311cc41f0c8b41d30a7bee66cca868fe81a794ed1711370db495f1a45eb8bcd1fc21811b", { from: wallet1.address });
        await K4NftCarSignatureEdition1V2Instance.safeMintUsingEther(tempUser3.tokenId, tempUser3.quantity, "0x28a2fe43a6a42a25a7588a7e94247b17574072b61b3b112e548f7f6195980522", "0x2cd044ff087a757da8314c9f2ea65acfd4de68c16610c4faefd57b043d00d305151908b5a7c2c294c75f62e13d17135be4340e789c39b8439242e1251695ee241c", { from: wallet1.address, value: 1000 });
        try {
            await MyTokenInstance.transfer(wallet1.address, 1000)
            await MyTokenInstance.approve(K4NftCarSignatureEdition1V2Instance.address, tempUser2.amount, { from: wallet1.address })
            await K4NftCarSignatureEdition1V2Instance.safeMintUsingToken([4, 5, 6, 7, 8, 9, 10, 11, 12, 13], MyTokenInstance.address, tempUser4.amount, 10, "0xeb2a516bdb321ec117d432b36e5d40f28151f26a99c0fe3eff37776eceef3a35", "0x880e243ac6f9f78c8c6445175295d3f4732c6d359f01a9369cdee495c3f8e1d47090b1e79f1f85ad656bbc9f0036dfb65278c484e055507f0a106af7deeae4911c", { from: wallet1.address });
            await K4NftCarSignatureEdition1V2Instance.safeMintUsingEther([4, 5, 6, 7, 8, 9, 10, 11, 12, 13], 10, "0x7221fa4cd5a746fddff301a95d5c58f1da063ed95fb6a892aa1c4e1b959004c5", "0x6a27f013ef09b7026b4adf90d0e805362451ca2cf1a4aaf6131f2cd6ca7b869675d599e05ce51b1c2827195f6d56bb08d54ed399b90e6ccad2de70d37812fc951b", { from: wallet1.address, value: 1000 });
        } catch (error) {
            console.log("Error handled")
            assert.equal(error.message, "VM Exception while processing transaction: reverted with reason string 'Invalid parameter'")
        }
    });

    it('if user buys nft no token allowance using token, then user will get an error', async () => {
        await MyTokenInstance.transfer(wallet1.address, 1000)
        await MyTokenInstance.approve(K4NftCarSignatureEdition1V2Instance.address, tempUser2.amount, { from: wallet1.address })
        await K4NftCarSignatureEdition1V2Instance.safeMintUsingToken(tempUser3.tokenId, MyTokenInstance.address, tempUser4.amount, tempUser3.quantity, "0xd8d9a6fddf29a0f805e67cb6d3e972ce27cdcc74c3a0785060073b019c35e7dc", "0xa2005f1e47b1335fa1ec6ee82f735d9b6238de87d7ec6e56d45b6aa1bd05b68c215127139d7a7aeb5d517e8e52178b6c7675fd362eb94b0276b7405d7a4e7cab1c", { from: wallet1.address });
        try {
            await MyTokenInstance.transfer(wallet1.address, 1000)
            await MyTokenInstance.approve(K4NftCarSignatureEdition1V2Instance.address, tempUser2.amount, { from: wallet1.address })
            await K4NftCarSignatureEdition1V2Instance.safeMintUsingToken([4, 5, 6, 7, 8, 9, 10, 11, 12, 13], MyTokenInstance.address, tempUser4.amount, 10, "0x293b1270431c45f792598348c8ab65339a8dc1cf23741ed5a7c1510aa9d8161d", "0x57c1e41aad6c4934f40623e92580913a654663b5b3aeff77b91dd91cb46a4f1944760b47e5100688549ae0066072d85bb19e2a6a5c27e6cfe646d9a2260ef7081c", { from: wallet1.address });
        } catch (error) {
            console.log("Error handled")
            assert.equal(error.message, "VM Exception while processing transaction: reverted with reason string 'Check the token allowance'")
        }
    });

    it('if owner withdraw tokens and ethers with 0 token address , then user will get an error', async () => {
        await MyTokenInstance.transfer(wallet1.address, 1000)
        await MyTokenInstance.approve(K4NftCarSignatureEdition1V2Instance.address, tempUser2.amount, { from: wallet1.address })
        await K4NftCarSignatureEdition1V2Instance.safeMintUsingToken(tempUser3.tokenId, MyTokenInstance.address, tempUser4.amount, tempUser3.quantity, "0x0c817d62055bf366dbe9f773688dd073ded3911f6e03a5c03a422e5087d63757", "0x875a4936da84590f09acffd44b76269d8b361df7d35cb15490ac88cd0f78b8b45f95fcc6468fd1e9a0ac7644c92b3658f46b491bbe4fbeb7eabee28aef5906891c", { from: wallet1.address });
        await K4NftCarSignatureEdition1V2Instance.safeMintUsingEther(tempUser3.tokenId, tempUser3.quantity, "0xbcb2194e13b73837873325c0672dd093019d7705e6f5edfc0f73a0eb61a67d99", "0x7e5254aa35731022e3ea88067ab1393154f7e71d05333d5ebf0b9a0a3b2c8aed3b6ea0a03dcf41bd6636a6f6765c95ea93e62cd96744402c00e4ab540015a8ad1b", { from: wallet1.address, value: 1000 });
        await K4NftCarSignatureEdition1V2Instance.withdrawToken(MyTokenInstance.address, accounts[3], { from: "0x90F79bf6EB2c4f870365E785982E1f101E93b906" })
        await K4NftCarSignatureEdition1V2Instance.withdraw(accounts[3], { from: "0x90F79bf6EB2c4f870365E785982E1f101E93b906" })
        try {
            await MyTokenInstance.transfer(wallet1.address, 1000)
            await MyTokenInstance.approve(K4NftCarSignatureEdition1V2Instance.address, tempUser2.amount, { from: wallet1.address })
            await K4NftCarSignatureEdition1V2Instance.safeMintUsingToken([4, 5, 6, 7, 8, 9, 10, 11, 12, 13], MyTokenInstance.address, tempUser4.amount, 10, "0xa64bd038049de62960d8016aaba7d36775063f475b938618d3e8b4bc75435c05", "0x57d3c389f203154ec222272c9d33f673e0e7780b6451f1a9fda3f06a41905cc91ff8d94dfad43bcbf14ec568088f3a46a5ae329152ae6df8479460b5eb2429ac1c", { from: wallet1.address });
            await K4NftCarSignatureEdition1V2Instance.safeMintUsingEther(tempUser3.tokenId, tempUser3.quantity, "0x7bf9891f096c2fe23cf529616f26711c1281625c38618f8f55dcb4c4bb8ee5dc", "0xe409eb70fdc7c1681853db5cc4b196f3fa668e34f7603fb3bbeeffdd55ce3de44bf782310b4fb768072156a3872a787606b666f612eac5968ee72f20f6296e631b", { from: wallet1.address, value: 1000 });
            await K4NftCarSignatureEdition1V2Instance.withdrawToken(MyTokenInstance.address, accounts[3], { from: "0x90F79bf6EB2c4f870365E785982E1f101E93b906" })
            await K4NftCarSignatureEdition1V2Instance.withdraw(accounts[3], { from: "0x90F79bf6EB2c4f870365E785982E1f101E93b906" })
        } catch (error) {
            console.log("Error handled")
            assert.equal(error.message, "VM Exception while processing transaction: reverted with reason string 'Address cannot be zero'")
        }
    });

    it('if owner withdraw tokens and ethers with non owner account , then user will get an error', async () => {
        await MyTokenInstance.transfer(wallet1.address, 1000)
        await MyTokenInstance.approve(K4NftCarSignatureEdition1V2Instance.address, tempUser2.amount, { from: wallet1.address })
        await K4NftCarSignatureEdition1V2Instance.safeMintUsingToken(tempUser3.tokenId, MyTokenInstance.address, tempUser4.amount, tempUser3.quantity, "0x758bcd705b039da17acf6fc7c5f0d9d633292cf7abd0bd5aeb2968de58c125a2", "0x88db2506fdaf2c4c0fd0db2af6d3e612950e88926d9868121b5d746149a6e48f7752223b34e4b2a1830c6ba1ae46b572fd220ec196cf969c75c4adecebf38c241c", { from: wallet1.address });
        await K4NftCarSignatureEdition1V2Instance.safeMintUsingEther(tempUser3.tokenId, tempUser3.quantity, "0x712ebdb774b586a37e0baf464a0d910289d618cfc1f6ca659dfd3a08be531674", "0xd95d1bdfc43027d1403a008a788cdad3b3e0369426da57fd6dbd29ea87e099e55b9b073cd6823ead79aef322539efcc5ba9816a7bfeb23ab8a0a3f0803a97e541c", { from: wallet1.address, value: 1000 });
        await K4NftCarSignatureEdition1V2Instance.withdrawToken(MyTokenInstance.address, accounts[3], { from: "0x90F79bf6EB2c4f870365E785982E1f101E93b906" })
        await K4NftCarSignatureEdition1V2Instance.withdraw(accounts[3], { from: "0x90F79bf6EB2c4f870365E785982E1f101E93b906" })
        try {
            await MyTokenInstance.transfer(wallet1.address, 1000)
            await MyTokenInstance.approve(K4NftCarSignatureEdition1V2Instance.address, tempUser2.amount, { from: wallet1.address })
            await K4NftCarSignatureEdition1V2Instance.safeMintUsingToken([4, 5, 6, 7, 8, 9, 10, 11, 12, 13], MyTokenInstance.address, tempUser4.amount, 10, "0x539a2c57d0d9b22ee9628f5c311e32a8d8ff9d4536aad5961de90417691e81f3", "0x677342d8322cd388708f27de291ac603bb03d77cb8e6563d37126604f5ae76be31515f37d0a4711bbdf7bfc7f5935433760bd018e086e69f9602d6cd9b7c24aa1c", { from: wallet1.address });
            await K4NftCarSignatureEdition1V2Instance.safeMintUsingEther(tempUser3.tokenId, tempUser3.quantity, "0x6ecff9f760ef816a1f9f08b5ccd5b5f6580a514fe3b2cf587b5880aa9afdc6db", "0xe8ee9fcc8086a610af68310d4db242773123a71158d2c4468d56dfa36163c622518d860893be5379a1745f58a1e6a31b1747d73b6e7d483976e3599c616b247d1c", { from: wallet1.address, value: 1000 });
            await K4NftCarSignatureEdition1V2Instance.withdrawToken(MyTokenInstance.address, accounts[3], { from: "0x90F79bf6EB2c4f870365E785982E1f101E93b906" })
            await K4NftCarSignatureEdition1V2Instance.withdraw(accounts[3], { from: "0x90F79bf6EB2c4f870365E785982E1f101E93b906" })
        } catch (error) {
            console.log("Error handled")
            assert.equal(error.message, "VM Exception while processing transaction: reverted with reason string 'Ownable: caller is not the owner'")
        }
    });

    it('if user buys nft after sale ends with directMint function, then user will get an error', async () => {
        await MyTokenInstance.transfer(wallet1.address, 1000)
        await MyTokenInstance.approve(K4NftCarSignatureEdition1V2Instance.address, tempUser2.amount, { from: wallet1.address })
        await K4NftCarSignatureEdition1V2Instance.directMint(tempUser6.tokenId, "0xfbc1c7afb9a08701cb4c8d2967bb59e0a8508230b41fd6e82fb61882406a6456", "0x0255ac8c4637d613e29de520dc1e611bc2f694880298320ea115d7d91b1c71cd4f5b7e7945293ae484adf7525dc8e0f2c8b84cb4f430d962afef46d32208514a1b", { from: '0x90F79bf6EB2c4f870365E785982E1f101E93b906' });
        try {
            // await K4NftCarSignatureEdition1V2Instance.flipSaleStatus({ from: "0x90F79bf6EB2c4f870365E785982E1f101E93b906" })
            await K4NftCarSignatureEdition1V2Instance.directMint(tempUser6.tokenId, "0x40a53c323d75615a4eca2adc786224ed3c7423a2775323130bd4002240cd4b90", "0x45633c0ea1a9e147abc6494d582c07b7c34875e674750303c6a53e28f608bd3423467abc84bbb27533ca06f8c8d8e183727f37a076fd534af7dfb08b5f9f5cfc1c", { from: '0x90F79bf6EB2c4f870365E785982E1f101E93b906' });

        } catch (error) {
            console.log("Error handled")
            assert.equal(error.message, "VM Exception while processing transaction: reverted with reason string 'Sale Inactive'")
        }
    });

    it('if user uses the same hash and signature while minting nft with directMint function, then user will get an error', async () => {
        await K4NftCarSignatureEdition1V2Instance.directMint(tempUser6.tokenId, "0x5c60f995a95069e05a2371681afb4cc2b68275a41f44b3004c9a2e0032e31bdb", "0x652bd1d2e1c720ab21ed68dbcce6587bffd760eb1747648da2df49c1cdc294e00e01b074ef9ae14007ae7eddda03f3fbd2f7d7df420be2d0f4a3ef30c0e6ecc11c", { from: '0x90F79bf6EB2c4f870365E785982E1f101E93b906' });
        try {
            await K4NftCarSignatureEdition1V2Instance.directMint(tempUser6.tokenId, "0x4936e9ad0b9592d2495dbd6f118a8dde87f5528537e9e34cc642d3687ff1916a", "0x8ae0b79a80055a56c455ebd60925359be22de5420b114a4521233db0d13ff606583367100dcc833cd7ba11c16ceb482b589a26e8f22fd1fbaea769974bd431e71b", { from: '0x90F79bf6EB2c4f870365E785982E1f101E93b906' });
        } catch (error) {
            console.log("Error handled")
            assert.equal(error.message, "VM Exception while processing transaction: reverted with reason string 'Already signature used'")
        }
    });

});
