import { ethers } from "ethers";
import { env } from "./env";
import { getProvider } from "./provider";

export function getWallet(): ethers.Wallet {
  return new ethers.Wallet(env("DEPLOYER_PRIVATE_KEY"), getProvider());
}