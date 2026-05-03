export type MyGameItem = {
    gameId: string;
    pgl1: string;
    publisher: string;
    createdAt: bigint;
    active: boolean;
    metadataUri: string | null;
};


export type RegistryGame = {
    pgl1: string;
    publisher: string;
    createdAt: bigint;
    active: boolean;
};
