import { cookies } from 'next/headers';
export function accountConfig() {
  const url = process.env.UMBRA_SUPABASE_URL || '';
  const key = process.env.UMBRA_SUPABASE_PUBLISHABLE_KEY || '';
  const origin = process.env.UMBRA_ACCOUNT_ORIGIN || '';
  if (process.env.UMBRA_ACCOUNT_ENABLED !== 'true' || process.env.UMBRA_ACCOUNT_LIMITS_VERIFIED !== 'true' || !/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url) || !key || !/^https:\/\/[a-zA-Z0-9.-]+(?::\d+)?$/.test(origin)) return null;
  return {url,key,origin};
}
export function sameOrigin(request: Request, origin: string) { return request.headers.get('origin') === origin; }
export async function remote(path: string, token?: string, init: RequestInit = {}) {
  const c = accountConfig(); if (!c) throw new Error('unavailable');
  const response = await fetch(c.url+path, {...init,cache:'no-store',signal:AbortSignal.timeout(8000), headers:{apikey:c.key,...(token ? {Authorization:`Bearer ${token}`} : {}),'Content-Type':'application/json',...init.headers}});
  if (!response.ok) throw new Error((response.status === 401 || (response.status === 400 && path === '/auth/v1/token?grant_type=refresh_token')) ? 'unauthorized' : 'upstream');
  if (response.status === 204) return null;
  const reader=response.body?.getReader();if(!reader)return null;let text='';let bytes=0;const decoder=new TextDecoder();
  try{while(true){const part=await reader.read();if(part.done)break;bytes+=part.value.byteLength;if(bytes>150000){await reader.cancel();throw new Error('upstream');}text+=decoder.decode(part.value,{stream:true});}}finally{reader.releaseLock();}
  return text ? JSON.parse(text) : null;
}
const names = ['umbra-access','umbra-refresh','umbra-verifier','umbra-return'] as const;
export async function setSession(session: {access_token:string;refresh_token:string;expires_in:number}) {
  if (!session || typeof session.access_token!=='string' || typeof session.refresh_token!=='string' || !session.access_token || !session.refresh_token || session.access_token.length > 3800 || session.refresh_token.length > 3800) throw new Error('session');
  const jar = await cookies();
  const opts = {httpOnly:true,secure:true,sameSite:'lax' as const,path:'/'};
  jar.set(names[0],session.access_token,{...opts,maxAge:Math.min(session.expires_in || 3600,3600)});
  jar.set(names[1],session.refresh_token,{...opts,maxAge:60*60*24*7});
}
export async function clearSession() { const jar = await cookies(); for (const name of names) jar.set(name,'',{httpOnly:true,secure:true,sameSite:'lax',path:'/',maxAge:0}); }
export async function identity() {
  if (!accountConfig()) return null;
  const jar = await cookies(); let token = jar.get(names[0])?.value;
  const refresh = jar.get(names[1])?.value;
  if (!token && !refresh) return null;
  try {
    if (!token && refresh) {
      const session = await remote('/auth/v1/token?grant_type=refresh_token',undefined,{method:'POST',body:JSON.stringify({refresh_token:refresh})});
      await setSession(session); token = session.access_token;
    }
    let user;
    try { user = await remote('/auth/v1/user',token); }
    catch (error) {
      if (!(error instanceof Error) || error.message !== 'unauthorized' || !refresh) throw error;
      const session = await remote('/auth/v1/token?grant_type=refresh_token',undefined,{method:'POST',body:JSON.stringify({refresh_token:refresh})});
      await setSession(session); token=session.access_token; user=await remote('/auth/v1/user',token);
    }
    if (!user?.identities?.some((entry:{provider?:string})=>entry.provider==='google') || typeof user.id !== 'string' || !/^[a-f0-9-]{36}$/.test(user.id)) throw new Error('unauthorized');
    return {id:user.id as string,email:typeof user.email === 'string' ? user.email : '',token:token!};
  } catch(error) { if (error instanceof Error && error.message === 'unauthorized') { await clearSession(); return null; } throw error; }
}
export async function readBody(request: Request): Promise<Record<string,unknown>> {
  if (!request.headers.get('content-type')?.startsWith('application/json')) throw new Error('input');
  if (Number(request.headers.get('content-length')) > 60000) throw new Error('input');
  const reader=request.body?.getReader(); if (!reader) throw new Error('input');
  let timedOut=false;let bytes=0;
  const timer=setTimeout(()=>{timedOut=true;void reader.cancel().catch(()=>{});},3000); let text=''; const decoder=new TextDecoder();
  try { while(true) { const r=await reader.read(); if(r.done) break; bytes+=r.value.byteLength; text+=decoder.decode(r.value,{stream:true}); if(bytes>60000) {await reader.cancel();throw new Error('input');} } if(timedOut) throw new Error('input'); let parsed:unknown;try {parsed=JSON.parse(text);}catch{throw new Error('input');} if(!parsed || typeof parsed!=='object' || Array.isArray(parsed)) throw new Error('input'); return parsed as Record<string,unknown>; } finally {clearTimeout(timer);reader.releaseLock();}
}
