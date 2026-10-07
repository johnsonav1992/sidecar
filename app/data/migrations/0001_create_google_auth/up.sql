CREATE TABLE google_auth (
  email TEXT PRIMARY KEY NOT NULL,
  provider_account_id TEXT NOT NULL,
  encrypted_tokens TEXT NOT NULL,
  updated_at TEXT NOT NULL
) STRICT;
