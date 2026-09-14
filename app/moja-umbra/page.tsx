import { pageMetadata } from '@/lib/site/metadata';
import {SiteFooter} from '@/components/v8/Primitives';
import AccountSpace from '@/components/v10/AccountSpace';
export const metadata={...pageMetadata('sr','account',{title:'Moja Umbra — Umbra Studio',description:'Tvoj privatni Umbra prostor i sačuvane stranice.',noIndex:true}),robots:{index:false,follow:false}};
export default function Page(){return <><AccountSpace locale="sr"/><SiteFooter locale="sr"/></>;}
