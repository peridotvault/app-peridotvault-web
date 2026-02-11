import {
    createPublicClient,
    createWalletClient,
    custom,
    http,
    type Address,
} from 'viem'
import { PGC1Abi } from '../abis/abi.pgc1'
import { ERC20Abi } from '../abis/abi.erc20'
import { getViemChain } from '../viem/chain.config'
import { getPeridotRegistry } from '../contracts/contract.registry'
import { useChainStore } from '@/shared/states/chain.store'

const LICENSE_ID = BigInt(1);

export class EvmPurchaseService {
    static async buyGame(input: { pgc1_address: `0x${string}`, payment_token: string }) {
        if (!window.ethereum) {
            throw new Error('Wallet not found')
        }

        /* ================= SETUP ================= */

        const { chainKey } = useChainStore.getState()

        const chain = getViemChain(chainKey)
        const registry = getPeridotRegistry(chainKey)

        const publicClient = createPublicClient({
            chain,
            transport: http(),
        })

        const walletClient = createWalletClient({
            chain,
            transport: custom(window.ethereum),
        })

        const [buyer] = await walletClient.getAddresses()

        if (!buyer) {
            throw new Error("Wallet not connected");
        }

        /* ================= ENSURE NETWORK ================= */

        try {
            await walletClient.switchChain({ id: chain.id });
        } catch {
            throw new Error("Please switch network in wallet");
        }

        /* ================= REGISTRY ================= */

        const gameId = await publicClient.readContract({
            address: registry.address,
            abi: registry.abi,
            functionName: "gameIdOf",
            args: [input.pgc1_address],
        }) as `0x${string}`

        const [pgc1, , , active] =
            (await publicClient.readContract({
                address: registry.address,
                abi: registry.abi,
                functionName: 'games',
                args: [gameId],
            })) as readonly [Address, Address, bigint, boolean]

        if (!pgc1) throw new Error('Game not registered')
        if (!active) throw new Error('Game inactive')

        /* ================= OWNERSHIP ================= */

        const owned = (await publicClient.readContract({
            address: pgc1,
            abi: PGC1Abi,
            functionName: 'balanceOf',
            args: [buyer, LICENSE_ID],
        })) as bigint

        if (owned > BigInt(0)) {
            throw new Error('Game already owned')
        }

        /* ================= PRICE ================= */

        const [price, paymentToken] = await Promise.all([
            publicClient.readContract({
                address: pgc1,
                abi: PGC1Abi,
                functionName: 'price',
            }) as Promise<bigint>,
            publicClient.readContract({
                address: pgc1,
                abi: PGC1Abi,
                functionName: 'paymentToken',
            }) as Promise<Address>,
        ])

        /* ================= BUY ================= */

        if (paymentToken === input.payment_token) {
            await publicClient.simulateContract({
                address: pgc1,
                abi: PGC1Abi,
                functionName: 'buy',
                account: buyer,
                value: price,
            })

            return walletClient.writeContract({
                address: pgc1,
                abi: PGC1Abi,
                functionName: 'buy',
                value: price,
                account: buyer,
            })
        }

        const allowance = (await publicClient.readContract({
            address: paymentToken,
            abi: ERC20Abi,
            functionName: 'allowance',
            args: [buyer, pgc1],
        })) as bigint

        if (allowance < price) {
            await walletClient.writeContract({
                address: paymentToken,
                abi: ERC20Abi,
                functionName: 'approve',
                args: [pgc1, price],
                account: buyer,
            })
        }

        return walletClient.writeContract({
            address: pgc1,
            abi: PGC1Abi,
            functionName: 'buy',
            value: BigInt(0),
            account: buyer,
        })
    }
}
