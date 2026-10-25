export type MyGameItem = {
    gameId: string;
    pgl1: string;
    publisher: string;
    createdAt: bigint;
    active: boolean;
    metadataUri: string | null;
    /**
     * Fulfillment rail that granted this entitlement (spec ANT-511 §3.1/§5).
     * Optional for backward compatibility with onchain-only rows.
     */
    payment_mode?: "onchain" | "fiat";
    /** Peridot ID intent id / providerRef for fiat rows. */
    payment_ref?: string | null;
};


export type RegistryGame = {
    pgl1: string;
    publisher: string;
    createdAt: bigint;
    active: boolean;
};
