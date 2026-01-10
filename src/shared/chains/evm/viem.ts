/* eslint-disable @typescript-eslint/no-explicit-any */
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { sepolia, baseSepolia, base, mainnet, hardhat } from "viem/chains";

// Pilih chain yang kamu pakai.
// Ganti sesuai kebutuhan (mis. baseSepolia, sepolia, base, mainnet)
export const CHAIN = hardhat;

export const publicClient = createPublicClient({
    chain: CHAIN,
    transport: http(),
});

// export function getWalletClient() {
//     if (typeof window === "undefined") return null;
//     const eth = (window as any).ethereum;
//     if (!eth) return null;

//     return createWalletClient({
//         chain: CHAIN,
//         transport: custom(eth),
//     });
// }

// export async function getConnectedAccount(): Promise<`0x${string}` | null> {
//     const walletClient = getWalletClient();
//     if (!walletClient) return null;

//     // ini akan trigger prompt connect jika belum connect
//     const [account] = await walletClient.requestAddresses();
//     return account ?? null;
// }
