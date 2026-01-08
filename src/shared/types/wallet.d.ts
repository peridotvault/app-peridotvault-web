export interface Eip1193Provider {
    request<T = unknown>(args: { method: string; params?: unknown[] | object }): Promise<T>;
    isMetaMask?: boolean;
    providers?: Eip1193Provider[]; // jika multiple injected providers
}
// Solana / Phantom types (minimal, sesuai yang Anda pakai)
export interface SolanaPublicKey {
    toString(): string; // base58
}

export interface PhantomSolanaProvider {
    isPhantom?: boolean;
    publicKey?: SolanaPublicKey | null;

    connect(): Promise<{ publicKey: SolanaPublicKey }>;
    disconnect(): Promise<void>;

    // Phantom signMessage: accepts Uint8Array, returns signature bytes
    signMessage(
        message: Uint8Array,
        display?: "utf8" | "hex"
    ): Promise<{ signature: Uint8Array; publicKey: SolanaPublicKey }>;
}

export interface PhantomProvider {
    solana?: PhantomSolanaProvider;
    // Anda bisa tambah ethereum/bitcoin/sui jika nanti perlu
}

declare global {
    interface Window {
        ethereum?: Eip1193Provider;
        phantom?: PhantomProvider;
        solana?: PhantomSolanaProvider;
        isPhantomInstalled?: boolean;
    }
}