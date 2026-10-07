import { column, table } from 'remix/data-table';

export const googleAuthTable = table({
  name: 'google_auth',
  columns: {
    email: column.varchar(320).notNull(),
    provider_account_id: column.varchar(255).notNull(),
    encrypted_tokens: column.text().notNull(),
    updated_at: column.varchar(32).notNull()
  },
  primaryKey: 'email'
});
