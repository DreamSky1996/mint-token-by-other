require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require('@openzeppelin/hardhat-upgrades');
require("dotenv").config();
const pk_deploy = process.env.PK_DEPLOYER;
const scan_key = process.env.SCANKEY;


module.exports = {
  solidity: {
    version: "0.8.2",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    hardhat: {},
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
      chainId: 4,
      gasPrice: 8000000000,
      gas: 12450000,
      accounts: [pk_deploy],
    },
  },
  etherscan: {
    apiKey: scan_key,
  }
};
