'use client';

// Helper to convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Helper to convert Base64 to ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// In a real-world scenario, you would use a robust key exchange mechanism like ECDH
// to derive a shared secret between the sender and recipient.
// For this demo, we'll derive a key from a simple shared string.
export async function deriveKey(secret: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        'PBKDF2',
        false,
        ['deriveKey']
    );
    return crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: encoder.encode("chrono-crypt-salt"), // Use a consistent salt
            iterations: 100000,
            hash: 'SHA-256',
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );
}

export async function encryptMessage(message: string, secret: string): Promise<string> {
  const key = await deriveKey(secret);
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encryptedData = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(message)
  );

  // Combine IV and encrypted data for storage
  const ivB64 = arrayBufferToBase64(iv);
  const encryptedB64 = arrayBufferToBase64(encryptedData);
  
  return `${ivB64}:${encryptedB64}`;
}

export async function decryptMessage(ivAndEncrypted: string, secret: string): Promise<string> {
    const key = await deriveKey(secret);
    const [ivB64, encryptedB64] = ivAndEncrypted.split(':');
    
    if (!ivB64 || !encryptedB64) {
      throw new Error("Invalid encrypted message format.");
    }

    const decoder = new TextDecoder();
    const decryptedData = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: base64ToArrayBuffer(ivB64) },
        key,
        base64ToArrayBuffer(encryptedB64)
    );
    return decoder.decode(decryptedData);
}
