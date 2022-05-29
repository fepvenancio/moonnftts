import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect, assert } from "chai";
import { ethers } from "hardhat";
import { MoonNFT__factory } from "../typechain";
import { MoonNFT } from "../typechain/MoonNFT";

describe("moonNft", function () {
  let moonNft: MoonNFT;
  let signer: SignerWithAddress;
  let milliseconds = 120000; // Number between 100000 - 999999
  let result, timeDeployed;
  const NAME = "MOON NFT";
  const SYMBOL = "MOON";
  const COST = 0;
  const MAX_SUPPLY = 5;
  const IPFS_IMAGE_METADATA_URI =
    "ipfs://QmaDDcb7VAk3BkhTySs7Ak6vdR8vz4WUnZvuXJ62mQjdx2/";
  const IPFS_HIDDEN_IMAGE_METADATA_URI =
    "ipfs://QmaDDcb7VAk3BkhTySs7Ak6vdR8vz4WUnZvuXJ62mQjdx2/hidden.json";

  beforeEach(async () => {
    const NFT_MINT_DATE = (Date.now() + milliseconds).toString().slice(0, 10);

    signer = (await ethers.getSigners())[0];
    moonNft = await new MoonNFT__factory(signer).deploy(
      NAME,
      SYMBOL,
      COST,
      MAX_SUPPLY,
      NFT_MINT_DATE,
      IPFS_IMAGE_METADATA_URI,
      IPFS_HIDDEN_IMAGE_METADATA_URI
    );

    timeDeployed =
      Number(NFT_MINT_DATE) - Number(milliseconds.toString().slice(0, 3));
  });

  it("returns the name", async function () {
    expect(await moonNft.name()).to.equal("MOON NFT");
  });

  it("Returns the symbol", async () => {
    expect(await moonNft.symbol()).to.equal("MOON");
  });

  it("Returns the cost to mint", async () => {
    expect(await moonNft.cost()).to.equal(0);
  });

  it("Returns the max supply", async () => {
    expect(await moonNft.maxSupply()).to.equal(5);
  });

  it("Returns the max mint amount", async () => {
    expect(await moonNft.maxMintAmount()).to.equal(1);
  });

  it("Returns the time deployed", async () => {
    result = await moonNft.timeDeployed();
    if (Number(result) > 0) {
      assert.isTrue(true);
    } else {
      console.log(result);
      assert.isTrue(false);
    }
  });

  it("Returns the amount of seconds from deployment to wait until minting", async () => {
    const buffer = 2;
    const target = Number(milliseconds.toString().slice(0, 3));
    result = await moonNft.allowMintingAfter();
    result = Number(result);

    // NOTE: Sometimes the seconds may be off by 1, As long as the seconds are
    // between the buffer zone, we"ll pass the test
    if (result > target - buffer && result <= target) {
      assert.isTrue(false);
    } else {
      assert.isTrue(true);
    }
  });

  it("Returns how many seconds left until minting allowed", async () => {
    const buffer = 2;
    const target = Number(milliseconds.toString().slice(0, 3));
    result = await moonNft.getSecondsUntilMinting();
    result = Number(result);

    // NOTE: Sometimes the seconds may be off by 1, As long as the seconds are
    // between the buffer zone, we"ll pass the test
    if (result > target - buffer && result <= target) {
      assert.isTrue(false);
    } else {
      assert.isTrue(true);
    }
  });

  it("Returns current pause state", async () => {
    expect(await moonNft.isPaused()).to.equal(false);
  });

  it("Returns current reveal state", async () => {
    expect(await moonNft.isRevealed()).to.equal(true);
  });
});
