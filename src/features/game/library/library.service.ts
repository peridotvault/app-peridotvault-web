import { PGC1Abi } from "@/shared/chains/evm/abis/abi.pgc1";
import { publicClient } from "@/shared/chains/evm/viem";
import { getAddress, parseAbiItem, type Hex } from "viem";
import { PERIDOT_REGISTRY } from "./library.config";

export type MyGameItem = {
    gameId: Hex;
    pgc1: `0x${string}`;
    publisher: string;
    active: boolean;
};

const ZERO = BigInt(0);

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
    const gameIds = await getRegisteredGamesFromLogs({ fromBlock: opts?.fromBlock });

    const results: MyGameItem[] = [];

    for (const gameId of gameIds) {
        const game = await publicClient.readContract({
            ...PERIDOT_REGISTRY,
            functionName: "games",
            args: [gameId],
        });

        const pgc1 = getAddress(game.pgc1);
        const publisher = getAddress(game.publisher);
        const active = game.active;

        // balanceOf harus return bigint kalau ABI PGC1 benar (uint256)
        const bal = await publicClient.readContract({
            address: pgc1,
            abi: PGC1Abi,
            functionName: "balanceOf",
            args: [user],
        });

        // bal typed -> bigint, jadi aman
        const owns = bal > ZERO;

        if (owns) results.push({ gameId, pgc1, publisher, active });
    }

    return results;
}
