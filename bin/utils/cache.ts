import { hashElement, type HashElementNode } from 'folder-hash';
import path from 'path';
import fs from 'fs';
import { rootDir } from './constants';
import { mkdirIfNotExist } from './fs';

export const cacheDir = path.resolve(rootDir, '.cache/');
mkdirIfNotExist(cacheDir);

export type Checksum = { [path: string]: string };

type RawHash = HashElementNode;

export async function checksum (pathname: string): Promise<Checksum> {
  const hash = await hashElement(pathname);
  const res = traverseHash(pathname, hash);

  return res;
}

function traverseHash (basename: string, { name, hash, children }: RawHash): Checksum {
  return {
    [path.relative(basename, name)]: hash,
    ...children?.reduce((acc, cur) => ({ ...acc, ...traverseHash(basename, cur) }), {} as Checksum) || {},
  };
}

export async function checkSumAndPersist (pathname: string, persistedName: string): Promise<Checksum> {
  const res = await checksum(pathname);
  fs.writeFileSync(path.resolve(cacheDir, persistedName), JSON.stringify(res));

  return res;
}

export const enum CacheHitStatus {
  HIT,
  MISS,
};

export type CacheStatus = { [path: string]: CacheHitStatus };


export async function getCacheStatus (pathname: string, persistedName: string, { shouldPersist = false }: { shouldPersist?: boolean }): Promise<CacheStatus> {
  const persistedDir = path.resolve(cacheDir, persistedName);
  const persistedSum = fs.existsSync(persistedDir) ? JSON.parse(fs.readFileSync(persistedDir, { encoding: 'utf8' })) as Checksum : {};
  const sum = shouldPersist ? await checkSumAndPersist(pathname, persistedName) : await checksum(pathname);

  const res = {} as CacheStatus;
  Object.keys(sum).forEach((key) => {
    res[key] = persistedSum[key] === sum[key] ? CacheHitStatus.HIT : CacheHitStatus.MISS;
  });

  return res;
}
