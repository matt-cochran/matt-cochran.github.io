import {readFile,writeFile,mkdir,access,unlink} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {renderBanner,STYLE} from './banner-style.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');

export async function prepareArticle({mode,slug,title,description,motif='branches',outputRoot=root}) {
  const svg=renderBanner(slug,motif);
  if (!['new','banner'].includes(mode)) throw Error('Use new or banner.');
  const article=resolve(outputRoot,'src/content/blog',slug+'.md');
  const asset=resolve(outputRoot,'public/assets/blog',slug+'-banner.svg');
  let text;
  const header=`heroImage: /assets/blog/${slug}-banner.svg\nheroDecorative: true\nheroAlt: ""\nheroWidth: ${STYLE.width}\nheroHeight: ${STYLE.height}\n`;
  if(mode==='new') {
    if(!title?.trim()||!description?.trim()) throw Error('A new article needs --title and --description.');
    try {await access(article);throw Error('Article exists; nothing changed.');} catch(e) {if(e.code!=='ENOENT') throw e;}
    const date=new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
    text=`---\ntitle: ${JSON.stringify(title)}\ndescription: ${JSON.stringify(description)}\npubDate: ${date}\ndraft: true\ntags: []\n${header}---\n\n<!-- Draft the article from its reviewed brief. One reader problem, a concrete example, supported claims, and a useful next action. -->\n`;
  } else {
    text=await readFile(article,'utf8');
    const front=text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if(!front) throw Error('Article needs YAML frontmatter.');
    if(/^heroImage\s*:/m.test(front[1])) throw Error('Article already has a header; preserve or review it manually.');
    text=text.replace(front[0],`---\n${front[1]}\n${header}---`);
  }
  await mkdir(dirname(asset),{recursive:true});
  await mkdir(dirname(article),{recursive:true});
  // Exclusive creation preserves reviewed artwork and makes accidental reruns harmless.
  await writeFile(asset,svg,{flag:'wx'});
  try {await writeFile(article,text,{flag:mode==='new'?'wx':'w'});} catch(e) {await unlink(asset);throw e;}
  return {article,asset,motif,styleVersion:STYLE.version,published:false};
}

if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  try {
    const [mode,slug,...args]=process.argv.slice(2);const options={mode,slug};
    if(args.length%2) throw Error('Every option needs a value.');
    for(let i=0;i<args.length;i+=2) {const key=args[i].replace(/^--/,'');if(!args[i].startsWith('--')||!['title','description','motif'].includes(key)||key in options) throw Error('Unknown or repeated option.');options[key]=args[i+1];}
    console.log(JSON.stringify(await prepareArticle(options),null,2));
  } catch(e) {console.error(e.code==='EEXIST'?'Banner exists; nothing overwritten.':e.message);process.exitCode=1;}
}
