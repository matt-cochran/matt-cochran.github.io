import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';import {join} from 'node:path';
import {generate,MODEL} from './header-image.mjs';
test('dry run makes no paid call and needs no key',async()=>{const r=await generate({slug:'test',prompt:'A workbench',alt:'A workbench',dryRun:true,fetcher:()=>assert.fail('network')});assert.equal(r.request.model,MODEL);assert.equal(r.request.n,1);});
test('rejects path traversal before network',async()=>{await assert.rejects(generate({slug:'../bad',prompt:'test',alt:'test',fetcher:()=>assert.fail('network')}));});
test('one explicit request saves bytes and refuses overwrite',async()=>{const outputRoot=await mkdtemp(join(tmpdir(),'header-'));let calls=0;const fetcher=async(url,options)=>{calls++;assert.equal(url,'https://openrouter.ai/api/v1/images');assert.equal(JSON.parse(options.body).provider.allow_fallbacks,false);return {ok:true,json:async()=>({data:[{b64_json:Buffer.from([255,216,255,217]).toString('base64'),media_type:'image/jpeg'}],usage:{cost:.014}})}};try{const args={slug:'test',prompt:'A workbench',alt:'A workbench',outputRoot,key:'fictional',fetcher};const r=await generate(args);assert.equal((await readFile(r.output)).length,4);await assert.rejects(generate(args),/exists/);assert.equal(calls,1);}finally{await rm(outputRoot,{recursive:true,force:true})}});
test('provider errors are not retried or exposed',async()=>{let calls=0;await assert.rejects(generate({slug:'failure',prompt:'test',alt:'test',outputRoot:tmpdir(),key:'fictional',fetcher:async()=>{calls++;return {ok:false,status:429}}}),/HTTP 429/);assert.equal(calls,1)});
