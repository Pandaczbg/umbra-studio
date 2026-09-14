/** Instance-local protection only; verified distributed edge limits remain an activation gate. */
export function createAccountLimiter() {
 const buckets=new Map<string,{count:number;until:number}>();
 return (key:string,limit=60,now=Date.now()) => {
  if(buckets.size>=1000) for(const [id,b] of buckets) if(b.until<=now) buckets.delete(id);
  const previous=buckets.get(key);
  if(!previous || previous.until<=now) {if(buckets.size>=1000&&!buckets.has(key))return false;buckets.set(key,{count:1,until:now+60000});return true;}
  previous.count++;return previous.count<=limit;
 };
}
export const accountLimit=createAccountLimiter();
