import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
const source=(await readFile(new URL('../account/server.ts',import.meta.url),'utf8')).replace("import { cookies } from 'next/headers';",'const cookies = async () => globalThis.__umbraAccountTestJar;');
const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const server=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
const config={UMBRA_ACCOUNT_ENABLED:'true',UMBRA_ACCOUNT_LIMITS_VERIFIED:'true',UMBRA_SUPABASE_URL:'https://example.supabase.co',UMBRA_SUPABASE_PUBLISHABLE_KEY:'test-only-public-key',UMBRA_ACCOUNT_ORIGIN:'https://umbra.example'};
async function mocked(run){const env={...process.env};const fetch=globalThis.fetch;try{Object.assign(process.env,config);await run();}finally{process.env=env;globalThis.fetch=fetch;delete globalThis.__umbraAccountTestJar;}}
test('mock auth: activation fails closed without external limits confirmation',async()=>mocked(async()=>{delete process.env.UMBRA_ACCOUNT_LIMITS_VERIFIED;assert.equal(server.accountConfig(),null);}));
test('mock auth: expired refresh token clears cookies rather than trapping user in unavailable',async()=>mocked(async()=>{const cleared=[];globalThis.__umbraAccountTestJar={get:name=>name==='umbra-refresh'?{value:'expired'}:undefined,set:(...args)=>cleared.push(args)};globalThis.fetch=async()=>Response.json({code:'refresh_token_not_found'},{status:400});assert.equal(await server.identity(),null);assert.equal(cleared.length,4);}));
test('mock auth: server verifies identity and never trusts a cookie as user ID',async()=>mocked(async()=>{globalThis.__umbraAccountTestJar={get:name=>name==='umbra-access'?{value:'forged-victim-token'}:undefined,set:()=>{}};let called='';globalThis.fetch=async url=>{called=url;return Response.json({message:'invalid'},{status:401});};assert.equal(await server.identity(),null);assert.ok(called.endsWith('/auth/v1/user'));}));
test('account body rejects malformed JSON and a stalled valid JSON prefix',async()=>{await assert.rejects(server.readBody(new Request('https://umbra.example',{method:'POST',headers:{'Content-Type':'application/json'},body:'{'})),/input/);const stream=new ReadableStream({start(controller){controller.enqueue(new TextEncoder().encode('{"action":"export"}'));}});await assert.rejects(server.readBody(new Request('https://umbra.example',{method:'POST',headers:{'Content-Type':'application/json'},body:stream,duplex:'half'})),/input/);});
test('account mutations require exact configured origin',()=>{assert.equal(server.sameOrigin(new Request('https://umbra.example',{headers:{Origin:'https://evil.example'}}),'https://umbra.example'),false);assert.equal(server.sameOrigin(new Request('https://umbra.example'),'https://umbra.example'),false);assert.equal(server.sameOrigin(new Request('https://umbra.example',{headers:{Origin:'https://umbra.example'}}),'https://umbra.example'),true);});
const clientSource=(await readFile(new URL('../account/client.ts',import.meta.url),'utf8')).replace("from './model'",`from '${new URL('../account/model.ts',import.meta.url).href}'`);
const clientJs=ts.transpileModule(clientSource,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const client=await import('data:text/javascript;base64,'+Buffer.from(clientJs).toString('base64'));
test('mock account client collapses simultaneous card loads into one request',async()=>{const original=globalThis.fetch;let calls=0;try{globalThis.fetch=async()=>{calls++;return Response.json({enabled:false,user:null,items:[]});};await Promise.all(Array.from({length:100},()=>client.accountState()));assert.equal(calls,1);}finally{globalThis.fetch=original;client.invalidateAccount();}});
test('mock guest source save persists the real source anchor and invalid items cannot report success',async()=>{const originalFetch=globalThis.fetch;const originalStorage=globalThis.localStorage;const originalWindow=globalThis.window;const data=new Map();try{globalThis.fetch=async()=>Response.json({enabled:false,user:null,items:[]});globalThis.localStorage={getItem:key=>data.get(key)||null,setItem:(key,value)=>data.set(key,value)};globalThis.window={dispatchEvent:()=>{}};const source={id:'source:biblija',kind:'source',title:'Biblija',href:'/serije/biblija#source'};assert.equal(await client.saveChange(source,false),'local');assert.equal(JSON.parse(data.get('umbra-saved-v10'))[0].href,source.href);await assert.rejects(client.saveChange({...source,href:'https://evil.example'},false),/invalid_item/);}finally{globalThis.fetch=originalFetch;globalThis.localStorage=originalStorage;globalThis.window=originalWindow;client.invalidateAccount();}});
test('mock account client never returns a stale in-flight identity after logout',async()=>{
 const original=globalThis.fetch;let release;let gets=0;
 try{
  client.invalidateAccount();
  globalThis.fetch=async(_url,init)=>{
   if(init?.method==='POST')return Response.json({ok:true,revoked:true});
   gets++;
   if(gets===1)return new Promise(resolve=>{release=resolve;});
   return Response.json({enabled:true,user:null,items:[]});
  };
  const beforeLogout=client.accountState();
  await client.accountAction({action:'logout'});
  const afterLogout=client.accountState();
  assert.equal(gets,2,'follow-up request must not reuse the old in-flight GET');
  assert.equal((await afterLogout).user,null);
  release(Response.json({enabled:true,user:{email:'previous@example.invalid',name:'Previous'},items:[]}));
  assert.equal((await beforeLogout).user,null,'original subscribers must also receive the current generation');
  assert.equal((await client.accountState()).user,null,'late completion must not replace fresh cache');
  assert.equal(gets,2);
 }finally{globalThis.fetch=original;client.invalidateAccount();}
});
