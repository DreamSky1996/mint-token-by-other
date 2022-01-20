const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account: " + deployer.address);

  const initialMint = '10000000000000000000000000';
  const zeroAddress = '0x0000000000000000000000000000000000000000';
  const mtAddress = "0x4C9657ed39d4773f2f270A761ed356cb8a6Bb07E";
  const btAddress = "0x5E9E06d8f09c2F0bAF2FCEA7b75a1435fAdf4D83";
  // console.log("Deploy Mintable Token");

  // const MT = await ethers.getContractFactory('MintableToken');
  // const mt = await MT.deploy();
  // console.log("MT deployed on ", mt.address);

  // console.log("Deploy Buy Token");
  // const BT = await ethers.getContractFactory('AnyswapV5ERC20');
  // const bt = await BT.deploy("Buy Token", "BT", 6, zeroAddress, deployer.address);
  // console.log("BT deployed on ", bt.address);

  // await bt.initVault(deployer.address);
  // await bt.mint( deployer.address, initialMint );
  // console.log("BT minted ", initialMint);

  console.log("Deploy Main Contract Token");
  const MintContract = await ethers.getContractFactory('MintContract');
  const mintContract = await MintContract.deploy( mtAddress, btAddress);
  console.log("MintContract deployed on ", mintContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
