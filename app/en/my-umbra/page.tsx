import { pageMetadata } from '@/lib/site/metadata';
import {SiteFooter} from '@/components/v8/Primitives';
import AccountSpace from '@/components/v10/AccountSpace';
export const metadata={...pageMetadata('en','account',{title:'My Umbra — Umbra Studio',description:'Your private Umbra space and saved pages.',noIndex:true}),robots:{index:false,follow:false}};
export default function Page(){return <><AccountSpace locale="en"/><SiteFooter locale="en"/></>;}
