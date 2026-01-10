
import { createPublicClient, http } from "viem";
import { hardhat } from "viem/chains";

export const CHAIN = hardhat;

export const publicClient = createPublicClient({
    chain: CHAIN,
    transport: http(process.env.NEXT_RPC_URL ?? "http://127.0.0.1:8545"),
});
