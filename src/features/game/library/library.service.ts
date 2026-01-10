import { PGC1Abi } from "@/shared/chains/evm/abis/abi.pgc1";
import { getSession } from "@/features/auth/_db/db.service";
import { publicClient } from "@/shared/chains/evm/viem";
import { getAddress, isAddress, parseAbiItem, type Hex } from "viem";
import { PERIDOT_REGISTRY, PGC1_LICENSE_ID } from "./library.config";

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

function createLibraryError(code: LibraryErrorCode): LibraryError {
    const err = new Error(code) as LibraryError;
    err.code = code;
    return err;
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

    // getLogs khusus event GameRegistered (no decodeEventLog, no any)
    const logs = await publicClient.getLogs({
        address: PERIDOT_REGISTRY.address,
        event: GameRegisteredEvent,
        fromBlock,
        toBlock: "latest",
    });

    const gameIds = new Set<Hex>();

    for (const log of logs) {
        // log.args typed sesuai event signature di atas
        const gid = log.args.gameId;
        if (gid !== undefined) {
            gameIds.add(gid);
        }
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
            const game = (await publicClient.readContract({
                ...PERIDOT_REGISTRY,
                functionName: "games",
                args: [gameId],
            })) as RegistryGame;

            const pgc1 = getAddress(game.pgc1);
            const publisher = getAddress(game.publisher);
            const active = game.active;

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
                    createdAt: game.createdAt,
                    active,
                });
        }

        return results;
    } catch (error) {
        throw createLibraryError(LIBRARY_ERROR_CODES.RpcFailed);
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
