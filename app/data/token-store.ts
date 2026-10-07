import type { OAuthTokens } from 'remix/auth';

export type StoredGoogleAuth = {
  email: string;
  providerAccountId: string;
  tokens: OAuthTokens;
};

export interface TokenStore {
  get(email: string): Promise<StoredGoogleAuth | null>;
  save(auth: StoredGoogleAuth): Promise<void>;
}
