/**
 * SIJAKA Cryptographic Password Hardening Module (v1.1)
 * Standard: PBKDF2-HMAC-SHA256 with Per-Credential Salt and Iteration Work Factor
 * Compatibility: Browser JS / Pure ES / Apps Script (Zero External Dependencies)
 */

// SHA-256 primitives (pure standard JavaScript implementation)
function rotr(n: number, x: number): number {
  return (x >>> n) | (x << (32 - n));
}

function ch(x: number, y: number, z: number): number {
  return (x & y) ^ (~x & z);
}

function maj(x: number, y: number, z: number): number {
  return (x & y) ^ (x & z) ^ (y & z);
}

function sigma0(x: number): number {
  return rotr(2, x) ^ rotr(13, x) ^ rotr(22, x);
}

function sigma1(x: number): number {
  return rotr(6, x) ^ rotr(11, x) ^ rotr(25, x);
}

function gamma0(x: number): number {
  return rotr(7, x) ^ rotr(18, x) ^ (x >>> 3);
}

function gamma1(x: number): number {
  return rotr(17, x) ^ rotr(19, x) ^ (x >>> 10);
}

const K = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
];

function sha256Bytes(input: Uint8Array): Uint8Array {
  const byteLength = input.length;
  const bitLength = byteLength * 8;
  const paddedLength = ((byteLength + 8 + 64) >>> 6) << 6;
  const buffer = new Uint8Array(paddedLength);
  buffer.set(input);
  buffer[byteLength] = 0x80;

  const view = new DataView(buffer.buffer);
  view.setUint32(paddedLength - 4, bitLength >>> 0, false);
  view.setUint32(paddedLength - 8, Math.floor(bitLength / 0x100000000), false);

  let h0 = 0x6a09e667;
  let h1 = 0xbb67ae85;
  let h2 = 0x3c6ef372;
  let h3 = 0xa54ff53a;
  let h4 = 0x510e527f;
  let h5 = 0x9b05688c;
  let h6 = 0x1f83d9ab;
  let h7 = 0x5be0cd19;

  const w = new Int32Array(64);

  for (let i = 0; i < paddedLength; i += 64) {
    for (let j = 0; j < 16; j++) {
      w[j] = view.getInt32(i + j * 4, false);
    }
    for (let j = 16; j < 64; j++) {
      w[j] = (gamma1(w[j - 2]) + w[j - 7] + gamma0(w[j - 15]) + w[j - 16]) | 0;
    }

    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;
    let f = h5;
    let g = h6;
    let h = h7;

    for (let j = 0; j < 64; j++) {
      const t1 = (h + sigma1(e) + ch(e, f, g) + K[j] + w[j]) | 0;
      const t2 = (sigma0(a) + maj(a, b, c)) | 0;
      h = g;
      g = f;
      f = e;
      e = (d + t1) | 0;
      d = c;
      c = b;
      b = a;
      a = (t1 + t2) | 0;
    }

    h0 = (h0 + a) | 0;
    h1 = (h1 + b) | 0;
    h2 = (h2 + c) | 0;
    h3 = (h3 + d) | 0;
    h4 = (h4 + e) | 0;
    h5 = (h5 + f) | 0;
    h6 = (h6 + g) | 0;
    h7 = (h7 + h) | 0;
  }

  const result = new Uint8Array(32);
  const resView = new DataView(result.buffer);
  resView.setInt32(0, h0, false);
  resView.setInt32(4, h1, false);
  resView.setInt32(8, h2, false);
  resView.setInt32(12, h3, false);
  resView.setInt32(16, h4, false);
  resView.setInt32(20, h5, false);
  resView.setInt32(24, h6, false);
  resView.setInt32(28, h7, false);
  return result;
}

function hmacSha256(key: Uint8Array, message: Uint8Array): Uint8Array {
  const blockSize = 64;
  let formattedKey = new Uint8Array(blockSize);
  if (key.length > blockSize) {
    const hashedKey = sha256Bytes(key);
    formattedKey.set(hashedKey);
  } else {
    formattedKey.set(key);
  }

  const oKeyPad = new Uint8Array(blockSize);
  const iKeyPad = new Uint8Array(blockSize);
  for (let i = 0; i < blockSize; i++) {
    oKeyPad[i] = formattedKey[i] ^ 0x5c;
    iKeyPad[i] = formattedKey[i] ^ 0x36;
  }

  const innerBuf = new Uint8Array(iKeyPad.length + message.length);
  innerBuf.set(iKeyPad);
  innerBuf.set(message, iKeyPad.length);
  const innerHash = sha256Bytes(innerBuf);

  const outerBuf = new Uint8Array(oKeyPad.length + innerHash.length);
  outerBuf.set(oKeyPad);
  outerBuf.set(innerHash, oKeyPad.length);
  return sha256Bytes(outerBuf);
}

const encoder = new TextEncoder();

/**
 * Standard PBKDF2 with HMAC-SHA256
 */
export function pbkdf2HmacSha256(password: string, salt: string, iterations = 10000, keyLen = 32): Uint8Array {
  const passBytes = encoder.encode(password);
  const saltBytes = encoder.encode(salt);
  const numBlocks = Math.ceil(keyLen / 32);
  const derivedKey = new Uint8Array(keyLen);

  for (let block = 1; block <= numBlocks; block++) {
    const blockIndex = new Uint8Array(4);
    new DataView(blockIndex.buffer).setUint32(0, block, false);

    const initialMessage = new Uint8Array(saltBytes.length + 4);
    initialMessage.set(saltBytes);
    initialMessage.set(blockIndex, saltBytes.length);

    let u = hmacSha256(passBytes, initialMessage);
    const uXor = new Uint8Array(u);

    for (let iter = 1; iter < iterations; iter++) {
      u = hmacSha256(passBytes, u);
      for (let k = 0; k < 32; k++) {
        uXor[k] ^= u[k];
      }
    }

    const start = (block - 1) * 32;
    const count = Math.min(32, keyLen - start);
    derivedKey.set(uXor.subarray(0, count), start);
  }

  return derivedKey;
}

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
}

/**
 * Cryptographically Secure Constant-Time Comparison
 * Prevents timing attacks on password verification
 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * Structured PBKDF2 password verifier generator
 * Format: PBKDF2$SHA256$iterations$salt$hash
 */
export function createPasswordHash(password: string, salt?: string, iterations = 10000): string {
  const selectedSalt = salt || generateSalt();
  const derived = pbkdf2HmacSha256(password, selectedSalt, iterations, 32);
  const hexHash = bytesToHex(derived);
  return `PBKDF2$SHA256$${iterations}$${selectedSalt}$${hexHash}`;
}

export function generateSalt(length = 16): string {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const arr = new Uint8Array(length);
    crypto.getRandomValues(arr);
    return bytesToHex(arr);
  }
  // Fallback for non-browser environment
  let s = '';
  for (let i = 0; i < length; i++) {
    s += Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  }
  return s.toUpperCase();
}

/**
 * Verifies a plaintext password against a stored verifier.
 * Supports standard PBKDF2 and backward-compatible legacy hash.
 */
export function verifyPassword(plainPassword: string, storedHash: string): boolean {
  if (!plainPassword || !storedHash) return false;

  // Format: PBKDF2$SHA256$iterations$salt$hash
  if (storedHash.startsWith('PBKDF2$SHA256$')) {
    const parts = storedHash.split('$');
    if (parts.length === 5) {
      const iterations = parseInt(parts[2], 10);
      const salt = parts[3];
      const targetHash = parts[4];
      const derived = pbkdf2HmacSha256(plainPassword, salt, iterations, 32);
      const derivedHex = bytesToHex(derived);
      return timingSafeEqual(derivedHex, targetHash);
    }
  }

  // Legacy FNV-1a 32-bit fallback check (marked for backward-compatibility only)
  if (storedHash.startsWith('SH256-')) {
    let hash = 0x811c9dc5;
    for (let i = 0; i < plainPassword.length; i++) {
      hash ^= plainPassword.charCodeAt(i);
      hash = Math.imul(hash, 0x01000193);
    }
    const legacyDigest = 'SH256-' + ('0000000' + (hash >>> 0).toString(16)).slice(-8).toUpperCase();
    return timingSafeEqual(legacyDigest, storedHash);
  }

  return false;
}
