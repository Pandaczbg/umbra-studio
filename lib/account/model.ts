export type SavedKind = 'project' | 'character' | 'source' | 'blog';
export type SavedItem = { id: string; kind: SavedKind; title: string; href: string };
export const STORAGE_KEY = 'umbra-saved-v10';
export function safeReturn(value: unknown, fallback = '/moja-umbra'): string {
  if (typeof value !== 'string' || value.length > 300 || !/^\/(?!\/)[a-zA-Z0-9/\-]*(?:#[a-zA-Z0-9\-]+)?$/.test(value)) return fallback;
  if (/^\/(api|auth)(\/|$)/.test(value)) return fallback;
  return value;
}
export function validItem(value: unknown): value is SavedItem {
  if (!value || typeof value !== 'object') return false;
  const x = value as Record<string, unknown>;
  if (Object.keys(x).some(k => !['id','kind','title','href'].includes(k))) return false;
  if (typeof x.id !== 'string' || !/^[a-zA-Z0-9:_-]{1,120}$/.test(x.id) || typeof x.title !== 'string' || !x.title.trim() || x.title.length > 160 || /[<>\x00-\x1f]/.test(x.title)) return false;
  if (typeof x.href !== 'string' || safeReturn(x.href, '') !== x.href) return false;
  const [kind,slug,...extra] = x.id.split(':');
  if(kind!==x.kind || !slug || extra.length) return false;
  const series=['mrzim-svog-brata','biblija'];
  const characters=['gvozden','jadranka','ana','senad','rade','azra','mehmed','josif'];
  if(kind==='project') return series.includes(slug) && [`/serije/${slug}`,`/en/projects/${slug}`].includes(x.href);
  if(kind==='character') return characters.includes(slug) && [`/likovi/${slug}`,`/en/characters/${slug}`].includes(x.href);
  if(kind==='source') return series.includes(slug) && [`/serije/${slug}#source`,`/en/projects/${slug}#source`].includes(x.href);
  // No public Blog article is supplied in V10. Extend this catalog when publishing one.
  return false;
}
export function mergeItems(a: SavedItem[], b: SavedItem[]): SavedItem[] {
  return [...new Map([...a,...b].filter(validItem).map(x => [x.id,x])).values()].slice(0,200);
}
export function readLocal(): SavedItem[] {
  const value: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  if (!Array.isArray(value)) throw new Error('storage');
  return mergeItems([], value.filter(validItem));
}
export function writeLocal(items: SavedItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mergeItems([],items)));
  window.dispatchEvent(new Event('umbra-saved'));
}
