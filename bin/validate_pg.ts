import { pickBy } from 'lodash-es';
import fs from 'fs';
import path from 'path';
import { Client } from 'pg';
import { CacheHitStatus, getCacheStatus, rootDir } from './utils';

const migrationDir = path.resolve(rootDir, './server/db/migrations');

async function* loadScripts (): AsyncGenerator<string> {
  const migrationStatus = await getCacheStatus(migrationDir, 'migrations_cache.json', { shouldPersist: true });
  const missedScripts = pickBy(migrationStatus, (value) => value === CacheHitStatus.MISS);

  for (const relpath of Object.keys(missedScripts)) {
    const scriptDir = path.resolve(migrationDir, relpath);
    try {
      yield fs.readFileSync(scriptDir, { encoding: 'utf8' });
    } catch {}
  }
}

const iter = loadScripts();
const text = await iter.next();
console.log(text);
