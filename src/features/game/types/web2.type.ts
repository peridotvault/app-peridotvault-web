/**
 * Web2 mode (optional fiat) types — PeridotVault ANT-510/ANT-513.
 *
 * Spec: ANT-511 §3 (functional requirements), §5 (DB/API contracts).
 * All fields are optional on read models so storefront keeps working when the
 * API predates `distribution_mode` (backward compatibility: default onchain).
 *
 * Contract rules (spec §5):
 * - Money amounts are strings with an explicit currency (`IDR`).
 * - `distribution_mode`: 'onchain' | 'web2' | 'both', default 'onchain'.
 * - `payment_mode`: 'onchain' | 'fiat'.
 */

export const DISTRIBUTION_MODES = ["onchain", "web2", "both"] as const;
export type DistributionMode = (typeof DISTRIBUTION_MODES)[number];

export const PAYMENT_MODES = ["onchain", "fiat"] as const;
export type PaymentMode = (typeof PAYMENT_MODES)[number];

export function isDistributionMode(value: unknown): value is DistributionMode {
  return (
    typeof value === "string" &&
    (DISTRIBUTION_MODES as readonly string[]).includes(value)
  );
}

/** Resolve effective distribution mode; unknown/absent => 'onchain' (spec §3.2 default). */
export function resolveDistributionMode(
  value: unknown,
): DistributionMode {
  return isDistributionMode(value) ? value : "onchain";
}

/** Web2-specific fields a game may carry (spec §5). All optional for back-compat. */
export interface Web2GameFields {
  distribution_mode?: DistributionMode;
  /** Fiat price in IDR minor units, as string (spec: amounts as strings). */
  fiat_price_idr?: string;
  /** Peridot ID app `client_id` / escrow mapping for the game's developer. */
  peridot_app_client_id?: string;
}

/** Web2-specific fields a purchase/library row may carry (spec §5). */
export interface Web2PurchaseFields {
  payment_mode?: PaymentMode;
  /** Peridot ID intent id / providerRef (nullable-unique on backend). */
  payment_ref?: string | null;
  /** Fiat lifecycle: pending | success | failed | cancelled. */
  fiat_status?: string | null;
}

/** A purchase row is a Web2 entitlement when `payment_mode === 'fiat'`. */
export function isWeb2Purchase(
  row: Web2PurchaseFields | null | undefined,
): boolean {
  return row?.payment_mode === "fiat";
}

/**
 * Mode-aware entitlement check (spec §3.1: library must not require
 * `transaction_hash` for web2 rows — DB entitlement is the trust anchor).
 * A row entitles download/play when it is `completed`, regardless of rail;
 * for fiat rows a missing/empty transaction hash is expected and must NOT
 * disqualify the entitlement.
 */
export function isEntitledRow(row: {
  status?: string | null;
  transactionHash?: string | null;
  transaction_hash?: string | null;
  payment_mode?: PaymentMode;
  payment_ref?: string | null;
}): boolean {
  if (row.status !== "completed") return false;
  if (isWeb2Purchase({ payment_mode: row.payment_mode })) return true;
  return Boolean(row.transactionHash ?? row.transaction_hash);
}
