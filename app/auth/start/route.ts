import { accountLimit } from '@/lib/account/security';
import { cookies } from 'next/headers';
import { accountConfig, sameOrigin } from '@/lib/account/server';
import { safeReturn } from '@/lib/account/model';
export async function POST(request: Request) {
  const c=accountConfig();
  if(!c) return Response.json({error:'unavailable'},{status:503});
  if(!sameOrigin(request,c.origin)) return Response.json({error:'origin'},{status:403});
  if(!accountLimit('auth-start',30)) return Response.json({error:'rate_limit'},{status:429});
  const url=new URL(request.url); const returnTo=safeReturn(url.searchParams.get('returnTo'));
  const verifier=Buffer.from(crypto.getRandomValues(new Uint8Array(48))).toString('base64url');
  const challenge=Buffer.from(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(verifier))).toString('base64url');
  const jar=await cookies(); const options={httpOnly:true,secure:true,sameSite:'lax' as const,path:'/',maxAge:600};
  jar.set('umbra-verifier',verifier,options);jar.set('umbra-return',returnTo,options);
  const target=new URL(c.url+'/auth/v1/authorize');
  target.searchParams.set('provider','google');target.searchParams.set('redirect_to',c.origin+'/auth/callback');target.searchParams.set('code_challenge',challenge);target.searchParams.set('code_challenge_method','s256');target.searchParams.set('scopes','openid email profile');
  return new Response(null,{status:303,headers:{Location:target.toString(),'Cache-Control':'no-store','Referrer-Policy':'no-referrer'}});
}
