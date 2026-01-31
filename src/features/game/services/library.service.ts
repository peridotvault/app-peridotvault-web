import { PGC1Abi } from "@/blockchain/evm/abis/abi.pgc1";
import { getSession } from "@/features/auth/_db/db.service";
import { getEvmPublicClient } from "@/blockchain/evm/viem";
import { getAddress, isAddress, type Hex } from "viem";
import { getPeridotRegistry, PGC1_LICENSE_ID } from "../configs/game.config";

/* ======================================================
   TYPES
====================================================== */

export type MyGameItem = {
    gameId: Hex;
    pgc1: `0x${string}`;
    publisher: string;
    createdAt: bigint;
    active: boolean;
};

type RegistryGame = {
    pgc1: `0x${string}`;
    publisher: `0x${string}`;
    createdAt: bigint;
    active: boolean;
};

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
        // 1️⃣ total games
        const gameCount = (await publicClient.readContract({
            ...registry,
            functionName: "gameCount",
        })) as bigint;

        if (gameCount === ZERO) return [];

        const results: MyGameItem[] = [];

        // 2️⃣ iterate registry (ENUMERATION)
        for (let i = BigInt(0); i < gameCount; i++) {
            const gameId = (await publicClient.readContract({
                ...registry,
                functionName: "gameIdAt",
                args: [i],
            })) as Hex;

            const gameRaw = await publicClient.readContract({
                ...registry,
                functionName: "games",
                args: [gameId],
            });

            const game = parseRegistryGame(gameRaw);
            if (!game) {
                throw createLibraryError(
                    LIBRARY_ERROR_CODES.RpcFailed,
                    gameRaw
                );
            }

            const { pgc1, publisher, createdAt, active } = game;

            // 3️⃣ ownership check
            const bal = (await publicClient.readContract({
                address: pgc1,
                abi: PGC1Abi,
                functionName: "balanceOf",
                args: [address, PGC1_LICENSE_ID],
            })) as bigint;

            if (bal > ZERO) {
                results.push({
                    gameId,
                    pgc1,
                    publisher,
                    createdAt,
                    active,
                });
            }
        }

        return results;
    } catch (error) {
        if (
            error &&
            typeof error === "object" &&
            "code" in error &&
            isLibraryErrorCode(String((error as LibraryError).code))
        ) {
            throw error as LibraryError;
        }

        if (error instanceof Error && error.message === "EVM_UNSUPPORTED_CHAIN") {
            throw createLibraryError(
                LIBRARY_ERROR_CODES.UnsupportedChain,
                error
            );
        }

        console.error(error);
        throw createLibraryError(LIBRARY_ERROR_CODES.RpcFailed, error);
    }
}

/* ======================================================
   SESSION WRAPPER
====================================================== */

export async function getMyGamesForSession(): Promise<MyGameItem[]> {
    const session = await getSession();

    if (!session) {
        throw createLibraryError(LIBRARY_ERROR_CODES.MissingSession);
    }

    const accountType = session.accountType?.toLowerCase();
    if (accountType !== "evm") {
        throw createLibraryError(
            LIBRARY_ERROR_CODES.UnsupportedAccountType
        );
    }

    if (!isAddress(session.accountId)) {
        throw createLibraryError(LIBRARY_ERROR_CODES.InvalidAccount);
    }

    return getMyGames(session.accountId);
}
