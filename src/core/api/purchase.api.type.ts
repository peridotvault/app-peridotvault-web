import { GameIdApi } from "./game.api.type"

export type BuyGameParams = {
    gameId: GameIdApi,
    purchasePrice: number,
    paymentToken: string,
    transactionHash: string,
}

export type Purchase = {
    id: number,
    gameId: GameIdApi,
    userId: number,
    purchase_rice: number,
    payment_token: string,
    status: string,
    purchased_at: string,
}
