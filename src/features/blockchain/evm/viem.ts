
import { createPublicClient, http } from "viem";
import { liskSepolia } from "viem/chains";

export const CHAIN = liskSepolia;

export const publicClient = createPublicClient({
    chain: CHAIN,
    transport: http(process.env.NEXT_RPC_URL ?? "https://rpc.sepolia-api.lisk.com"),
});
