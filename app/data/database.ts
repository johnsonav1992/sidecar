import { chmodSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

import { loadMigrations } from 'remix/data-table/migrations/node';
import { createSqliteDatabase } from 'remix/data-table/sqlite';

const dataDirectory = resolve(process.env.SIDECAR_DATA_DIR ?? './tmp/sidecar');
const databasePath = join(dataDirectory, 'sidecar.sqlite');

mkdirSync(dirname(databasePath), { recursive: true, mode: 0o700 });

export const database = createSqliteDatabase({
  filename: databasePath,
  foreignKeys: true
});

await database.migrate(await loadMigrations(resolve(import.meta.dirname, 'migrations')));
chmodSync(dataDirectory, 0o700);
chmodSync(databasePath, 0o600);
