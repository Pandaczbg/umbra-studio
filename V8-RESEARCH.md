# Umbra Studio V8: istraživanje i izvedene odluke

V8 razvija postojeći filmski identitet Umbra Studija kroz veće vizuale, čitljiviju tipografiju, jasniju navigaciju i zajedničku strukturu svih stranica. Osnova ostaju dostavljeni projekti, likovi, epizode i mediji. Implementacija je prilagođena malom sadržajnom registru i postojećoj Next.js aplikaciji.

Ovaj dokument povezuje ponovljeno istraživanje zvaničnih izvora sa konkretnim kodom. `V8-MASTER-PLAN.md` sadrži opširni prethodni plan. Stvarni status završnih provera određen je dokumentom `V8-VALIDATION.md`; raniji plan predstavlja polaznu specifikaciju.

## Izvorni projekat

Dostavljeni ZIP sadrži Next.js 16.3.4 aplikaciju sa React 19.2.8, Tailwind CSS 4, Framer Motion i Lucide ikonama. Kanonski sadržaj čine dva projekta, osam likova i dvanaest planiranih epizoda. Dodatni registri priča, medija, odnosa, vremenske linije i arhivskih zapisa trenutno su prazni.

Inventar obuhvata sve dostavljene fajlove. Detaljni nalazi izvedeni su iz ulaznih ruta, ključnih UI komponenti, tipova, query sloja, navigacije, objavljivanja, SEO-a, konfiguracije i asseta. Automatizovane provere obuhvataju TypeScript i ESLint kroz ceo projekat. To nije tvrdnja da je svaki red svih sačuvanih legacy komponenti prošao zasebnu ručnu reviziju ili bezbednosni audit.

Nijedan zapis iz `data` nije promenjen radi lepšeg prikaza. Nedostatak objavljenih datuma rešava se praznim editorial stanjem. Nedostatak odobrenih portreta rešava se tipografskim dosjeom. Knjige zadržavaju originalne korice i download izdanja. Provera otisaka potvrđuje kontinuitet tih fajlova.

## Referentni pristupi

A24 javno organizuje svoj sajt oko filmskih naslova, slika, trailera i drugih sadržajnih formata. Primenjiv zaključak za Umbru jeste da projekat treba da bude dominantan sadržajni objekat, sa slikom i jasnom sledećom radnjom. To je dizajnerski zaključak iz posmatranog sajta, a ne izjava o internom procesu A24 tima.[^1]

Pentagram ima eksplicitnu arhivu radova i filtriranje po disciplinama i sektorima. Za Umbru je primenjen isti opšti princip lakog pronalaženja projekta, ali sa malim brojem filtera koji odgovaraju postojećim podacima. Ne preuzima se obim kataloga niti tuđa poslovna struktura.[^2]

Stink Studios povezuje predstavljanje kreativnog rada i studija u zajedničko iskustvo. Umbra V8 primenjuje odvojene, jasno imenovane sekcije za projekte, likove, studio i gledanje. Ovo je autorska primena referentnih principa. Tuđi tekstovi, fotografije, kod i vizuelni identitet nisu kopirani.[^3]

Nijedan od ovih sajtova ne dokazuje da je neka paleta ili animacija univerzalni trend koji povećava konverziju. Za Umbru se bira mirna, tamna filmska kompozicija zato što odgovara postojećem brendu i raspoloživim materijalima. Očekivani efekat je bolja jasnoća i doslednost; povećanje poseta ili uspeha nije izmereno niti obećano.

## Vizuelni sistem

Glavna površina je gotovo crna sa blagim zeleno-maslinastim podtonom. Topla bela nosi naslove, svetliji neutralni ton nosi opise, a champagne naglašava aktivno stanje, fokus i primarne radnje. Jedinstveni V8 tokeni nalaze se u `app/v8.css`; postojeći sistemski tokeni ostaju dostupni u `app/globals.css`.

Luksuzniji utisak gradi se kroz razmak, odnos veličina i pažljivo pozicioniranje slika. Početni naslov ima stabilan identitet i čitljivu prateću poruku. Projekti dobijaju velike vizuelne površine, sa blagim asimetričnim ritmom na desktopu. Na telefonu prelaze u jedan tok. Dosje lika koristi sopstvenu kompoziciju i činjenične podatke, bez izmišljenog portreta.

Geist je preuzet iz distribucije 1.7.2 i isporučen kao lokalni promenljivi WOFF2 font, zajedno sa SIL Open Font License tekstom. Zvanična Next.js dokumentacija podržava lokalno učitavanje preko `next/font/local`, a zvanična Geist stranica opisuje porodicu fontova.[^4][^5] Zbog lokalnog asseta build ne zavisi od preuzimanja fonta sa Google servera. Serifni akcenat koristi sistemsku Georgiju; njen tačan izgled zavisi od operativnog sistema.

Korice romana prikazuju se sa `object-fit: contain`; postojeći široki vizual Biblije dobija sopstveno mesto. Centralni resolver daje prednost eksplicitnom artworku projekta, zatim lokalizovanoj korici i na kraju studijskom vizualu. Time se izbegava zamena stvarnog artworka generičkim fallbackom.

## Navigacija i pristupačnost

Header zadržava tamnu champagne kompoziciju, studijski wordmark, obodni indikator napretka i lokalni sat na velikim ekranima. Klik na kategoriju odmah vodi na njenu stranicu. Uklonjeno je skriveno pravilo koje je razlikovalo pojedinačni klik i dvoklik.

Mobilni meni koristi native `dialog.showModal()`. U kodu postoje modalna izolacija, Escape zatvaranje, zaključavanje skrola tela i povratak fokusa na dugme koje otvara meni. WAI-ARIA smernice za modalni dijalog traže zadržavanje fokusa unutar modalnog prostora i odgovarajući povratak pri zatvaranju.[^6] Implementacija koristi te obrasce; stvarno ponašanje u browseru i sa čitačem ekrana nije potvrđeno ovim okruženjem.

Hero explorer ima pet ručnih tabova. Strelice pomeraju izbor, Home i End biraju krajnje tabove. Svaki tab ima povezani panel, odgovarajući `aria-selected` i upravljanje fokusom. Nema automatskog smenjivanja sadržaja. Takav izbor smanjuje potrebu za dodatnim kontrolama reprodukcije i olakšava čitanje.

Glavna dugmad imaju najmanje 44 px visine; header ikonice imaju 44 × 44 px. To je projektni cilj koji je stroži od osnovnog WCAG 2.2 AA kriterijuma od 24 × 24 CSS px, za koji postoje definisani izuzeci.[^7] Mali dekorativni monogrami, serijski brojevi i pečati ne predstavljaju glavne interaktivne mete.

Za običan tekst WCAG traži kontrast najmanje 4.5:1, uz drugačiji prag za veliki tekst.[^8] Izračunati odnosi glavnih čvrstih boja dati su u izveštaju provere. Proračun tokena ne potvrđuje kontrast svakog piksela preko fotografija, svih hover stanja ili svih uređaja. Za to je potreban vizuelni i browser audit.

## Arhitektura i sadržaj

Rute sada služe kao tanki server ulazi u zajedničke prikaze. `HomePage`, `CollectionPages`, `DetailPages` i zajednički elementi služe oba jezika. Klijentski JavaScript ograničen je na navigacione interakcije, tabove, sat i postojeće globalne sisteme. Next.js dokumentacija preporučuje namerne granice između serverskih i klijentskih komponenti.[^9]

Sadržaj se čita kroz postojeći javni query sloj. Pretraga koristi isti registry, uz zajedničku normalizaciju srpske latinice. Filteri rade kroz GET forme i URL parametre, pa rezultat može da se podeli ili ponovo otvori. Nema dodatnog udaljenog search servisa, korisničkih naloga ili baze.

Novi route resolver mapira SR/EN kategorije, čuva slug, query i hash. Dodata je stvarna `/en/search` stranica. Epizode i priče vode ka postojećem projektu i njegovom sadržajnom sidru, umesto ka ranije generisanim nepostojećim dubokim rutama.

Izbor za Aktuelno je čista funkcija: javni zapis, validan datum koji nije u budućnosti, a za epizode i status `published`. Redosled je po datumu, zatim uredničkom poretku i stabilnom identifikatoru. `featured` ne određuje hronologiju. Testovi proveravaju nedostajuće, nevalidne, buduće i privatne zapise, kao i neizmenjenost ulaznog niza.

## Mediji i performanse

Četiri glavna vizuala imaju WebP varijante, bez uklanjanja izvornog fajla. `next/image` koristi definisanu geometriju, `sizes` i prioritet za glavni vidljivi vizual kroz `preload`, koji odgovara aktuelnom API-ju. Next.js dokumentacija opisuje prilagođavanje veličine slike i očuvanje stabilnosti rasporeda.[^10]

Tailwind automatski skenira izvorne fajlove kao tekst. Pošto su stare komponente sačuvane u ZIP-u, njihov veliki broj utility klasa je povećavao CSS iako ih aktivne V8 stranice ne renderuju. Primenjeno je eksplicitno `source(none)` skeniranje uz registrovane aktivne foldere, u skladu sa dokumentacijom.[^11] Razlika u izgrađenim CSS bajtovima je merljiva i prikazana u validaciji.

Globalni `UmbraMotionSystem` i `UmbraSceneDirector` ostaju aktivni. Stari overlay i scrollbar prikazi ostaju u izvoru, ali se ne montiraju u V8 layoutu. Novi prikaz koristi native skrol i ograničene CSS promene slike i boje. Time je jasno definisana kompozicija aktivnog prikaza; nije tvrdnja da je svaki prethodni efekat profilisan ili dokazano spor.

Reduced-motion pravila uklanjaju CSS animacije i transformacije hover prikaza, dok postojeći sistemi zadržavaju sopstvenu obradu preferencije. Motion dokumentacija opisuje prilagođavanje animacija korisničkim preferencijama.[^12] Ovaj kod ne potvrđuje ponašanje na konkretnom mobilnom uređaju bez browser testa.

Ciljevi nakon objave ostaju LCP do 2.5 s, INP do 200 ms i CLS do 0.1 na 75. percentilu. To su zvanični pragovi, a ne izmereni rezultati ovog ZIP-a.[^13] Gzip veličina CSS-a i broj uspešnih HTTP odgovora ne mogu da zamene te metrike.

## SEO, server jezik i ograničenja hostinga

Svaka javna glavna ruta ima canonical i uzajamne SR/EN alternate linkove, uz odgovarajući naslov, opis i social metadata. Sitemap koristi javne query rezultate i izostavlja search stranice. Google smernice traže ispravne veze između lokalizovanih varijanti; sama promena teksta ili klijentskog jezika nije dovoljna.[^14]

`proxy.ts` određuje jezik iz putanje i postavlja kontrolisano request zaglavlje. Root layout ga čita i emituje odgovarajući `html lang` već na serveru. U Next.js 16 `proxy` je važeća konvencija, a čitanje `headers()` je asinhrono i uvodi dinamičko renderovanje.[^15][^16] Ovaj kompromis zadržava postojeće URL-ove i strukturu projekta, uz potrebu za kompatibilnim server runtime-om.

Nedostajuće stranice prikazuju lokalizovano stanje i dobijaju `noindex`. Next.js dokumentuje da streamed not-found odgovor može imati status 200, dok se za odgovor bez streaminga vraća 404.[^17] Izveštaj beleži stvarne kodove; ne izjednačava sve takve odgovore sa klasičnim hard 404 odgovorom.

Cloudflare vodi sopstvenu dokumentaciju i podržane integracione puteve za Next.js.[^18] Dostavljeni ZIP ne sadrži dovoljno konfiguracije da se potvrdi postojeći adapter. Zato nisu uvedeni novi hosting sistem niti automatska migracija. Prolazak `next build` i Node servera predstavlja dokaz tog lokalnog runtime-a, ne potvrdu produkcionog Workers okruženja.

## Rad profesionalnog tima i predaja

Izvedene su odvojive odgovornosti: vizuelna kompozicija, UI tekst, javni sadržaj, navigacioni ugovori, metapodaci, asseti i proverljivi release kriterijumi. Promene imaju centralne ulazne fajlove, zaključane zavisnosti, reproduktibilne komande i jednostavan povratak na prethodni folder.

Paket uključuje uputstvo za zamenu na Windows-u, launcher, testove, logove, inventar i SHA-256 otiske. Nema tajnih ključeva, izmišljenih datuma, kupljenih materijala ili novih spoljašnjih servisa. Backend, CMS, newsletter i složen 3D ostaju izvan obima jer trenutni sadržaj ne zahteva te sisteme.

Za produkciono prihvatanje ostaje konkretan pregled: Chrome/Firefox/Safari, telefon, tastatura, čitač ekrana, reduced-motion, učitavanje slika, prelom teksta, actual performance i ciljni hosting. Ove provere su razdvojene od završenog koda zato što dokazi za njih nisu dostupni. Ograničenje ne menja isporučeni izvor; određuje tačnu granicu njegove potvrđene spremnosti.

## Izvori

Svi navedeni javni izvori ponovo su konsultovani za implementaciju. Datum pristupa: 14. septembar 2026. Kod koristi zaključane verzije iz projekta; živa dokumentacija može opisivati noviji patch.

[^1]: A24. [Zvanični sajt](https://a24films.com/). Struktura prikaza filmskih naslova i sadržaja.
[^2]: Pentagram. [Work](https://www.pentagram.com/work). Organizacija arhive i filtera.
[^3]: Stink Studios. [Zvanični sajt](https://www.stinkstudios.com/). Predstavljanje rada i studija.
[^4]: Next.js. [Font Optimization](https://nextjs.org/docs/app/getting-started/fonts). Lokalni fontovi i učitavanje.
[^5]: Vercel. [Geist Font](https://vercel.com/font). Porodica fonta; priložena licenca potiče iz distribucije Geist 1.7.2.
[^6]: W3C WAI. [Dialog (Modal) Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/). Modalni fokus i interakcije.
[^7]: W3C WAI. [Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html). WCAG 2.2 SC 2.5.8.
[^8]: W3C WAI. [Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). WCAG SC 1.4.3.
[^9]: Next.js. [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components). Granice renderovanja.
[^10]: Next.js. [Image Component](https://nextjs.org/docs/app/api-reference/components/image). Image geometrija, sizes i preload.
[^11]: Tailwind CSS. [Detecting classes in source files](https://tailwindcss.com/docs/detecting-classes-in-source-files). Eksplicitni izvori i source(none).
[^12]: Motion. [Create accessible animations in React](https://motion.dev/docs/react-accessibility). Reduced-motion preferencije.
[^13]: Google web.dev. [Web Vitals](https://web.dev/articles/vitals). LCP, INP, CLS i percentili.
[^14]: Google Search Central. [Localized Versions of your Pages](https://developers.google.com/search/docs/specialty/international/localized-versions). Hreflang i uzajamne veze.
[^15]: Next.js. [proxy.js](https://nextjs.org/docs/app/api-reference/file-conventions/proxy). Konvencija i request zaglavlja.
[^16]: Next.js. [headers](https://nextjs.org/docs/app/api-reference/functions/headers). Asinhroni API i dinamičko renderovanje; relevantna instalirana dokumentacija takođe je pročitana.
[^17]: Next.js. [not-found.js](https://nextjs.org/docs/app/api-reference/file-conventions/not-found). HTTP status kodovi pri streamingu.
[^18]: Cloudflare. [Next.js on Workers](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/). Integracija i ograničenje opsega provere.
