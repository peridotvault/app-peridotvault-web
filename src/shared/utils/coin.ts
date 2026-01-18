import { IMAGE_IDR_COIN } from "../constants/image";
import { CoinDisplayInfo } from "../types/coin";
import { PowerOfTen } from "./calculation";

const DEFAULT_TOKEN: CoinDisplayInfo = {
    principal: '',
    symbol: 'IDRX',
    decimals: 8,
    logo: IMAGE_IDR_COIN,
    displayName: 'IDRX',
};

export const formatCoinAmountFromRaw = (
    value: bigint | number | string | null | undefined,
    decimals: number,
): string => {
    const numeric = subunitsToNumber(value, decimals);
    if (numeric === 0) return '0';

    const maximumFractionDigits = clampFractionDigits(decimals);
    const minimumFractionDigits = numeric > 0 && numeric < 1 ? Math.min(4, maximumFractionDigits) : 0;

    return numeric.toLocaleString('en-US', {
        minimumFractionDigits,
        maximumFractionDigits,
    });
};

export const subunitsToNumber = (
    value: bigint | number | string | null | undefined,
    decimals: number,
): number => {
    const raw = toNumber(value);
    const divisor = PowerOfTen(decimals);
    if (divisor === 0) return raw;
    return raw / divisor;
};

export const isZeroCoinAmount = (
    value: bigint | number | string | null | undefined,
    decimals: number,
): boolean => {
    return subunitsToNumber(value, decimals) <= 0;
};

export const resolveCoinInfo = (principal?: string | null): CoinDisplayInfo => {
    if (!principal) return DEFAULT_TOKEN;
    const normalized = principal.toLowerCase();
    // return TOKEN_REGISTRY[normalized] ?? { ...DEFAULT_TOKEN, principal: normalized };
    return { ...DEFAULT_TOKEN, principal: normalized };
};


const clampFractionDigits = (decimals: number): number => {
    if (decimals <= 0) return 0;
    if (decimals <= 2) return decimals;
    return Math.min(decimals, 6);
};

const toNumber = (value: bigint | number | string | null | undefined): number => {
    if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
    if (typeof value === 'bigint') return Number(value);
    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (!trimmed) return 0;
        const parsed = Number(trimmed);
        return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
};

