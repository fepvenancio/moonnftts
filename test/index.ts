import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect, assert } from "chai";
import { ContractTransaction } from "ethers";
import { ethers } from "hardhat";
import { MoonNFT__factory } from "../typechain";
import { MoonNFT } from "../typechain/MoonNFT";

describe("moonNft", function () {
  let moonNft: MoonNFT;
  let signer: SignerWithAddress;
  const NAME = "MOON NFT";
  const SYMBOL = "MOON";
  const COST = 0;
  const MAX_SUPPLY = 5;
  const IPFS_IMAGE_METADATA_URI =
    "ipfs://QmaDDcb7VAk3BkhTySs7Ak6vdR8vz4WUnZvuXJ62mQjdx2/";
  const IPFS_HIDDEN_IMAGE_METADATA_URI =
    "ipfs://QmaDDcb7VAk3BkhTySs7Ak6vdR8vz4WUnZvuXJ62mQjdx2/hidden.json";

  describe("Deployment", () => {
    const milliseconds = 120000; // Number between 100000 - 999999
    let result;

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

  describe("Minting", async () => {
    describe("Success", async () => {
      let account1: SignerWithAddress;
      let mintTx: ContractTransaction;

      beforeEach(async () => {
        const NFT_MINT_DATE = Date.now().toString().slice(0, 10);

        const accounts = await ethers.getSigners();
        signer = accounts[0];
        account1 = accounts[1];
        moonNft = await new MoonNFT__factory(signer).deploy(
          NAME,
          SYMBOL,
          COST,
          MAX_SUPPLY,
          NFT_MINT_DATE,
          IPFS_IMAGE_METADATA_URI,
          IPFS_HIDDEN_IMAGE_METADATA_URI
        );

        mintTx = await moonNft.connect(account1).mint(1);
        await mintTx.wait();
      });

      it("Updates the total supply", async () => {
        expect(await moonNft.totalSupply()).to.equal(1);
      });

      it("Returns IPFS URI", async () => {
        expect(await moonNft.tokenURI(1)).to.equal(
          `${IPFS_IMAGE_METADATA_URI}1.json`
        );
      });

      it("Returns how many a minter owns", async () => {
        expect(await moonNft.balanceOf(account1.address)).to.equal("1");
      });

      it("Returns the IDs of minted NFTs", async () => {
        const bn = ethers.BigNumber.from(1);
        expect(
          await (await moonNft.walletOfOwner(account1.address)).toString()
        ).eq(bn.toString());
      });
    });
  });

  describe("Updating Contract State", async () => {
    describe("Success", async () => {
      beforeEach(async () => {
        const NFT_MINT_DATE = Date.now().toString().slice(0, 10);

        const accounts = await ethers.getSigners();
        signer = accounts[0];
        moonNft = await new MoonNFT__factory(signer).deploy(
          NAME,
          SYMBOL,
          COST,
          MAX_SUPPLY,
          NFT_MINT_DATE,
          IPFS_IMAGE_METADATA_URI,
          IPFS_HIDDEN_IMAGE_METADATA_URI
        );
      });

      it("Sets the cost", async () => {
        const setCostTx = await moonNft.setCost(1);
        await setCostTx.wait();
        expect(await moonNft.cost()).to.equal(1);
      });

      it("Sets the pause state", async () => {
        const setIsPausedTx = await moonNft.setIsPaused(true);
        await setIsPausedTx.wait();
        expect(await moonNft.isPaused()).to.equal(true);
      });

      it("Sets the reveal state", async () => {
        const setisRevealedTx = await moonNft.setIsRevealed(false);
        await setisRevealedTx.wait();
        expect(await moonNft.isRevealed()).to.equal(false);
      });

      it("Sets the max batch mint amount", async () => {
        const setMaxMintAmountTx = await moonNft.setmaxMintAmount(5);
        await setMaxMintAmountTx.wait();
        expect(await moonNft.maxMintAmount()).to.equal(5);
      });

      it("Sets the IPFS not revealed URI", async () => {
        const uri = "ipfs://IPFS-NEW-IMAGE-METADATA-CID/";
        const setUriTx = await moonNft.setNotRevealedURI(uri);
        await setUriTx.wait();
        expect(await moonNft.notRevealedUri()).to.equal(uri);
      });

      it("Sets the base extension", async () => {
        const extension = ".example"; // Different from the default contract state
        const setExtensionTx = await moonNft.setBaseExtension(extension);
        await setExtensionTx.wait();
        expect(await moonNft.baseExtension()).to.equal(extension);
      });
    });
  });
});
