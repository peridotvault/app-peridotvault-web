import {
    createWalletClient,
    custom,
    type Address,
    getAddress,
    isAddress,
    zeroAddress,
} from 'viem'
import { PGC1Abi } from '../abis/abi.pgc1'
import { ERC20Abi } from '../abis/abi.erc20'
import { getViemChain } from '../viem/chain.config'
import { getPeridotRegistry } from '../contracts/contract.registry'
import { getEvmPublicClient } from '../viem'
import { useChainStore } from '@/shared/states/chain.store'
import { BuyGameInput } from '@/core/blockchain/__core__/types/purchase.type'

const LICENSE_ID = BigInt(1);

export class EvmPurchaseService {
    static async buyGame(input: BuyGameInput) {
        if (!window.ethereum) {
            throw new Error('Wallet not found')
        }

        const pgc1_address = input.pgc1_address;
        const payment_token = input.payment_token || zeroAddress;

        if (!isAddress(pgc1_address)) {
            console.error('Invalid pgc1_address:', pgc1_address);
            throw new Error(`Invalid purchase contract: pgc1_address is ${pgc1_address}`);
        }
        if (!isAddress(payment_token)) {
            console.error('Invalid payment_token:', payment_token);
            throw new Error(`Invalid payment token: payment_token is ${payment_token}`);
        }

        /* ================= SETUP ================= */

        const chainKey = input.chainKey ?? useChainStore.getState().chainKey

        const chain = getViemChain(chainKey)
        const registry = getPeridotRegistry(chainKey)
        const publicClient = getEvmPublicClient(chainKey)

        const requestedPgc1 = getAddress(pgc1_address)
        const selectedPaymentToken = getAddress(payment_token)

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

        let gameId: string;
        let active = false;

        try {
            gameId = await publicClient.readContract({
                address: registry.address,
                abi: registry.abi,
                functionName: "gameIdOf",
                args: [requestedPgc1],
            }) as string

            if (!gameId) {
                throw new Error('Game not registered in registry')
            }

            const [pgc1, , , isActive] =
                (await publicClient.readContract({
                    address: registry.address,
                    abi: registry.abi,
                    functionName: 'games',
                    args: [gameId],
                })) as readonly [Address, Address, bigint, boolean]

            if (!pgc1) throw new Error('Game not registered')
            if (getAddress(pgc1) !== requestedPgc1) {
                throw new Error('Selected game does not match registry')
            }

            active = isActive;
        } catch (error) {
            if (
                error instanceof Error &&
                error.message.includes('Position') &&
                error.message.includes('out of bounds')
            ) {
                throw new Error('Registry ABI/address mismatch for selected chain')
            }

            throw error;
        }
        if (!active) throw new Error('Game inactive')

        /* ================= OWNERSHIP ================= */

        const owned = (await publicClient.readContract({
            address: requestedPgc1,
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
                address: requestedPgc1,
                abi: PGC1Abi,
                functionName: 'price',
            }) as Promise<bigint>,
            publicClient.readContract({
                address: requestedPgc1,
                abi: PGC1Abi,
                functionName: 'paymentToken',
            }) as Promise<Address>,
        ])

        /* ================= BUY ================= */
        const contractPaymentToken = getAddress(paymentToken)
        if (contractPaymentToken !== selectedPaymentToken) {
            throw new Error('Selected payment token does not match game contract')
        }

        if (contractPaymentToken === zeroAddress) {
            await publicClient.simulateContract({
                address: requestedPgc1,
                abi: PGC1Abi,
                functionName: 'buy',
                account: buyer,
                value: price,
            })

            const hash = await walletClient.writeContract({
                address: requestedPgc1,
                abi: PGC1Abi,
                functionName: 'buy',
                value: price,
                account: buyer,
            })
            
            await publicClient.waitForTransactionReceipt({ hash })
            return hash
        }

        const allowance = (await publicClient.readContract({
            address: contractPaymentToken,
            abi: ERC20Abi,
            functionName: 'allowance',
            args: [buyer, requestedPgc1],
        })) as bigint

        if (allowance < price) {
            const approvalHash = await walletClient.writeContract({
                address: contractPaymentToken,
                abi: ERC20Abi,
                functionName: 'approve',
                args: [requestedPgc1, price],
                account: buyer,
            })

            await publicClient.waitForTransactionReceipt({
                hash: approvalHash,
            })
        }

        await publicClient.simulateContract({
            address: requestedPgc1,
            abi: PGC1Abi,
            functionName: 'buy',
            account: buyer,
            value: BigInt(0),
        })

        const hash = await walletClient.writeContract({
            address: requestedPgc1,
            abi: PGC1Abi,
            functionName: 'buy',
            value: BigInt(0),
            account: buyer,
        })
        
        await publicClient.waitForTransactionReceipt({ hash })
        return hash
    }
}
