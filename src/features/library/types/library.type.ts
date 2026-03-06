export type MyGameItem = {
    gameId: string;
    pgc1: `0x${string}`;
    publisher: string;
    createdAt: bigint;
    active: boolean;
    metadataUri: string | null;
};


export type RegistryGame = {
    pgc1: `0x${string}`;
    publisher: `0x${string}`;
    createdAt: bigint;
    active: boolean;
};
