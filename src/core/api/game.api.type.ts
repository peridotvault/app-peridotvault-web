import { Timestamp } from "@/shared/types/time.type";
import { CategoryApi } from "./category.api.type";
import { ChainApi } from "./chain.api.type";

export type GameIdApi = string;
export type GameSortApi = "latest" | "price_asc" | "price_desc" | null | undefined;

/* ======================================================
   GAME API ✅
====================================================== */
export interface GameApi {
    game_id: GameIdApi,
    name: string,
    description: string,
    required_age: number,
    price: number,
    website_url?: string;
    banner_image: string,
    cover_vertical_image: string,
    cover_horizontal_image: string,
    is_published: boolean,
    release_date: number,
    draft_status: string,
    created_at: string,
    updated_at: string,
    // is_featured: boolean,
    // featured_order: null,
    status: string,
    published_at?: string;
    user_id?: string;
    // wallet_address: null,
    categories: CategoryApi[],
    chains?: Array<ChainApi>;

}

/* ======================================================
   GAME DETAIL ⚠️
====================================================== */
export interface GameDetailApi extends Omit<GameApi, "categories"> {
    categories: string[],
    tags: string[],
    previews: GamePreviewApi[]
    distributions: GameDistributionApi[],
    game_onchain_publishes?: Array<GameOnChainPublish>;

}

export type GameDistributionApi =
    | { web: WebBuildApi }
    | { native: NativeBuildApi };


export interface WebBuildApi {
    url: string;
    memory: number;
    graphics: string;
    additionalNotes: string;
    storage: number;
    processor: string;
}

export interface NativeBuildApi {
    os: string;
    memory: number;
    graphics: string;
    additionalNotes: string;
    storage: number;
    manifests: Array<ManifestApi>;
    processor: string;
    liveVersion?: string;
}

export type ManifestApi = {
    listing: string;
    createdAt: Timestamp;
    size_bytes: number;
    version: string;
    storageRef: StorageRefApi | string;
    checksum: string;
    status?: string;
}

export type StorageRefApi =
    | { s3: { bucket: string; basePath: string } }
    | { url: { url: string } }
    | { ipfs: { cid: string; path: string } };

/* ======================================================
   MEDIA ✅
====================================================== */
export type GamePreviewApi =
    | { kind: 'image'; src: string }
    | { kind: 'video'; src: string };

/* ======================================================
   BLOCKCHAIN
====================================================== */
export interface GameOnChainPublish {
    id: string;
    game_id: GameIdApi;
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
