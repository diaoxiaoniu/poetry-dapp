require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config();

module.exports = {
  solidity: "0.8.0",
  networks: {
    hardhat: {
      chainId: 1337
    },
    sepolia: {
      url: "https://sepolia.infura.io/v3/14ebbe5b6cd540608809a8cdc4784d20",
      accounts: ["410c56d956de45edd91e1bbc7b3bf30139e461074d43d2705ca1f0e8aa95b8cc"]
    }
  },
  etherscan: {
    apiKey: "RSWY2P3Y3SUHWIGAFCHQWNNFDHE7EKSECA"
  }
}; 