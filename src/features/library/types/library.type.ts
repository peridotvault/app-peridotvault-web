export type MyGameItem = {
    gameId: string;
    pgc1: string;
    publisher: string;
    createdAt: bigint;
    active: boolean;
    metadataUri: string | null;
};


export type RegistryGame = {
    pgc1: string;
    publisher: string;
    createdAt: bigint;
    active: boolean;
};
