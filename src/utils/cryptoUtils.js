const crypto = require('crypto');
require('dotenv').config();

const algorithm = 'aes-256-cbc';
const key = process.env.ENCRYPTION_KEY 
  ? Buffer.from(process.env.ENCRYPTION_KEY, 'hex') 
  : crypto.randomBytes(32); // Fallback for testing if env is missing

// 16 bytes IV length for AES
const ivLength = 16;

/**
 * Encrypts a plaintext string using AES-256-CBC.
 * @param {string} text - The plaintext to encrypt.
 * @returns {string} - The initialization vector and encrypted data, hex encoded.
 */
function encrypt(text) {
  if (!text) return text;
  
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // Return the IV and encrypted text joined by a colon
  return iv.toString('hex') + ':' + encrypted;
}

/**
 * Decrypts an encrypted string using AES-256-CBC.
 * @param {string} text - The encrypted text format (iv:encryptedData).
 * @returns {string} - The decrypted plaintext.
 */
function decrypt(text) {
  if (!text) return text;
  
  const textParts = text.split(':');
  if (textParts.length !== 2) {
    // Return original if it doesn't match the format (might not be encrypted)
    return text;
  }

  const iv = Buffer.from(textParts[0], 'hex');
  const encryptedText = Buffer.from(textParts[1], 'hex');
  
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

module.exports = {
  encrypt,
  decrypt
};
