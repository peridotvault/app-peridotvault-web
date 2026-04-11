import { PGC1Abi } from "@/core/blockchain/evm/abis/abi.pgc1";
import { getEvmPublicClient } from "@/core/blockchain/evm/viem";
import { getAddress, isAddress, type Hex } from "viem";
import { getPeridotRegistry, PGC1_LICENSE_ID } from "../config/game.config";
import { MyGameItem, RegistryGame } from "../types/library.type";
import { authRepo } from "@/core/db/repositories/auth.repo";
import { PublicKey } from "@solana/web3.js";
import { getSvmConnection } from "@/core/blockchain/svm/web3";
import { getSvmPgcProgramId } from "@/core/blockchain/svm/contracts/program.registry";
import { decodeLicenseAccount, decodePgcGameAccount } from "@/core/blockchain/svm/contracts/account.state";
import { getMyLibraryApi, getLibraryGameApi } from "@/core/api/library.api";
import { LibraryGameApi } from "@/core/api/library.api.type";

/* ======================================================
   ERROR CODES
====================================================== */

export const LIBRARY_ERROR_CODES = {
    MissingSession: "LIBRARY_MISSING_SESSION",
    UnsupportedAccountType: "LIBRARY_UNSUPPORTED_ACCOUNT_TYPE",
    UnsupportedChain: "LIBRARY_UNSUPPORTED_CHAIN",
    InvalidAccount: "LIBRARY_INVALID_ACCOUNT",
    RpcFailed: "LIBRARY_RPC_FAILED",
} as const;

export type LibraryErrorCode =
    (typeof LIBRARY_ERROR_CODES)[keyof typeof LIBRARY_ERROR_CODES];

export type LibraryError = Error & { code: LibraryErrorCode };

const ZERO = BigInt(0);

/* ======================================================
   HELPERS
====================================================== */
function createLibraryError(
    code: LibraryErrorCode,
    cause?: unknown
): LibraryError {
    const err = new Error(code) as LibraryError;
    err.code = code;
    err.cause = cause;
    return err;
}

function isUnsupportedChainError(error: unknown): boolean {
    if (!(error instanceof Error)) return false;

    return (
        error.message === "EVM_UNSUPPORTED_CHAIN" ||
        error.message.startsWith("EVM_REGISTRY_NOT_CONFIGURED:") ||
        error.message.startsWith("EVM_INVALID_REGISTRY_ADDRESS:")
    );
}

function parseRegistryGame(value: unknown): RegistryGame | null {
    if (!Array.isArray(value)) return null;

    const [pgc1, publisher, createdAt, active] = value;

    if (
        typeof pgc1 !== "string" ||
        typeof publisher !== "string" ||
        !isAddress(pgc1) ||
        !isAddress(publisher)
    ) {
        return null;
    }

    return {
        pgc1: getAddress(pgc1),
        publisher: getAddress(publisher),
        createdAt:
            typeof createdAt === "bigint"
                ? createdAt
                : BigInt(createdAt ?? 0),
        active: Boolean(active),
    };
}

export function isLibraryErrorCode(value: string): value is LibraryErrorCode {
    return Object.values(LIBRARY_ERROR_CODES).includes(
        value as LibraryErrorCode
    );
}

/* ======================================================
   CORE — ENUMERATION-BASED
====================================================== */

export async function getMyGames(user: string): Promise<MyGameItem[]> {
    if (!isAddress(user)) {
        throw createLibraryError(LIBRARY_ERROR_CODES.InvalidAccount);
    }

    const address = getAddress(user);
    const publicClient = getEvmPublicClient();
    const registry = getPeridotRegistry();

    try {
        const gameCount = (await publicClient.readContract({
            ...registry,
            functionName: "gameCount",
        })) as bigint;

        if (gameCount === ZERO) return [];

        /* ======================================================
           STEP 1 — GET ALL GAME IDS
        ====================================================== */

        const gameIdResults = await publicClient.multicall({
            contracts: Array.from({ length: Number(gameCount) }).map(
                (_, i) => ({
                    ...registry,
                    functionName: "gameIdAt",
                    args: [BigInt(i)],
                })
            ),
            allowFailure: true,
        });

        const gameIds: string[] = [];

        for (const result of gameIdResults) {
            if (
                result.status === "success" &&
                typeof result.result === "string" &&
                result.result.length > 0
            ) {
                gameIds.push(result.result);
            }
        }

        if (gameIds.length === 0) return [];

        /* ======================================================
           STEP 2 — GET GAME STRUCTS
        ====================================================== */

        const gameStructResults = await publicClient.multicall({
            contracts: gameIds.map((id) => ({
                ...registry,
                functionName: "games",
                args: [id],
            })),
            allowFailure: true,
        });

        const parsedGames: Array<{
            gameId: string;
            pgc1: string;
            publisher: string;
            createdAt: bigint;
            active: boolean;
        }> = [];

        for (let i = 0; i < gameStructResults.length; i++) {
            const result = gameStructResults[i];

            if (result.status !== "success") continue;

            const parsed = parseRegistryGame(result.result);
            if (!parsed) continue;

            parsedGames.push({
                gameId: gameIds[i],
                ...parsed,
            });
        }

        if (parsedGames.length === 0) return [];

        /* ======================================================
           STEP 3 — BALANCE CHECK
        ====================================================== */

        const balanceResults = await publicClient.multicall({
            contracts: parsedGames.map((g) => ({
                address: g.pgc1 as Hex,
                abi: PGC1Abi,
                functionName: "balanceOf",
                args: [address, PGC1_LICENSE_ID],
            })),
            allowFailure: true,
        });

        const ownedGames: typeof parsedGames = [];

        for (let i = 0; i < balanceResults.length; i++) {
            const result = balanceResults[i];

            if (result.status !== "success") continue;

            const balance = result.result as bigint;

            if (balance > ZERO) {
                ownedGames.push(parsedGames[i]);
            }
        }

        if (ownedGames.length === 0) return [];

        /* ======================================================
   STEP 4 — CONTRACT METADATA (HEAD VERSION)
====================================================== */

        const contractMetaVersionResults = await publicClient.multicall({
            contracts: ownedGames.map((g) => ({
                address: g.pgc1 as Hex,
                abi: PGC1Abi,
                functionName: "contractMetaHeadVersion",
            })),
            allowFailure: true,
        });

        type MetadataCommit = {
            hash: Hex;
            parentHash: Hex;
            timestamp: bigint;
            uri: string;
        };

        const metadataContracts: {
            address: Hex;
            abi: typeof PGC1Abi;
            functionName: "contractMetadataAt";
            args: [bigint];
        }[] = [];

        const metadataIndexMap: number[] = [];

        for (let i = 0; i < contractMetaVersionResults.length; i++) {
            const result = contractMetaVersionResults[i];
            if (result.status !== "success") continue;

            const versionRaw = result.result as number | bigint;
            const version =
                typeof versionRaw === "bigint"
                    ? versionRaw
                    : BigInt(versionRaw);

            if (version === ZERO) continue;

            metadataContracts.push({
                address: ownedGames[i].pgc1 as Hex,
                abi: PGC1Abi,
                functionName: "contractMetadataAt",
                args: [version - BigInt(1)], // version starts at 1
            });

            metadataIndexMap.push(i);
        }

        const metadataResults =
            metadataContracts.length > 0
                ? await publicClient.multicall({
                    contracts: metadataContracts,
                    allowFailure: true,
                })
                : [];

        /* ======================================================
           STEP 5 — MERGE RESULTS
        ====================================================== */

        const metadataUriMap = new Map<number, string | null>();

        for (let i = 0; i < metadataResults.length; i++) {
            const result = metadataResults[i];
            const gameIndex = metadataIndexMap[i];
            if (gameIndex === undefined) continue;

            if (result.status !== "success") {
                metadataUriMap.set(gameIndex, null);
                continue;
            }

            const meta = result.result as MetadataCommit;
            metadataUriMap.set(gameIndex, meta.uri);
        }

        const finalResults: MyGameItem[] = ownedGames.map((game, index) => ({
            gameId: game.gameId,
            pgc1: game.pgc1,
            publisher: game.publisher,
            createdAt: game.createdAt,
            active: game.active,
            metadataUri: metadataUriMap.get(index) ?? null,
        }));

        return finalResults;

    } catch (error) {
        if (isUnsupportedChainError(error)) {
            throw createLibraryError(LIBRARY_ERROR_CODES.UnsupportedChain, error);
        }

        throw createLibraryError(LIBRARY_ERROR_CODES.RpcFailed, error);
    }
}



/* ======================================================
   API-BASED LIBRARY (NEW)
====================================================== */

/**
 * Convert LibraryGameApi from API to MyGameItem format
 */
function convertLibraryGameToMyGameItem(libraryGame: LibraryGameApi): MyGameItem {
    return {
        gameId: libraryGame.gameId,
        pgc1: "", // Not available from API - would need to query blockchain
        publisher: "", // Not available from API
        createdAt: BigInt(new Date(libraryGame.purchasedAt).getTime()),
        active: libraryGame.game.isPublished,
        metadataUri: null, // Not available from API
    };
}

/**
 * Get user's games from Library API.
 * Falls back to blockchain queries if API fails.
 */
export async function getMyGamesFromApi(): Promise<MyGameItem[]> {
    try {
        const response = await getMyLibraryApi({ limit: 100 });
        console.log(`[Library] Fetched ${response.data.length} games from API`);
        return response.data.map(convertLibraryGameToMyGameItem);
    } catch (error) {
        console.warn("[Library] API fetch failed, falling back to blockchain:", error);
        return [];
    }
}

/**
 * Check if a specific game is in user's library via API
 */
export async function isGameInLibraryFromApi(gameId: string): Promise<boolean> {
    try {
        const game = await getLibraryGameApi(gameId);
        return game !== null;
    } catch (error) {
        console.warn("[Library] API check failed:", error);
        return false;
    }
}

/* ======================================================
   SESSION WRAPPER
====================================================== */

export async function getMyGamesForSession(): Promise<MyGameItem[]> {
    const session = await authRepo.getSession();

    if (!session) {
        throw createLibraryError(LIBRARY_ERROR_CODES.MissingSession);
    }

    // First try to get games from API
    try {
        const apiGames = await getMyGamesFromApi();
        if (apiGames.length > 0) {
            console.log(`[Library] Using ${apiGames.length} games from API`);
            return apiGames;
        }
    } catch (error) {
        console.warn("[Library] API fetch failed, using blockchain fallback");
    }

    // Fallback to blockchain queries
    const accountType = session.account_type?.toLowerCase();

    if (accountType === "svm") {
        return getSvmMyGames(session.account_id);
    }

    if (accountType !== "evm") {
        throw createLibraryError(LIBRARY_ERROR_CODES.UnsupportedAccountType);
    }

    if (!isAddress(session.account_id)) {
        throw createLibraryError(LIBRARY_ERROR_CODES.InvalidAccount);
    }

    return getMyGames(session.account_id);
}

/**
 * Fetch and sync Solana games
 */
async function getSvmMyGames(accountId: string): Promise<MyGameItem[]> {
    try {
        const connection = getSvmConnection();
        const pgcProgramId = getSvmPgcProgramId();
        const userPubkey = new PublicKey(accountId);

        // Get all License accounts owned by the user
        const accounts = await connection.getProgramAccounts(pgcProgramId, {
            filters: [
                {
                    memcmp: {
                        offset: 8, // owner field offset (account.state decoder logic)
                        bytes: userPubkey.toBase58(),
                    },
                },
            ],
        });

        if (accounts.length === 0) return [];

        const ownedGames: MyGameItem[] = [];

        for (const { pubkey, account } of accounts) {
            try {
                const license = decodeLicenseAccount(account.data);
                const gamePda = license.game;

                // Fetch PGC Game Account to get metadataUri
                const gameAccountInfo = await connection.getAccountInfo(gamePda);
                if (!gameAccountInfo) continue;

                const pgcGame = decodePgcGameAccount(gameAccountInfo.data);

                ownedGames.push({
                    gameId: pgcGame.gameId,
                    pgc1: gamePda.toBase58(),
                    publisher: pgcGame.publisher.toBase58(),
                    createdAt: pgcGame.createdAt,
                    active: true,
                    metadataUri: pgcGame.metadataUri,
                });
            } catch (e) {
                console.error(
                    `[Library] Failed to decode SVM license ${pubkey.toBase58()}:`,
                    e
                );
            }
        }

        return ownedGames;
    } catch (error) {
        console.error("[Library] SVM Fetch failed:", error);
        throw createLibraryError(LIBRARY_ERROR_CODES.RpcFailed);
    }
}
