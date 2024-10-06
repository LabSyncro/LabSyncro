import path from 'path';
import fs from 'fs';
import { sortBy } from 'lodash-es';
import { Client } from 'pg';
import { rootDir } from './utils/constants';
import { readFileIfExists } from './utils/fs';

const migrationDir = path.resolve(rootDir, './db/migrations');

async function* loadScripts(): AsyncGenerator<{ path: string, content: string }> {
  const scriptDirs = sortBy(fs.readdirSync(migrationDir), (dir) => Number.parseInt(dir.split('.')[0]));

  for (const relpath of scriptDirs) {
    const scriptDir = path.resolve(migrationDir, relpath);
    const fileContent = readFileIfExists(scriptDir);
    if (fileContent !== undefined) {
      yield { path: scriptDir, content: fileContent };
    }
  }
}

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgres://postgres:secret@localhost:5432/ci',
  });
  await client.connect();

  const scriptIter = loadScripts();
  let script = undefined;
  while ((script = (await scriptIter.next()).value) !== undefined) {
    const { path, content } = script;
    try {
      await client.query(content);
    }
    catch (e) {
      console.error(`PG script at ${path} may be invalid!`);
      console.error('Reported error:');
      console.error(e);
      process.exit(1);
    }
  }

  await client.end();
}

main();
