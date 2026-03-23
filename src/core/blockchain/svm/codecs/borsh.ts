import { PublicKey } from "@solana/web3.js";

const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();

export class BorshReader {
  private offset = 0;

  constructor(private readonly bytes: Uint8Array) {}

  readU8() {
    const value = this.bytes[this.offset];
    this.offset += 1;
    return value;
  }

  readBool() {
    return this.readU8() === 1;
  }

  readU16() {
    const view = new DataView(
      this.bytes.buffer,
      this.bytes.byteOffset + this.offset,
      2,
    );
    const value = view.getUint16(0, true);
    this.offset += 2;
    return value;
  }

  readU32() {
    const view = new DataView(
      this.bytes.buffer,
      this.bytes.byteOffset + this.offset,
      4,
    );
    const value = view.getUint32(0, true);
    this.offset += 4;
    return value;
  }

  readU64() {
    const view = new DataView(
      this.bytes.buffer,
      this.bytes.byteOffset + this.offset,
      8,
    );
    const value = view.getBigUint64(0, true);
    this.offset += 8;
    return value;
  }

  readPublicKey() {
    const value = this.bytes.slice(this.offset, this.offset + 32);
    this.offset += 32;
    return new PublicKey(value);
  }

  readString() {
    const length = this.readU32();
    const value = this.bytes.slice(this.offset, this.offset + length);
    this.offset += length;
    return textDecoder.decode(value);
  }

  readVec<T>(readItem: (reader: BorshReader) => T) {
    const length = this.readU32();
    return Array.from({ length }, () => readItem(this));
  }
}

export function encodeBorshString(value: string) {
  const encoded = textEncoder.encode(value);
  const length = new Uint8Array(4);
  new DataView(length.buffer).setUint32(0, encoded.length, true);

  return Buffer.concat([Buffer.from(length), Buffer.from(encoded)]);
}

export function stripAccountDiscriminator(
  data: Uint8Array,
  discriminator: number[],
  label: string,
) {
  const actual = Buffer.from(data.slice(0, discriminator.length));
  const expected = Buffer.from(discriminator);

  if (!actual.equals(expected)) {
    throw new Error(`Invalid ${label} account discriminator`);
  }

  return data.slice(discriminator.length);
}
