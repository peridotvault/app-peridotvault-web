export { hexToBytes, bytesToHex, randomBytes, utf8ToBytes } from "@noble/hashes/utils.js";

export function bytesToBase64(bytes: Uint8Array): string {
    let binary = "";
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
}

export function base64ToBytes(b64: string): Uint8Array {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
}

export function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
    const ab = new ArrayBuffer(bytes.byteLength);
    new Uint8Array(ab).set(bytes);
    return ab;
}

export function toNumberArray(u8: Uint8Array): number[] {
    return Array.from(u8);
}