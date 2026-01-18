import { ChainConfig } from "../types/chain";


export const CHAINS: Record<string, ChainConfig> = {
    ethereum: {
        id: "ethereum",
        type: "evm",
        name: "Ethereum",
        icon: "/images/chains/ethereum.svg",
    },
    base: {
        id: "base",
        type: "evm",
        name: "Base",
        icon: "/images/chains/base.svg",
    },
    lisk: {
        id: "lisk",
        type: "evm",
        name: "Lisk",
        icon: "/images/chains/lisk.svg",
    },
    solana: {
        id: "solana",
        type: "svm",
        name: "Solana",
        icon: "/images/chains/solana.svg",
    },
};
