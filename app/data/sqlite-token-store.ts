import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

import type { OAuthTokens } from 'remix/auth';

import { database } from './database.ts';
import { googleAuthTable } from './google-auth-table.ts';
import type { TokenStore } from './token-store.ts';

const encryptionKey = process.env.TOKEN_ENCRYPTION_KEY;

if (!encryptionKey || !/^[a-f\d]{64}$/i.test(encryptionKey)) {
  throw new Error('TOKEN_ENCRYPTION_KEY must be a 32-byte hex-encoded key');
}

const keyBytes = Buffer.from(encryptionKey, 'hex');

const encrypt = (value: string) => {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', keyBytes, iv);
  const ciphertext = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);

  return [iv, cipher.getAuthTag(), ciphertext].map((part) => part.toString('base64url')).join('.');
};

const decrypt = (value: string) => {
  const [iv, tag, ciphertext] = value.split('.');
  if (!iv || !tag || !ciphertext) throw new Error('Stored Google tokens have an invalid format');

  const decipher = createDecipheriv('aes-256-gcm', keyBytes, Buffer.from(iv, 'base64url'));
  decipher.setAuthTag(Buffer.from(tag, 'base64url'));

  return Buffer.concat([
    decipher.update(Buffer.from(ciphertext, 'base64url')),
    decipher.final()
  ]).toString('utf8');
};

const parseTokens = (value: string): OAuthTokens => {
  const tokens = JSON.parse(decrypt(value)) as OAuthTokens & { expiresAt?: string };

  return {
    ...tokens,
    expiresAt: tokens.expiresAt ? new Date(tokens.expiresAt) : undefined
  };
};

export const sqliteTokenStore: TokenStore = {
  get: async (email) => {
    const row = await database.find(googleAuthTable, email);

    if (!row) {
      return null;
    }

    return {
      email: row.email,
      providerAccountId: row.provider_account_id,
      tokens: parseTokens(row.encrypted_tokens)
    };
  },
  save: async (auth) => {
    await database.query(googleAuthTable).upsert({
      email: auth.email,
      provider_account_id: auth.providerAccountId,
      encrypted_tokens: encrypt(JSON.stringify(auth.tokens)),
      updated_at: new Date().toISOString()
    });
  }
};
