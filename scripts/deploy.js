const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account: " + deployer.address);

  const initialMint = '10000000000000000000000000';
  const zeroAddress = '0x0000000000000000000000000000000000000000';
  console.log("Deploy Mintable Token");

  const MT = await ethers.getContractFactory('MintableToken');
  const mt = await MT.deploy();
  console.log("MT deployed on ", mt.address);

  console.log("Deploy Buy Token");
  const BT = await ethers.getContractFactory('AnyswapV5ERC20');
  const bt = await BT.deploy("Buy Token", "BT", 6, zeroAddress, deployer.address);
  console.log("BT deployed on ", bt.address);

  await bt.initVault(deployer.address);
  await bt.mint( deployer.address, initialMint );
  console.log("BT minted ", initialMint);

  console.log("Deploy Main NFT Token");
  const MintContract = await ethers.getContractFactory('MintContract');
  const mintContract = await MintContract.deploy( mt.address, bt.address);
  console.log("MintContract deployed on ", mintContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
