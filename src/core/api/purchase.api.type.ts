
export type BuyGameParams = {
    gameId: string,
    purchasePrice: number,
    paymentToken: string,
    transactionHash: string,
}

export type Purchase = {
    id: number,
    gameId: string,
    userId: number,
    purchase_rice: number,
    payment_token: string,
    status: string,
    purchased_at: string,
}
