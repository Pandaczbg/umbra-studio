import { accountConfig, clearSession, identity, readBody, remote, sameOrigin } from '@/lib/account/server';
import { accountLimit } from '@/lib/account/security';
import { validItem } from '@/lib/account/model';
export const dynamic = 'force-dynamic';
const reply = (value:unknown,status=200) => Response.json(value,{status,headers:{'Cache-Control':'private, no-store','Vary':'Cookie','X-Content-Type-Options':'nosniff'}});
export async function GET() {
  if (!accountConfig()) return reply({enabled:false,user:null,items:[]});
  if(!accountLimit('global',300)) return reply({error:'rate_limit'},429);
  try {
    const user=await identity(); if (!user) return reply({enabled:true,user:null,items:[]});
    if(!accountLimit(user.id)) return reply({error:'rate_limit'},429);
    const [profiles,rows]=await Promise.all([
      remote(`/rest/v1/umbra_profiles?user_id=eq.${user.id}&select=display_name`,user.token),
      remote(`/rest/v1/umbra_saved?user_id=eq.${user.id}&select=item&order=created_at.desc&limit=200`,user.token)
    ]);
    return reply({enabled:true,user:{email:user.email,name:profiles?.[0]?.display_name || ''},items:rows.map((r:{item:unknown})=>r.item).filter(validItem)});
  } catch { return reply({error:'unavailable'},503); }
}
export async function POST(request: Request) {
  const config=accountConfig(); if(!config) return reply({error:'unavailable'},503);
  if(!sameOrigin(request,config.origin)) return reply({error:'origin'},403);
  if(!accountLimit('global',300)) return reply({error:'rate_limit'},429);
  try {
    const body=await readBody(request);
    if(body.action==='logout' && Object.keys(body).length===1) {
      let revoked=false;try {const current=await identity();if(current){await remote('/auth/v1/logout?scope=local',current.token,{method:'POST'});}revoked=true;}catch{}
      await clearSession();return reply({ok:true,revoked});
    }
    const user=await identity(); if(!user) return reply({error:'unauthorized'},401);
    if(!accountLimit(user.id)) return reply({error:'rate_limit'},429);
    if(body.action==='save' && Object.keys(body).length===2 && Array.isArray(body.items) && body.items.length>0 && body.items.length<=200 && body.items.every(validItem)) {
      const unique=[...new Map(body.items.map(item=>[item.id,item])).values()];
      await remote('/rest/v1/umbra_saved?on_conflict=user_id,item_id',user.token,{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(unique.map(item=>({user_id:user.id,item_id:item.id,item})))});
      return reply({ok:true});
    }
    if(body.action==='remove' && Object.keys(body).length===2 && typeof body.id==='string' && /^[a-zA-Z0-9:_-]{1,120}$/.test(body.id)) { await remote(`/rest/v1/umbra_saved?user_id=eq.${user.id}&item_id=eq.${encodeURIComponent(body.id)}`,user.token,{method:'DELETE'}); return reply({ok:true}); }
    if(body.action==='profile' && Object.keys(body).length===2 && typeof body.name==='string' && body.name.trim().length>0 && body.name.length<=60 && !/[<>\x00-\x1f]/.test(body.name)) { await remote('/rest/v1/umbra_profiles?on_conflict=user_id',user.token,{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({user_id:user.id,display_name:body.name.trim()})}); return reply({ok:true}); }
    if(body.action==='export' && Object.keys(body).length===1) { const [profile,saved]=await Promise.all([remote(`/rest/v1/umbra_profiles?user_id=eq.${user.id}`,user.token),remote(`/rest/v1/umbra_saved?user_id=eq.${user.id}&limit=200`,user.token)]);return reply({email:user.email,profile,saved}); }
    if(body.action==='delete' && Object.keys(body).length===2 && body.confirm==='DELETE MY ACCOUNT') { await remote('/rest/v1/rpc/umbra_delete_own_account',user.token,{method:'POST',body:'{}'});await clearSession();return reply({ok:true}); }
    return reply({error:'invalid_input'},400);
  } catch(error) { return reply({error:error instanceof Error && error.message==='input' ? 'invalid_input':'unavailable'},error instanceof Error && error.message==='input'?400:503); }
}
