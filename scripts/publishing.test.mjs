import {test} from 'node:test';
import assert from 'node:assert/strict';
import {writeFile,readFile,unlink,access} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
test('built articles, feeds, search and sitemap exclude drafts and future posts',async()=>{
 const names=['editorial-check-published','editorial-check-draft','editorial-check-future'];
 const created=[];
 const paths=names.map(name=>new URL('../src/content/blog/'+name+'.md',import.meta.url));
 try {
  for(let i=0;i<paths.length;i++) { await writeFile(paths[i],`---\ntitle: "Editorial verification ${i}"\ndescription: "A fictional test article."\npubDate: ${i===2?'2999-01-01':'2020-01-01'}\ndraft: ${i===1}\n---\n\n## Inspect the evidence\n\nFictional publishing verification example.\n`,{flag:'wx'}); created.push(paths[i]); }
  for(const [cli,args] of [['node_modules/astro/bin/astro.mjs',['build']],['node_modules/pagefind/lib/runner/bin.cjs',['--site','dist']]]) {
   const run=spawnSync(process.execPath,[cli,...args],{cwd:root,encoding:'utf8'});
   assert.equal(run.status,0,run.stdout+'\n'+run.stderr);
  }
  const article=await readFile(new URL('../dist/blog/'+names[0]+'/index.html',import.meta.url),'utf8');
  assert.equal((article.match(/aria-label="Author sign-off"/g) ?? []).length,1); assert.match(article,/alt="Matt Cochran"/); assert.match(article,/data-pagefind-body/);assert.match(article,/BlogPosting/);
  assert.match(article,/https:\/\/cochranweb.com\/blog\/editorial-check-published\//);
  assert.match(article,/article:published_time/);assert.match(article,/href="#inspect-the-evidence"/);
  const outputs=await Promise.all(['blog/index.html','rss.xml','sitemap-0.xml'].map(p=>readFile(new URL('../dist/'+p,import.meta.url),'utf8')));
  for(const text of outputs) {assert.ok(text.includes(names[0]));assert.ok(!text.includes(names[1]));assert.ok(!text.includes(names[2]));}
  for(const name of names.slice(1)) await assert.rejects(access(new URL('../dist/blog/'+name+'/index.html',import.meta.url)));
  await access(new URL('../dist/pagefind/pagefind.js',import.meta.url));
  const robots=await readFile(new URL('../dist/robots.txt',import.meta.url),'utf8');assert.match(robots,/Sitemap: https:\/\/cochranweb.com\/sitemap-index.xml/);
 } finally {for(const path of created) await unlink(path).catch(e=>{if(e.code!=='ENOENT') throw e;});}
});
