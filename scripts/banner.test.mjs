import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';import {join} from 'node:path';
import {renderBanner,STYLE} from './banner-style.mjs';
import {prepareArticle} from './article.mjs';
import {drawingFingerprint} from './artwork-identity.mjs';
test('each motif has substantially more than the old 41 drawing variants',()=>{
 for(const motif of STYLE.motifs)assert.equal(new Set(Array.from({length:256},(_,i)=>drawingFingerprint(renderBanner('article-'+i,motif)))).size,256);
});
test('all motifs keep the approved palette, dimensions and offline SVG constraints',()=>{
  for(const motif of STYLE.motifs) {const svg=renderBanner('example',motif);assert.match(svg,/viewBox="0 0 1440 320"/);assert.ok(!/<(?:script|text|image|foreignObject)\b|\bon\w+=|\bhref=/i.test(svg));assert.equal(svg,renderBanner('example',motif));assert.notEqual(svg,renderBanner('another-example',motif));}
  assert.throws(()=>renderBanner('../escape'));assert.throws(()=>renderBanner('example','unknown'));
});
test('new articles include a banner, remain drafts, and refuse overwrites',async()=>{
 const outputRoot=await mkdtemp(join(tmpdir(),'editorial-banner-'));
 try {const options={mode:'new',slug:'sample',title:'A useful title',description:'One problem explained.',motif:'branches',outputRoot};const result=await prepareArticle(options);const before=await readFile(result.article,'utf8');assert.match(before,/draft: true/);assert.match(before,/heroDecorative: true\nheroAlt: ""/);assert.match(await readFile(result.asset,'utf8'),/<svg/);await assert.rejects(prepareArticle(options),/exists/);assert.equal(await readFile(result.article,'utf8'),before);await assert.rejects(prepareArticle({mode:'banner',slug:'sample',outputRoot}),/already has/);}finally{await rm(outputRoot,{recursive:true,force:true});}
});
