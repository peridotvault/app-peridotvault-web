import { Category } from "./category.type";
export type Timestamp = string;

export interface Game {
    game_id: string,
    name: string,
    description: string,
    required_age: number,
    price: number,
    cover_vertical_image: string,
    cover_horizontal_image: string,
    banner_image: string,
    is_published: boolean,
    release_date: number,
    draft_status: string,
    created_at: string,
    updated_at: string,
    categories: string[],
    tags: string[],
    previews: GamePreview[]
    distributions: GameDistribution[],
    chains?: Array<ChainType>;
    game_onchain_publishes?: Array<GameOnChainPublish>;
}

export type GameDistribution =
    | { web: WebBuild }
    | { native: NativeBuild };


export interface WebBuild {
    url: string;
    memory: number;
    graphics: string;
    additionalNotes: string;
    storage: number;
    processor: string;
}

export interface NativeBuild {
    os: string;
    memory: number;
    graphics: string;
    additionalNotes: string;
    storage: number;
    manifests: Array<Manifest>;
    processor: string;
    liveVersion?: string;
}

export type Manifest = {
    listing: string;
    createdAt: Timestamp;
    size_bytes: number;
    version: string;
    storageRef: StorageRef;
    checksum: string;
    status?: string;
}

export type StorageRef =
    | { s3: { bucket: string; basePath: string } }
    | { url: { url: string } }
    | { ipfs: { cid: string; path: string } };

/* ======================================================
   BANNER
====================================================== */
export interface GameBanner {
    game_id: string,
    name: string,
    description: string,
    banner_image: string,
}

/* ======================================================
   MEDIA
====================================================== */
export type GamePreview =
    | { kind: 'image'; src: string }
    | { kind: 'video'; src: string };

/* ======================================================
   PUBLISHED
====================================================== */
export interface GameCard {
    game_id: string,
    name: string,
    price: number,
    cover_vertical_image: string,
    cover_horizontal_image: string,
    categories: Category[];
    chains: ChainType[] | undefined;
}

/* ======================================================
   BLOCKCHAIN
====================================================== */
export interface ChainType {
    caip_2_id: string;
    name: string;
    icon_url?: string;
    native_symbol?: string;
    is_testnet?: boolean;
    namespace?: string;
    reference?: string;
}

export interface GameOnChainPublish {
    id: string;
    game_id: string;
    caip_2_id?: string;
    publish_version: number;
    pgc1_address: `0x${string}`;
    publish_tx_hash: string;
    payment_token: `0x${string}`;
    token_uri_1155?: string;
    contract_meta_uri?: string;
    max_supply: string;
    published_at: string;
}
