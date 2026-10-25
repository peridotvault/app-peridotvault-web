import { Connection, PublicKey, type ParsedAccountData } from "@solana/web3.js";
import { getSvmConnection } from "../web3";

const METAPLEX_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

function getMetadataPda(mint: PublicKey): PublicKey {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("metadata"), METAPLEX_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    METAPLEX_PROGRAM_ID
  )[0];
}

function readString(data: Buffer, offset: number): { value: string; nextOffset: number } {
  const len = data.readUInt32LE(offset);
  const slice = data.subarray(offset + 4, offset + 4 + len);
  const value = slice.toString("utf8").replace(/\0/g, "").trim();
  return { value, nextOffset: offset + 4 + len };
}

function parseMetadataAccount(data: Buffer): { name: string; symbol: string; uri: string } | null {
  if (data.length < 1 + 32 + 32 + 4) return null;
  let offset = 1 + 32 + 32; // key + update_authority + mint
  const name = readString(data, offset);
  offset = name.nextOffset;
  const symbol = readString(data, offset);
  offset = symbol.nextOffset;
  const uri = readString(data, offset);
  return {
    name: name.value || "Unknown",
    symbol: symbol.value || "???",
    uri: uri.value || "",
  };
}

function getParsedMintDecimals(data: Buffer | ParsedAccountData | undefined): number {
  if (!data || Buffer.isBuffer(data)) return 0;
  const decimals = data.parsed?.info?.decimals;
  return typeof decimals === "number" ? decimals : 0;
}

export interface TokenMetadata {
  symbol: string;
  name: string;
  decimals: number;
}

/**
 * Batch-read Metaplex metadata + decimals for a list of Solana mints.
 * Returns a Map of mint address (lowercase) → TokenMetadata.
 */
export async function resolveTokenMetadata(
  mints: string[],
  connection?: Connection,
): Promise<Map<string, TokenMetadata>> {
  const result = new Map<string, TokenMetadata>();
  if (mints.length === 0) return result;

  const conn = connection ?? getSvmConnection();

  const uniqueMints = [...new Set(mints.map((m) => m.toLowerCase()))];
  const mintPubkeys = uniqueMints.map((m) => {
    try { return new PublicKey(m); } catch { return null; }
  });

  const validMints: { mint: string; pubkey: PublicKey }[] = [];
  const metadataPdas: PublicKey[] = [];

  for (let i = 0; i < mintPubkeys.length; i++) {
    const pk = mintPubkeys[i];
    if (!pk) continue;
    validMints.push({ mint: uniqueMints[i], pubkey: pk });
    metadataPdas.push(getMetadataPda(pk));
  }

  if (validMints.length === 0) return result;

  // Batch-read all metadata accounts
  const metadataAccounts = await conn.getMultipleAccountsInfo(metadataPdas, "confirmed");

  // Fetch decimals for each mint via getParsedAccountInfo
  const decimalsList = await Promise.all(
    validMints.map(async ({ pubkey }) => {
      try {
        const info = await conn.getParsedAccountInfo(pubkey, "confirmed");
        return getParsedMintDecimals(info.value?.data);
      } catch {
        return 0;
      }
    })
  );

  for (let i = 0; i < validMints.length; i++) {
    const { mint } = validMints[i];
    const decimals = decimalsList[i] ?? 0;
    const metaAccount = metadataAccounts[i];

    let symbol = mint.slice(0, 4) + "..." + mint.slice(-4);
    let name = `Token ${symbol}`;

    if (metaAccount?.data) {
      const parsed = parseMetadataAccount(metaAccount.data);
      if (parsed) {
        symbol = parsed.symbol || symbol;
        name = parsed.name || name;
      }
    }

    result.set(mint, { symbol, name, decimals });
  }

  return result;
}
