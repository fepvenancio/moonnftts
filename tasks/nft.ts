import { task, types } from "hardhat/config";
import { Contract, ethers } from "ethers";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { getContract } from "../lib/contract";
import { getWallet } from "../lib/wallet";
import web3 from "web3";
import "@nomiclabs/hardhat-ethers";

task("deploy-contract", "Deploy NFT contract").setAction(async (_, hre) => {
  const IPFS_IMAGE_METADATA_URI = `ipfs://${process.env
    .IPFS_IMAGE_METADATA_CID!}/`;
  const IPFS_HIDDEN_IMAGE_METADATA_URI = `ipfs://${process.env
    .IPFS_IMAGE_METADATA_CID!}/hidden.json`;
  // eslint-disable-next-line prettier/prettier
  const NFT_MINT_DATE = new Date(process.env.NFT_MINT_DATE!).getTime().toString().slice(0, 10);
  return hre.ethers
    .getContractFactory("MoonNFT", getWallet())
    .then((moonNft) =>
      moonNft.deploy(
        process.env.PROJECT_NAME!,
        process.env.PROJECT_SYMBOL!,
        process.env.MINT_COST!,
        process.env.MAX_SUPPLY!,
        NFT_MINT_DATE,
        IPFS_IMAGE_METADATA_URI,
        IPFS_HIDDEN_IMAGE_METADATA_URI
      )
    )
    .then((result) => {
      process.stdout.write(`Contract address: ${result.address} \n`);
    });
});

task("mint", "Mint an NFT")
  .addParam("amount", "Amount to mint, Number")
  .setAction(async (taskArgs, hre) => {
    return getContract("MoonNFT", hre)
      .then((contract: Contract) => {
        return contract.mint(taskArgs.amount, {
          gasLimit: 500_000,
        });
      })
      .then((tr: TransactionResponse) => {
        process.stdout.write(`TX hash: ${tr.hash} \n`);
      });
  });