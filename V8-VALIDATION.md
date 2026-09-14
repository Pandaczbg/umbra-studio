# Umbra Studio V8 — izveštaj provere

**Status: završen izvorni paket; automatizovane provere prolaze. Browser i produkcioni prihvat nisu potvrđeni.**

Provere su izvršene 14. septembra 2026. na Node.js 24.19.0 i Next.js 16.3.4, uz zaključane zavisnosti. Ovaj izveštaj razlikuje potvrđene rezultate od dizajnerskih ciljeva i provera koje tek zahtevaju stvarni browser.

## Potvrđene provere

| Provera | Rezultat | Dokaz i opseg |
| --- | --- | --- |
| Izolovana instalacija | PASS | `npm ci` sa dostavljenim lockfile-om |
| TypeScript | PASS | `npm run typecheck` |
| TypeScript bez `.next` generisanih tipova | PASS | `lib/tests/results/cold-typecheck.log` |
| ESLint | PASS | `npm run lint -- --max-warnings=0`, ceo projekat |
| Jedinični i domenski testovi | PASS | 9 testova kroz `npm test` |
| Production build | PASS | `npm run build`; Node/Next build |
| Server HTTP provera | PASS | 50 provera, bez prijavljenih grešaka |
| Interne reference | PASS | 138 jedinstvenih lokalnih linkova, resursa i fragment ciljeva |
| Izvorni podaci i originalni javni asseti | PASS | SHA-256 poređenje: nijedan od 16 takvih originalnih fajlova nije izmenjen |
| Osnovni kontrast tokena | PASS za izračunate parove | Primarni 17.19:1; sekundarni 8.00:1; champagne 9.70:1 |
| Srpski znakovi fonta | Prisustvuju u izvornom fontu | ČĆŠŽĐčćšžđ u odgovarajućem Geist Variable TTF-u iste distribucije; browser prikaz nije potvrđen |

Kompletan izlaz provera je u `lib/tests/results/check.log`. HTTP detalji su u `http-report.json`, a prateći server log u `server.log`. Komande mogu ponovo da se izvrše na lokalnom računaru.

HTTP provera obuhvata 32 javne stranice na oba jezika, deset varijanti pretrage/filtera, pet nedostajućih adresa i tri metadata resursa. Za glavne stranice provereni su status, server `html lang`, jedan H1, jedan main landmark, skip target, canonical, SR/EN alternates, alt atributi i zaštitno MIME zaglavlje. Proveren je i pokušaj pogrešnog ulaznog locale zaglavlja: URL ostaje autoritet jezika.

Linkovi epizoda provereni su kao fragment ciljevi na odgovarajućoj stranici projekta. Postojeći PDF download fajlovi su dostupni. Sadržaj knjiga nije urednički menjan niti ocenjen ovim auditom.

## Testovi

1. Povratno SR/EN mapiranje svih kategorija.
2. Očuvanje sluga, query parametara, enkodiranja i hash fragmenta.
3. Navigacioni helperi za postojeće putanje i sadržajna sidra.
4. Isključenje neobjavljenih, privatnih, nevalidnih i budućih zapisa iz Aktuelno.
5. Hronološko sortiranje, determinističan tie-break i neizmenjenost ulaza.
6. Postojeći kompletni validator kanonskog grafa nad stvarnim podacima.
7. Prioritet eksplicitnog project artworka i lokalizovanih korica.
8. Postojanje slika i PDF-ova koje projekti referenciraju.
9. Normalizacija srpske latinice, uključujući đ/dj.

Ovi testovi ne izvršavaju JavaScript u browseru i nisu E2E potvrda klikova, fokusa ili vizuelnog rasporeda.

## Veličine medija i CSS-a

| Izvor | Original | WebP varijanta | Smanjenje |
| --- | ---: | ---: | ---: |
| umbra-background.png | 2,084,529 B | 224,522 B | 89.2% |
| Biblija Cover.png | 2,418,794 B | 263,820 B | 89.1% |
| books/Mrzim-svog-brata/cover-sr.png | 2,495,856 B | 250,598 B | 90.0% |
| books/Mrzim-svog-brata/cover-en.jpg | 155,674 B | 137,882 B | 11.4% |

Originali ostaju u paketu. Prikaz koristi izvedene varijante; dodatna Next Image optimizacija zavisi od tražene širine i runtime-a.

U internom V8 buildu pre ograničenja Tailwind skeniranja, zbir CSS fajlova bio je 156,398 B, približno 26,301 B uz gzip. Završni build ima 44,087 B CSS-a, 10,411 B uz gzip. To je poređenje dve V8 build konfiguracije u ovom radu, a ne merenje učitavanja prethodnog produkcionog sajta.

Ove brojke predstavljaju veličine fajlova. Nisu LCP, INP, CLS, TTFB ili Lighthouse rezultati. Ne postoji tvrdnja o rezultatu 100/100.

## Nedostajuće stranice

Nepoznata glavna putanja vraća 404. Neki nedostajući slug odgovori u dinamičkom Next streamingu imaju 200 uz lokalizovani not-found sadržaj i `noindex`; ostali imaju 404. Stvarni kodovi su sačuvani u JSON izveštaju. To je dokumentovano [Next.js streaming ponašanje](https://nextjs.org/docs/app/api-reference/file-conventions/not-found), ne tvrdnja da svaki nepostojeći slug ima hard HTTP 404.

## Nepotvrđene provere

| Oblast | Status | Razlog |
| --- | --- | --- |
| Vizuelni desktop pregled | NOT RUN | Dostupni browser blokira lokalni sajt sa `ERR_BLOCKED_BY_CLIENT` |
| Mobilni raspored i stvarni touch | NOT RUN | Lokalni browser nije dostupan za ovaj projekat |
| Klikovi, Tab/Shift+Tab, Escape, povratak fokusa | IMPLEMENTED / NOT BROWSER-VERIFIED | Postoji kod i odgovarajuća semantika; nema izvršenog browser testa |
| Screen reader i potpuni WCAG audit | NOT RUN | Token proračun i HTML kontrole nisu sertifikacija |
| Back/forward i ponašanje tabova u browseru | NOT RUN | HTTP test ne izvršava interakcije |
| Reduced-motion u stvarnom prikazu | IMPLEMENTED / NOT BROWSER-VERIFIED | CSS i postojeća runtime obrada su u kodu |
| Lighthouse i stvarni Core Web Vitals | NOT RUN | Nema browser/lab ni produkcione field evidencije |
| Cloudflare/production deploy | NOT RUN | Adapter nije potvrđen iz ZIP-a; sajt nije objavljen |
| Windows izvršavanje `.cmd` launchera | NOT RUN | Launcher je priložen; provere su izvršene u Linux/Node okruženju |

Iz ovih razloga FINAL_SOURCE označava završenu verziju isporučenog izvora, uz navedene granice provere. Produkciono odobrenje nije dato.

## Pregled nakon lokalnog pokretanja

Pre produkcione zamene pregledati širine 320, 390, 768, 1024 i 1440 CSS px, kao i zoom 200%. Proveriti ceo naslov, ivice slike, sadržaj tabova, prelom dugmadi i odsustvo horizontalnog curenja.

Mobilni meni treba da zadrži fokus, dozvoli Escape zatvaranje i vrati fokus na okidač. Hero tabovi treba da reaguju na strelice, Home i End. Proveriti SR/EN promenu na projektu, liku i pretrazi sa parametrima i fragmentom, pa povratak kroz Back/Forward.

Otvoriti oba PDF izdanja, epizodni rezultat pretrage i nepostojeću adresu. Uključiti reduced-motion i proveriti da sadržaj ostaje odmah čitljiv. Pregledati Chrome, Firefox i Safari, uz makar jedan fizički telefon.

Ovaj spisak opisuje preostali prihvat; ne predstavlja već izvršene provere.
