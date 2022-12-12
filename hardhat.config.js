require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require('hardhat-contract-sizer');

module.exports = {
  solidity: "0.8.7",
  //Testnets
  networks: {
    //BSC Testnet
    testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: ['c244b6e8ae351e71fa353515c55a4e0be82fb5bf7186c18419f89421805f74b7']
    },
    //Goerli Testnet
    goerli: {
      url: `https://goerli.infura.io/v3/681d784bc2db408b8aa49ec6b887d47a`,
      accounts: ['9549755e8d90d277f1e2494b7de07dcad85241eacf7d769b7b983992bce14542'],
    },
    //Polygon Testnet
    matic: {
      url: "https://polygon-mumbai.infura.io/v3/4458cf4d1689497b9a38b1d6bbf05e78",
      accounts: ['9549755e8d90d277f1e2494b7de07dcad85241eacf7d769b7b983992bce14542']
    }
  },

  //Mainnets
  // networks: {
  //   //BSC Mainnet
  //   mainnet: {
  //     url: "BINANCE_SMART_CHAIN_MAINNET_URL",
  //     chainId: 56,
  //     gasPrice: 20000000000,
  //     accounts: ['PRIVATE_KEY']
  //   },
  //   //Ethereum Mainnet
  //   mainnet: {
  //     url: "ETHEREUM_MAINNET_URL", // or any other JSON-RPC provider
  //     chainId: 1,
  //     accounts: ['PRIVATE_KEY']
  //   },
  //   //Polygon Mainnet
  //   polygon: {
  //     url: "Polygon_MAINNET_URL",
  //     chainId: 137,   // Replace with the chain ID for the Polygon network you want to use
  //     accounts: ['PRIVATE_KEY']
  //   }
  // },
  etherscan: {
    //polygon apiKey
    // apiKey: "61NXGEUMZJGEXU5ZTZQN8ZGHRBC8PAVSFN"
    apiKey: {
      bscTestnet: "7FH7WAR3SHRS7UDI2YZQWVR5F1SJ3PJBI2",
      goerli: "JB7KZVSGD7Z4AGJGEYITX4WY1W5V4I5D1K"
    }
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
      details: { yul: false },
    },
  },
};
