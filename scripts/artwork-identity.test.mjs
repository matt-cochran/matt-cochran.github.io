import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {checkArtwork,drawingFingerprint} from './artwork-identity.mjs';
test('comments, titles and renamed paint IDs do not disguise reused drawings',()=>{
 const a='<svg width="20" height="20"><defs><pattern id="dots"/></defs><path fill="url(#dots)" d="M0 0H10"/></svg>';
 assert.equal(drawingFingerprint(a),drawingFingerprint('<!-- another article -->'+a.replaceAll('dots','specks')));
 assert.notEqual(drawingFingerprint(a),drawingFingerprint(a.replace('H10','H200')));
});
test('missing, shared-path and renamed duplicate banners block publication preparation',async()=>{
 const root=await mkdtemp(join(tmpdir(),'artwork-identity-'));
 try {
  const articles=join(root,'src/content/blog'),assets=join(root,'public/assets/blog');
  await mkdir(articles,{recursive:true});await mkdir(assets,{recursive:true});
  const article=(slug,hero)=>writeFile(join(articles,slug+'.md'),'---\ntitle: Example\n'+(hero?'heroImage: /assets/blog/'+hero+'.svg\n':'')+'---\nBody');
  await article('one');await assert.rejects(checkArtwork(root),/needs its own/);
  await article('one','one');await writeFile(join(assets,'one.svg'),'<svg width="20" height="20"><path stroke="black" d="M0 0H10"/></svg>');
  assert.equal((await checkArtwork(root)).length,1);
  await article('two','one');await assert.rejects(checkArtwork(root),/path reused/);
  await article('two','two');await writeFile(join(assets,'two.svg'),'<!-- renamed --><svg width="20" height="20"><path stroke="black" d="M0 0H10"/></svg>');
  await assert.rejects(checkArtwork(root),/drawing duplicates/);
  await writeFile(join(assets,'two.svg'),'<svg height="20" width="20"><path d="M0 0H10" stroke="black"/></svg>');
  await assert.rejects(checkArtwork(root),/rendered artwork duplicates/);
  await writeFile(join(assets,'two.svg'),'<svg width="20" height="20"><path stroke="black" d="M0 0H200"/></svg>');
  assert.equal((await checkArtwork(root)).length,2);
 }finally{await rm(root,{recursive:true,force:true});}
});
