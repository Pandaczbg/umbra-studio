import test from 'node:test';
import assert from 'node:assert/strict';
import {safeReturn,validItem,mergeItems} from '../account/model.ts';
const item={id:'project:mrzim-svog-brata',kind:'project',title:'Mrzim svog brata',href:'/serije/mrzim-svog-brata'};
test('account return paths reject external, encoded, protocol and privileged redirects',()=>{for(const x of ['//evil.test','https://evil.test','/\\evil.test','/%2f%2fevil.test','/api/account','/auth/start','/foo?next=https://evil.test'])assert.equal(safeReturn(x),'/moja-umbra');assert.equal(safeReturn('/en/projects/biblija'),'/en/projects/biblija');});
test('saved schema rejects private route, script, forged owner and kind mismatch',()=>{assert.equal(validItem(item),true);for(const patch of [{href:'/moja-umbra'},{href:'javascript:alert(1)'},{user_id:'victim'},{title:'<script>alert(1)</script>'},{kind:'blog'}])assert.equal(validItem({...item,...patch}),false);});
test('saved migration deduplicates without mutating its inputs and bounds count',()=>{const list=[item];const next={...item,title:'Updated'};assert.deepEqual(mergeItems(list,[next]),[next]);assert.equal(list[0].title,'Mrzim svog brata');assert.equal(mergeItems([],[{...item,id:'project:nonexistent'}]).length,0);});
import { createAccountLimiter } from '../account/security.ts';
test('account request limiter bounds per-user attempts and resets after the window',()=>{const allow=createAccountLimiter();assert.equal(allow('a',2,0),true);assert.equal(allow('a',2,1),true);assert.equal(allow('a',2,2),false);assert.equal(allow('b',2,2),true);assert.equal(allow('a',2,60000),true);});

test('source bookmarks use real series source anchors in both locales',()=>{for(const slug of ['biblija','mrzim-svog-brata'])for(const prefix of ['/serije/','/en/projects/'])assert.equal(validItem({id:'source:'+slug,kind:'source',title:'Source',href:prefix+slug+'#source'}),true);assert.equal(validItem({...item,id:'project:biblija'}),false);});
