import { pickBy } from 'lodash-es';
import path from 'path';
import { Client } from 'pg';
import { CacheHitStatus, getCacheStatus, rootDir } from './utils';
import { readFileIfExists } from './utils/fs';

const migrationDir = path.resolve(rootDir, './server/db/migrations');

async function* loadScripts (): AsyncGenerator<string> {
  const migrationStatus = await getCacheStatus(migrationDir, 'migrations_cache.json', { shouldPersist: true });
  const missedScripts = pickBy(migrationStatus, (value) => value === CacheHitStatus.MISS);

  for (const relpath of Object.keys(missedScripts)) {
    const scriptDir = path.resolve(migrationDir, relpath);
    const fileContent = readFileIfExists(scriptDir);
    if (fileContent !== undefined) {
      yield fileContent;
    }
  }
}

const scriptIter = loadScripts();
let scriptContent = undefined;
while ((scriptContent = (await scriptIter.next()).value) !== undefined) {
}
