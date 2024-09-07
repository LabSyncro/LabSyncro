import fs from 'fs';

export function mkdirIfNotExist (path: string) {
  try {

    fs.mkdirSync(path, { recursive: true });
  } catch {}
}
