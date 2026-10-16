import {readFile,writeFile,mkdir,access} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
export const MODEL='black-forest-labs/flux.2-klein-4b';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
export function requestFor(prompt) {
 if(typeof prompt!=='string'||!prompt.trim()||prompt.length>6000) throw Error('Use a nonempty prompt of at most 6000 characters.');
 return {model:MODEL,prompt:prompt.trim()+' Editorial illustration for a technical article. Wide composition. No text, logos, fake interfaces, credentials, or numbers. Clear shapes and restrained color.',aspect_ratio:'16:9',output_format:'jpeg',n:1,provider:{allow_fallbacks:false}};
}
export async function generate({slug,prompt,alt,dryRun=false,fetcher=fetch,key=process.env.OPENROUTER_API_KEY,outputRoot=root}) {
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug ?? '')) throw Error('Use a lowercase article slug.');
 if(typeof alt!=='string'||!alt.trim()||alt.length>500) throw Error('Provide descriptive alt text of at most 500 characters.');
 const body=requestFor(prompt);
 const output=resolve(outputRoot,'public/assets/blog',slug+'.jpg');
 if(dryRun) return {dryRun:true,output,request:body,alt};
 try {await access(output);throw Error('Image exists; choose a new slug to preserve it.');} catch(e) {if(e.code!=='ENOENT') throw e;}
 if(!key) throw Error('Set OPENROUTER_API_KEY locally; never put it in article files or client code.');
 const response=await fetcher('https://openrouter.ai/api/v1/images',{method:'POST',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json','HTTP-Referer':'https://cochranweb.com','X-Title':'Cochranweb editorial'},body:JSON.stringify(body),signal:AbortSignal.timeout(120000)});
 if(!response.ok) throw Error('Image request failed (HTTP '+response.status+'); no automatic retry.');
 const result=await response.json(); const image=result.data?.[0];
 if(!image?.b64_json || (image.media_type && image.media_type!=='image/jpeg')) throw Error('Provider returned no JPEG; nothing saved.');
 const bytes=Buffer.from(image.b64_json,'base64');
 if(bytes.length>15*1024*1024||bytes[0]!==255||bytes[1]!==216||bytes[2]!==255) throw Error('Invalid or oversized JPEG; nothing saved.');
 await mkdir(dirname(output),{recursive:true});await writeFile(output,bytes,{flag:'wx'});
 await writeFile(output+'.json',JSON.stringify({model:MODEL,prompt:body.prompt,alt,generatedAt:new Date().toISOString(),costUsd:typeof result.usage?.cost==='number'?result.usage.cost:null},null,2)+'\n',{flag:'wx'});
 return {output,heroImage:'/assets/blog/'+slug+'.jpg',heroAlt:alt,costUsd:typeof result.usage?.cost==='number'?result.usage.cost:null,next:'Inspect the image, optimize if needed, and set its actual heroWidth and heroHeight in frontmatter.'};
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
 try {
  const args=process.argv.slice(2);const dryRun=args.includes('--dry-run');const values=args.filter(a=>a!=='--dry-run');
  if(values.length!==3) throw Error('Usage: npm run image:header -- article-slug prompt.txt "Descriptive alt text" [--dry-run]');
  const [slug,path,alt]=values;console.log(JSON.stringify(await generate({slug,prompt:await readFile(path,'utf8'),alt,dryRun}),null,2));
 } catch {console.error('Header image generation failed. Check arguments, local API key, provider availability, and output path. No automatic retry.');process.exitCode=1;}
}
