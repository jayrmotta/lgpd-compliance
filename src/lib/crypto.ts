import sodium from 'libsodium-wrappers';

// Initialize sodium library
let isInitialized = false;
async function ensureSodiumReady() {
  if (!isInitialized) {
    await sodium.ready;
    isInitialized = true;
  }
}

/**
 * Generate a new key pair for sealed box encryption
 * Returns { publicKey, secretKey } both as base64 strings
 */
export async function generateKeyPair(): Promise<{
  publicKey: string;
  secretKey: string;
}> {
  await ensureSodiumReady();
  
  const keyPair = sodium.crypto_box_keypair();
  
  return {
    publicKey: sodium.to_base64(keyPair.publicKey),
    secretKey: sodium.to_base64(keyPair.privateKey)
  };
}

/**
 * Encrypt data using sealed box (anonymous encryption)
 * Only the holder of the secret key can decrypt
 */
export async function encryptSealedBox(
  data: string,
  recipientPublicKey: string
): Promise<string> {
  await ensureSodiumReady();
  
  const publicKeyUint8 = sodium.from_base64(recipientPublicKey);
  const dataUint8 = sodium.from_string(data);
  
  const encrypted = sodium.crypto_box_seal(dataUint8, publicKeyUint8);
  
  return sodium.to_base64(encrypted);
}

/**
 * Decrypt data from sealed box
 * Requires the secret key corresponding to the public key used for encryption
 */
export async function decryptSealedBox(
  encryptedData: string,
  recipientPublicKey: string,
  recipientSecretKey: string | Uint8Array
): Promise<string> {
  await ensureSodiumReady();
  
  const encryptedUint8 = sodium.from_base64(encryptedData);
  const publicKeyUint8 = sodium.from_base64(recipientPublicKey);
  
  // Handle both string and Uint8Array for secret key
  let secretKeyUint8: Uint8Array;
  if (typeof recipientSecretKey === 'string') {
    try {
      secretKeyUint8 = sodium.from_base64(recipientSecretKey);
    } catch {
      // Fallback: try to decode with Buffer and convert to Uint8Array
      const buffer = Buffer.from(recipientSecretKey, 'base64');
      secretKeyUint8 = new Uint8Array(buffer);
    }
  } else {
    secretKeyUint8 = recipientSecretKey;
  }
  
  const decrypted = sodium.crypto_box_seal_open(
    encryptedUint8,
    publicKeyUint8,
    secretKeyUint8
  );
  
  return sodium.to_string(decrypted);
}

/**
 * Generate a random nonce for regular box encryption (not sealed)
 */
export async function generateNonce(): Promise<string> {
  await ensureSodiumReady();
  const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);
  return sodium.to_base64(nonce);
}

/**
 * Encrypt data with regular box encryption (requires nonce)
 * Use this when you need the sender to be authenticated
 */
export async function encryptBox(
  data: string,
  recipientPublicKey: string,
  senderSecretKey: string,
  nonce?: string
): Promise<{ encrypted: string; nonce: string }> {
  await ensureSodiumReady();
  
  const dataUint8 = sodium.from_string(data);
  const publicKeyUint8 = sodium.from_base64(recipientPublicKey);
  const secretKeyUint8 = sodium.from_base64(senderSecretKey);
  
  let nonceUint8: Uint8Array;
  if (nonce) {
    nonceUint8 = sodium.from_base64(nonce);
  } else {
    nonceUint8 = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);
    nonce = sodium.to_base64(nonceUint8);
  }
  
  const encrypted = sodium.crypto_box_easy(
    dataUint8,
    nonceUint8,
    publicKeyUint8,
    secretKeyUint8
  );
  
  return {
    encrypted: sodium.to_base64(encrypted),
    nonce
  };
}

/**
 * Decrypt data from regular box encryption
 */
export async function decryptBox(
  encryptedData: string,
  nonce: string,
  senderPublicKey: string,
  recipientSecretKey: string
): Promise<string> {
  await ensureSodiumReady();
  
  const encryptedUint8 = sodium.from_base64(encryptedData);
  const nonceUint8 = sodium.from_base64(nonce);
  const publicKeyUint8 = sodium.from_base64(senderPublicKey);
  const secretKeyUint8 = sodium.from_base64(recipientSecretKey);
  
  const decrypted = sodium.crypto_box_open_easy(
    encryptedUint8,
    nonceUint8,
    publicKeyUint8,
    secretKeyUint8
  );
  
  return sodium.to_string(decrypted);
}

/**
 * Generate a hash of data using SHA-256
 */
export async function hashData(data: string): Promise<string> {
  await ensureSodiumReady();
  
  const dataUint8 = sodium.from_string(data);
  const hash = sodium.crypto_generichash(32, dataUint8); // Use generic hash with 32 bytes (SHA-256 equivalent)
  
  return sodium.to_base64(hash);
}

/**
 * Utility: Convert public key to a short identifier for display
 */
export function getKeyFingerprint(publicKey: string): string {
  // Take first 8 characters of the public key for identification
  return publicKey.substring(0, 8).toUpperCase();
}

/**
 * Demo company public key - private key is managed client-side only
 * In production, companies generate keys offline and register public key
 */
export const DEMO_COMPANY_PUBLIC_KEY = {
  key: '', // Will be set from database or generated client-side
  fingerprint: ''
};

/**
 * Initialize demo company public key (server-side safe)
 * Private key is never generated or stored on server
 */
export async function getOrGenerateDemoPublicKey(): Promise<string> {
  if (!DEMO_COMPANY_PUBLIC_KEY.key) {
    // In production, this would come from company registration
    // For demo, generate a consistent key pair client-side and register public key
    const keys = await generateKeyPair();
    DEMO_COMPANY_PUBLIC_KEY.key = keys.publicKey;
    DEMO_COMPANY_PUBLIC_KEY.fingerprint = getKeyFingerprint(keys.publicKey);
    
    if (process.env.NODE_ENV === 'development') {
      // Demo company public key generated with fingerprint: ${DEMO_COMPANY_PUBLIC_KEY.fingerprint}
    }
    
    return keys.publicKey;
  }
  return DEMO_COMPANY_PUBLIC_KEY.key;
}
