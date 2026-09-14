/** Exact, hash-guarded retirement of incompatible V9 files. No recursive deletion. */
import { createHash } from 'node:crypto';
import { readFile, lstat, unlink } from 'node:fs/promises';
const files = [
 ['public/books/Mrzim-svog-brata/mrzim-svog-brata-sr.pdf','3b1ba31e94d6d4837ba6892f73adf7be7050474861d1318fcebab1b9914b7489'],
 ['public/books/Mrzim-svog-brata/mrzim-svog-brata-en.pdf','1d6925692fccf9ee750d9a4dfbd4d79c7d9e2b4285d745c912a91309f7bb8dfc'],
 ['app/loading.tsx','6fc465d78c731ec0fad5d17f6082ce2d2b9135043f1722e9ff28076de8ac76fe'],
];
for (const [relative, expected] of files) {
 const path = new URL('../'+relative,import.meta.url);
 try {
  const stat=await lstat(path);
  if(!stat.isFile() || stat.isSymbolicLink()) throw new Error('Unexpected file type: '+relative);
  const hash=createHash('sha256').update(await readFile(path)).digest('hex');
  if(hash!==expected) throw new Error('File differs from supplied V9. Preserve a backup and reconcile this file before continuing: '+relative);
  await unlink(path);
  console.log('Retired exact V9 file: '+relative);
 } catch(error) { if(error.code!=='ENOENT') throw error; }
}
