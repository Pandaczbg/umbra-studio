import { readLocal, writeLocal, mergeItems, validItem, type SavedItem } from './model';
export type AccountState = { enabled:boolean; user:null|{email:string;name:string};items:SavedItem[] };
let inFlight:Promise<AccountState>|null=null;
let cached:{value:AccountState;until:number}|null=null;
let generation=0;
export function invalidateAccount(){cached=null;inFlight=null;generation++;}
/** One request for all cards mounted together, never a persistent user-data cache. */
export function accountState(): Promise<AccountState> {
 if(cached && cached.until>Date.now()) return Promise.resolve(cached.value);
 if(inFlight)return inFlight;
 const started=generation;
 const request=fetch('/api/account',{cache:'no-store',signal:AbortSignal.timeout(10000)}).then(async response=>{if(!response.ok)throw new Error('network');const value:AccountState=await response.json();if(started!==generation)return accountState();cached={value,until:Date.now()+1500};return value;}).catch(error=>{if(started!==generation)return accountState();throw error;}).finally(()=>{if(inFlight===request)inFlight=null;});
 inFlight=request;return request;
}
export async function accountAction(body:Record<string,unknown>) {
  const response=await fetch('/api/account',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(15000)});
  if(!response.ok) throw new Error('network');invalidateAccount();return response.json();
}
export async function saveChange(item:SavedItem,remove:boolean) {
  if(!validItem(item))throw new Error('invalid_item');
  const state=await accountState();
  if(state.user) {await accountAction(remove?{action:'remove',id:item.id}:{action:'save',items:[item]});window.dispatchEvent(new Event('umbra-saved'));return 'account';}
  const current=readLocal();
  if(!remove && current.length>=200 && !current.some(x=>x.id===item.id)) throw new Error('limit');
  writeLocal(remove?current.filter(x=>x.id!==item.id):mergeItems(current,[item]));return 'local';
}
