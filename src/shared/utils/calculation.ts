export const PowerOfTen = (decimals: number): number => {
    if (decimals <= 0) return 1;
    if (decimals > 18) return 10 ** 18; // guard against overflow
    return 10 ** decimals;
};