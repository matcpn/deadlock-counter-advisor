import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { normalizeGameData } from '../src/domain/game-data.ts';
const root=fileURLToPath(new URL('../',import.meta.url));
const current=JSON.parse(await readFile(`${root}src/data/game-catalog.json`,'utf8'));
const directory=`${root}data/snapshots/client-${current.clientVersion}`;
const manifest=JSON.parse(await readFile(`${directory}/manifest.json`,'utf8'));
const values={};
for(const source of manifest.sources) {
  if(!['steam-info.json','heroes.json','items.json','colors.json'].includes(source.file)) throw new Error('Unexpected snapshot file');
  const body=await readFile(`${directory}/${source.file}`,'utf8');
  if(createHash('sha256').update(body).digest('hex')!==source.sha256) throw new Error(`Checksum mismatch: ${source.file}`);
  values[source.file]=JSON.parse(body);
}
if(values['steam-info.json']?.client_version!==current.clientVersion || manifest.clientVersion!==current.clientVersion) throw new Error('Version mismatch');
const regenerated=normalizeGameData(values['heroes.json'],values['items.json'],values['colors.json'],current.clientVersion,current.importedAt);
if(JSON.stringify(current)!==JSON.stringify(regenerated)) throw new Error('Generated catalog differs from raw source; rerun data:pull');
console.log(`Verified client ${current.clientVersion} snapshot checksums and generated catalog.`);
