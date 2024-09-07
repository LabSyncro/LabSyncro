import { hashElement, type HashElementNode } from 'folder-hash';

export type Checksum = { [path: string]: string };

type RawHash = HashElementNode;

export async function checksum (path: string): Promise<Checksum> {
  const hash = await hashElement(path);
  const checksum = traverseHash(hash);

  return checksum;
}

function traverseHash ({ name, hash, children }: RawHash): Checksum {
  return {
    [name]: hash,
    ...children.reduce((acc, cur) => ({ ...acc, ...traverseHash(cur) }), {} as Checksum),
  };
}
