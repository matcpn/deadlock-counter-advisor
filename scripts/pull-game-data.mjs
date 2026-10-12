import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, rename } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { normalizeGameData, diffGameData } from '../src/domain/game-data.ts';

const root = fileURLToPath(new URL('../', import.meta.url));
const api = 'https://api.deadlock-api.com/v1/assets';
const args = process.argv.slice(2);
if (args.length && !(args.length === 2 && args[0] === '--version' && /^\d+$/.test(args[1]))) throw new Error('Usage: npm run data:pull -- [--version 6774]');
async function fetchJson(url) {
  const response = await fetch(url, {signal:AbortSignal.timeout(30000),headers:{'User-Agent':'deadlock-counter-advisor catalog importer'}});
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  const body = await response.text();
  return {url,body,value:JSON.parse(body),sha256:createHash('sha256').update(body).digest('hex')};
}
// Pin every endpoint to one client version so a hotfix during a pull cannot mix data.
const latest = args.length ? null : await fetchJson(`${api}/steam-info`);
const version = args.length ? Number(args[1]) : latest.value.client_version;
if (!Number.isSafeInteger(version) || version <= 0) throw new Error('Invalid client version');
const importedAt = new Date().toISOString();
const names = ['steam-info','heroes','items','colors'];
const results = await Promise.all(names.map(name=>fetchJson(`${api}/${name}?client_version=${version}`)));
if (results[0].value.client_version !== version) throw new Error('Source returned a different version');
const normalized = normalizeGameData(results[1].value,results[2].value,results[3].value,version,importedAt);
const currentPath = `${root}src/data/game-catalog.json`;
let before = null;
try { before=JSON.parse(await readFile(currentPath,'utf8')); } catch(error) { if(error.code!=='ENOENT') throw error; }
const report = diffGameData(before,normalized);
const manifest = {schemaVersion:1,clientVersion:version,importedAt,sourceStatus:'community-client-extraction',
  sources:results.map((r,i)=>({file:`${names[i]}.json`,url:r.url,sha256:r.sha256})),counts:normalized.counts,
  artwork:{owner:'Valve',provider:'Deadlock API asset URLs',license:'Game artwork is not covered by the API code MIT license; no ownership or endorsement claimed.'}};
const snapshot = `${root}data/snapshots/client-${version}`;
await mkdir(snapshot,{recursive:true});
for (let i=0;i<results.length;i++) {
  const path = `${snapshot}/${names[i]}.json`;
  try {
    const prior = await readFile(path,'utf8');
    if (prior !== results[i].body) throw new Error(`Pinned source changed: ${path}. Preserve snapshot and investigate before replacing it.`);
  } catch(error) { if(error.code==='ENOENT') await writeFile(path,results[i].body); else throw error; }
}
try { await writeFile(`${snapshot}/manifest.json`,JSON.stringify(manifest,null,2)+'\n',{flag:'wx'}); }
catch(error) { if(error.code!=='EEXIST') throw error; }
const changed = !before || before.clientVersion!==version || ['heroes','items'].some(k=>Object.values(report[k]).some(ids=>ids.length)) || report.colorsChanged;
// Re-running an unchanged pull does not churn timestamps or erase the last change report.
if(changed) {
  await writeFile(`${currentPath}.tmp`,JSON.stringify(normalized,null,2)+'\n');
  await rename(`${currentPath}.tmp`,currentPath);
  await writeFile(`${root}data/latest-diff.json`,JSON.stringify(report,null,2)+'\n');
}
console.log(`Client ${version}: ${normalized.counts.selectableHeroes} selectable heroes, ${normalized.items.length} shop items. ${changed?'Snapshot updated; review data/latest-diff.json.':'No catalog changes.'}`);
