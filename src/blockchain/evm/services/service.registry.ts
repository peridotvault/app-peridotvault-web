// src/shared/chains/evm/services/events.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AbiEvent } from "viem";
import { getPeridotRegistry } from "../contracts/contract.registry";
import { getEvmPublicClient } from "../viem";

const MAX_RANGE = BigInt(100_000);

export async function getRecentLogs<TAbiEvent extends AbiEvent>(event: TAbiEvent) {
    const publicClient = getEvmPublicClient();
    const registry = getPeridotRegistry();
    const latest = await publicClient.getBlockNumber();
    const fromBlock = latest > MAX_RANGE ? latest - MAX_RANGE : BigInt(0);

    return publicClient.getLogs({
        address: registry.address,
        event,
        fromBlock,
        toBlock: latest,
    });
}

export async function getLogsChunked<TAbiEvent extends AbiEvent>(
    event: TAbiEvent,
    fromBlock: bigint,
) {
    const publicClient = getEvmPublicClient();
    const registry = getPeridotRegistry();
    const latest = await publicClient.getBlockNumber();
    const out: any[] = [];

    let start = fromBlock;
    while (start <= latest) {
        const end = start + (MAX_RANGE - BigInt(1)) > latest ? latest : start + (MAX_RANGE - BigInt(1));

        const logs = await publicClient.getLogs({
            address: registry.address,
            event,
            fromBlock: start,
            toBlock: end,
        });

        out.push(...logs);
        start = end + BigInt(1);
    }

    return out;
}
