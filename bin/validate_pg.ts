import { pickBy } from 'lodash-es';
import path from 'path';
import { Client } from 'pg';
import { CacheHitStatus, getCacheStatus, rootDir } from './utils';
import { readFileIfExists } from './utils/fs';

const migrationDir = path.resolve(rootDir, './server/db/migrations');

async function* loadScripts (): AsyncGenerator<{ path: string; content: string; }> {
  const migrationStatus = await getCacheStatus(migrationDir, 'migrations_cache.json', { shouldPersist: true });
  const missedScripts = pickBy(migrationStatus, (value) => value === CacheHitStatus.MISS);

  for (const relpath of Object.keys(missedScripts)) {
    const scriptDir = path.resolve(migrationDir, relpath);
    const fileContent = readFileIfExists(scriptDir);
    if (fileContent !== undefined) {
      yield { path: scriptDir, content: fileContent };
    }
  }
}

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgres://postgres:@localhost:5432/ci',
  });
  await client.connect();

  const scriptIter = loadScripts();
  let script = undefined;
  while ((script = (await scriptIter.next()).value) !== undefined) {
    const { path, content } = script;
    try {
      await client.query('BEGIN');
      await client.query(content);
      await client.query('ROLLBACK');
    } catch (e) {
      console.error(`PG script at ${path} may be invalid!`);
      console.error('reported error', e);
      process.exit(1);
    }
  }

  await client.end();
}

main();
