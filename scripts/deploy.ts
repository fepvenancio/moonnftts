// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const IPFS_IMAGE_METADATA_URI = `ipfs://${process.env
    .IPFS_IMAGE_METADATA_CID!}/`;
  const IPFS_HIDDEN_IMAGE_METADATA_URI = `ipfs://${process.env
    .IPFS_IMAGE_METADATA_CID!}/hidden.json`;
  // eslint-disable-next-line prettier/prettier
  const NFT_MINT_DATE = new Date(process.env.NFT_MINT_DATE!).getTime().toString().slice(0, 10);

  // We get the contract to deploy
  const MoonNft = await ethers.getContractFactory("MoonNFT");
  const moonNft = await MoonNft.deploy(
    process.env.PROJECT_NAME!,
    process.env.PROJECT_SYMBOL!,
    process.env.MINT_COST!,
    process.env.MAX_SUPPLY!,
    NFT_MINT_DATE,
    IPFS_IMAGE_METADATA_URI,
    IPFS_HIDDEN_IMAGE_METADATA_URI
  );

  await moonNft.deployed();

  console.log("MoonNFT deployed to: ", moonNft.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
