import { cookies } from 'next/headers';
import { accountConfig, remote, setSession } from '@/lib/account/server';
import { safeReturn } from '@/lib/account/model';
export async function GET(request: Request) {
  const c=accountConfig();if(!c) return Response.json({error:'unavailable'},{status:503});
  const jar=await cookies();const verifier=jar.get('umbra-verifier')?.value;const target=safeReturn(jar.get('umbra-return')?.value);
  jar.set('umbra-verifier','',{path:'/',secure:true,httpOnly:true,sameSite:'lax',maxAge:0});jar.set('umbra-return','',{path:'/',secure:true,httpOnly:true,sameSite:'lax',maxAge:0});
  const code=new URL(request.url).searchParams.get('code');
  let destination=target;
  try {
    if(!verifier || !code || code.length>2000) throw new Error('invalid');
    const session=await remote('/auth/v1/token?grant_type=pkce',undefined,{method:'POST',body:JSON.stringify({auth_code:code,code_verifier:verifier})});
    const user=await remote('/auth/v1/user',session.access_token);
    if(!user || typeof user.id!=='string' || !/^[a-f0-9-]{36}$/.test(user.id) || !user.identities?.some((entry:{provider?:string})=>entry.provider==='google')) throw new Error('identity');
    await remote('/rest/v1/umbra_profiles?on_conflict=user_id',session.access_token,{method:'POST',headers:{Prefer:'resolution=ignore-duplicates,return=minimal'},body:JSON.stringify({user_id:user.id,display_name:''})});
    await setSession(session);
  } catch { destination=(target.startsWith('/en')?'/en/my-umbra':'/moja-umbra')+'?auth=failed'; }
  return new Response(null,{status:303,headers:{Location:c.origin+destination,'Cache-Control':'no-store','Referrer-Policy':'no-referrer'}});
}
