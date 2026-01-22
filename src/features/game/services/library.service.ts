import { PGC1Abi } from "@/features/blockchain/evm/abis/abi.pgc1";
import { getSession } from "@/features/auth/_db/db.service";
import { publicClient } from "@/features/blockchain/evm/viem";
import { getAddress, isAddress, parseAbiItem, type Hex } from "viem";
import { getLogsChunked } from "@/features/blockchain/evm/services/service.registry";
import { PERIDOT_REGISTRY, PGC1_LICENSE_ID } from "../configs/game.config";

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

export const LIBRARY_ERROR_CODES = {
    MissingSession: "LIBRARY_MISSING_SESSION",
    UnsupportedAccountType: "LIBRARY_UNSUPPORTED_ACCOUNT_TYPE",
    InvalidAccount: "LIBRARY_INVALID_ACCOUNT",
    RpcFailed: "LIBRARY_RPC_FAILED",
} as const;

export type LibraryErrorCode =
    (typeof LIBRARY_ERROR_CODES)[keyof typeof LIBRARY_ERROR_CODES];

export type LibraryError = Error & { code: LibraryErrorCode };

const ZERO = BigInt(0);

function createLibraryError(code: LibraryErrorCode, cause?: unknown): LibraryError {
    const err = new Error(code) as LibraryError;
    err.code = code;
    err.cause = cause;
    return err;
}

function parseRegistryGame(value: unknown): RegistryGame | null {
    if (!value) return null;

    if (Array.isArray(value)) {
        const [pgc1, publisher, createdAt, active] = value;
        if (typeof pgc1 !== "string" || typeof publisher !== "string")
            return null;
        if (!isAddress(pgc1) || !isAddress(publisher)) return null;
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

    if (typeof value === "object") {
        const game = value as Partial<RegistryGame> & {
            pgc1?: string;
            publisher?: string;
            createdAt?: bigint | number;
            active?: boolean;
        };

        if (typeof game.pgc1 !== "string" || typeof game.publisher !== "string")
            return null;
        if (!isAddress(game.pgc1) || !isAddress(game.publisher)) return null;

        return {
            pgc1: getAddress(game.pgc1),
            publisher: getAddress(game.publisher),
            createdAt:
                typeof game.createdAt === "bigint"
                    ? game.createdAt
                    : BigInt(game.createdAt ?? 0),
            active: Boolean(game.active),
        };
    }

    return null;
}

export function isLibraryErrorCode(value: string): value is LibraryErrorCode {
    return Object.values(LIBRARY_ERROR_CODES).includes(
        value as LibraryErrorCode
    );
}

// Typed event item (WAJIB cocok dengan ABI event-mu)
const GameRegisteredEvent = parseAbiItem(
    "event GameRegistered(bytes32 indexed gameId, address indexed pgc1, address indexed publisher)"
);

export async function getRegisteredGamesFromLogs(opts?: { fromBlock?: bigint }) {
    const fromBlock = opts?.fromBlock ?? ZERO;

    const logs = await getLogsChunked(GameRegisteredEvent, fromBlock);

    const gameIds = new Set<Hex>();
    for (const log of logs) {
        const gid = log.args.gameId;
        if (gid !== undefined) gameIds.add(gid);
    }

    return Array.from(gameIds);
}


export async function getMyGames(user: string, opts?: { fromBlock?: bigint }) {
    if (!isAddress(user)) {
        throw createLibraryError(LIBRARY_ERROR_CODES.InvalidAccount);
    }

    const address = getAddress(user);

    try {
        const gameIds = await getRegisteredGamesFromLogs({
            fromBlock: opts?.fromBlock,
        });

        const results: MyGameItem[] = [];

        for (const gameId of gameIds) {
            const gameRaw = await publicClient.readContract({
                ...PERIDOT_REGISTRY,
                functionName: "games",
                args: [gameId],
            });

            const game = parseRegistryGame(gameRaw);
            if (!game) {
                throw createLibraryError(LIBRARY_ERROR_CODES.RpcFailed, gameRaw);
            }

            const { pgc1, publisher, createdAt, active } = game;

            // balanceOf harus return bigint kalau ABI PGC1 benar (uint256)
            const bal = (await publicClient.readContract({
                address: pgc1,
                abi: PGC1Abi,
                functionName: "balanceOf",
                args: [address, PGC1_LICENSE_ID],
            })) as bigint;

            // bal typed -> bigint, jadi aman
            const owns = bal > ZERO;

            if (owns)
                results.push({
                    gameId,
                    pgc1,
                    publisher,
                    createdAt,
                    active,
                });
        }

        console.log("My games fetched:", results.length);

        return results;
    } catch (error) {
        console.error(error);
        throw createLibraryError(LIBRARY_ERROR_CODES.RpcFailed, error);
    }
}

export async function getMyGamesForSession(opts?: { fromBlock?: bigint }) {
    const session = await getSession();
    if (!session) {
        throw createLibraryError(LIBRARY_ERROR_CODES.MissingSession);
    }

    const accountType = session.accountType?.toLowerCase();
    if (accountType !== "evm") {
        throw createLibraryError(LIBRARY_ERROR_CODES.UnsupportedAccountType);
    }

    if (!isAddress(session.accountId)) {
        throw createLibraryError(LIBRARY_ERROR_CODES.InvalidAccount);
    }

    return getMyGames(session.accountId, opts);
}
