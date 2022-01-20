const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MintContract contract", function () {
  let BT;
  let bt;
  let MT;
  let mt;
  let MintContract;
  let mintContract;
  let owner;
  const zeroAddress = '0x0000000000000000000000000000000000000000';
  const initialMint = '100000000000000000000000000000000';
  const mintAmount = '10000000000000000';

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    [owner] = await ethers.getSigners();

    BT = await ethers.getContractFactory("AnyswapV5ERC20");
    MT = await ethers.getContractFactory("MintableToken");
    MintContract = await ethers.getContractFactory("MintContract");

    bt = await BT.deploy("Buy Token", "BT", 6, zeroAddress, owner.address);
    mt = await MT.deploy();
    mintContract = await MintContract.deploy(mt.address, bt.address);
  });

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    // `it` is another Mocha function. This is the one you use to define your
    // tests. It receives the test name, and a callback function.

    // If the callback function is async, Mocha will `await` it.
    it("Should set the right owner", async function () {
      // Expect receives a value, and wraps it in an Assertion object. These
      // objects have a lot of utility methods to assert values.

      // This test expects the owner variable stored in the contract to be equal
      // to our Signer's owner.
      expect(await bt.vault()).to.equal(owner.address);
      expect(await mt.vault()).to.equal(zeroAddress);
    });
  });

  describe("Transactions", function () {
    it("MT token Set vault", async function () {
      await mt.setVault(mintContract.address);
      expect(await mt.vault()).to.equal(mintContract.address);
    });

    it("BT token Mint", async function () {
      await bt.initVault(owner.address);
      await bt.mint( owner.address, initialMint );
      expect(await bt.balanceOf(owner.address)).to.equal(initialMint);
    });

    it("Owner approve BT", async function () {
      await bt.approve( mintContract.address, initialMint );
      expect(await bt.allowance(owner.address, mintContract.address)).to.equal(initialMint);
    });

    it("final test", async function () {
      await mt.setVault(mintContract.address);
      expect(await mt.vault()).to.equal(mintContract.address);
      
      await bt.initVault(owner.address);
      await bt.mint( owner.address, initialMint );
      expect(await bt.balanceOf(owner.address)).to.equal(initialMint);

      await bt.approve( mintContract.address, initialMint );
      expect(await bt.allowance(owner.address, mintContract.address)).to.equal(initialMint);
      
      await mintContract.mint("9");
      expect(await mt.balanceOf(owner.address)).to.equal('9000000000');

    });
    
  });
});
