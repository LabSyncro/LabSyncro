import fs from 'fs';

export function mkdirIfNotExists(path: string) {
  try {
    fs.mkdirSync(path, { recursive: true });
  }
  catch {}
}

export function readFileIfExists(path: string): string | undefined {
  try {
    return fs.readFileSync(path, { encoding: 'utf8' });
  }
  catch {
    return undefined;
  }
}
