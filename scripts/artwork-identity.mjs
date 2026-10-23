import {createHash} from 'node:crypto';
import {readFile,readdir} from 'node:fs/promises';
import {resolve,relative,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

// Compare the drawing, not filenames, comments, metadata or a renamed paint ID.
export function drawingFingerprint(svg) {
  let drawing=svg.replace(/<!--[\s\S]*?-->|<(?:title|desc|metadata)\b[^>]*>[\s\S]*?<\/(?:title|desc|metadata)>/gi,'');
  const ids=[...drawing.matchAll(/\bid=["']([^"']+)["']/g)].map(m=>m[1]);
  for(const [i,id] of ids.entries()) drawing=drawing.replaceAll(`id="${id}"`,`id="paint${i}"`).replaceAll(`url(#${id})`,`url(#paint${i})`);
  return createHash('sha256').update(drawing.replace(/\s+/g,' ').replace(/>\s+</g,'><').trim()).digest('hex');
}

export async function checkArtwork(root) {
  const articles=resolve(root,'src/content/blog'), seenPaths=new Map(),seenDrawings=new Map(),seenPixels=new Map(),records=[];
  async function list(dir) {
    const files=[];
    for(const entry of await readdir(dir,{withFileTypes:true})) {
      const path=resolve(dir,entry.name);
      if(entry.isSymbolicLink())throw Error('Article symlinks require explicit review');
      if(entry.isDirectory())files.push(...await list(path));
      else if(/\.mdx?$/.test(entry.name))files.push(relative(articles,path));
    }
    return files;
  }
  for(const file of (await list(articles)).sort()) {
    const text=await readFile(resolve(articles,file),'utf8');
    const front=text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if(!front)throw Error(`${file}: missing frontmatter`);
    const matches=[...front[1].matchAll(/^heroImage:\s*['"]?(\/assets\/blog\/[a-z0-9-]+\.svg)['"]?\s*$/gm)];
    if(matches.length!==1)throw Error(`${file}: needs its own local SVG banner`);
    const hero=matches[0][1];
    if(seenPaths.has(hero))throw Error(`${file}: banner path reused by ${seenPaths.get(hero)}`);
    seenPaths.set(hero,file);
    const asset=resolve(root,'public'+hero),svg=await readFile(asset,'utf8');
    if(/<(?:script|foreignObject|image|text)\b|\bon\w+\s*=|\bhref\s*=/i.test(svg))throw Error(`${file}: unsafe or unsupported SVG`);
    const hash=drawingFingerprint(svg);
    if(seenDrawings.has(hash))throw Error(`${file}: drawing duplicates ${seenDrawings.get(hash)} despite a different filename`);
    seenDrawings.set(hash,file);
    const pixels=await sharp(Buffer.from(svg)).resize(360,80,{fit:'fill'}).ensureAlpha().raw().toBuffer();
    const pixelHash=createHash('sha256').update(pixels).digest('hex');
    if(seenPixels.has(pixelHash))throw Error(`${file}: rendered artwork duplicates ${seenPixels.get(pixelHash)}`);
    seenPixels.set(pixelHash,file);
    records.push({article:file,artwork:hero,drawing_sha256:hash,thumbnail_sha256:pixelHash});
  }
  return records;
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  try {const rows=await checkArtwork(resolve(dirname(fileURLToPath(import.meta.url)),'..'));console.log(JSON.stringify({unique_article_artworks:rows.length,articles:rows},null,2));}
  catch(e){console.error(e.message);process.exitCode=1;}
}
