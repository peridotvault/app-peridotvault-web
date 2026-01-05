export type Challange = {
    domain: string;          // peridotvault.com
    uri: string;             // https://peridotvault.com
    nonce: string;           // random 16-32 bytes encoded (base64url/hex)
    issuedAt: string;        // ISO
    expirationTime: string;  // ISO (issuedAt + 5min)
    statement?: string;      // optional
    version?: "1";           // optional for future-proof
}