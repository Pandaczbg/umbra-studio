# Umbra Studio V8 plan redizajna

V8 treba da razvije postojeći tamni, filmski identitet Umbra Studija u dosledan i čitljiv premium sajt. Osnova je postojeći V7 ULTRA header, uz jaču režiju sadržaja, kvalitetniju tipografiju, veće vizuale, jasniju navigaciju i pouzdanije ponašanje svih stranica. Najveći očekivani dobitak dolazi iz usklađivanja postojećeg sistema i ispravnog predstavljanja stvarnih projekata.

Ovaj dokument određuje obim, prioritete, zavisnosti, predloge po komponentama i uslove prihvatanja. Predložene promene nisu implementirane. Vizuelna specifikacija ima status PROPOSAL, a precizne mere PROVISIONAL dok se ne provere u stvarnom prikazu na ciljanim uređajima.

## 1 Polazno stanje i pouzdanost nalaza

**FACT — izvor:** priloženi `umbra-studio(1).zip`. Inventar obuhvata celu arhivu; detaljna analiza obuhvata projektna uputstva, konfiguraciju, početnu stranicu, ceo header i hero, latest prikaz, ključne slojeve sadržaja, navigacije i SEO-a, uz ciljane pretrage ostalih komponenti. Ovo nije tvrdnja da je svaki red svakog fajla ručno revidiran.

U direktorijumima `app`, `components`, `lib` i `data` postoji 65 TS, TSX i CSS fajlova sa 26.563 linije. U 21 fajlu postoji direktiva `use client`. Broj linija i direktiva služi za određivanje obima; nije sam po sebi dokaz lošeg koda ili sporog sajta.

| Provera | Rezultat u ovoj analizi | Praktično značenje |
| --- | --- | --- |
| Instalacija iz lock fajla | PASS uz `npm ci --ignore-scripts` | Korišćene su verzije iz priloženog projekta |
| `npx tsc --noEmit` | PASS | Nisu prijavljene TypeScript greške |
| `npm run lint -- --max-warnings=0` | PASS | ESLint završava bez grešaka i upozorenja |
| `npm run build` | PASS | Next.js produkcioni build završava; log prikazuje generisanje 37/37 statičkih stavki |
| Generisani HTML odabranih ruta | Pregledan | Potvrđeni konkretni jezički i metadata problemi |
| Vizuelni prikaz lokalne aplikacije | UNKNOWN | Pregledač nije mogao da otvori lokalni server |
| Mobilni prikaz, tastatura i čitač ekrana | UNKNOWN | Potrebna je stvarna interaktivna provera |
| LCP, INP, CLS i veličina mrežnog prenosa | UNKNOWN | Nisu mereni u ovoj analizi |
| Stvarni Cloudflare production deploy | UNKNOWN | Lokalni Next build nije provera produkcionog adaptera |

Broj 37/37 označava korak generisanja u build logu, ne 37 ručno testiranih javnih stranica. Npm je pri instalaciji prijavio poruku o prestanku podrške instaliranoj ESLint verziji; to je odvojeno od uspešnog rezultata lint provere.

**COMPLETED:** učitavanje arhive, inventar, navedena analiza, TypeScript/lint/build provera i istraživanje izvora. Izvorni TS/TSX/CSS fajlovi nisu menjani. Provera je osvežila samo generisani `tsconfig.tsbuildinfo` u radnoj kopiji.

**DECISION — kontinuitet:** postojeći V7 ULTRA header ostaje vizuelna referenca. Tamni ton, champagne/gold akcenat, obodni indikator napretka i zajedničko vlasništvo nad animacijom ostaju polazne odluke. Raniji checkpointi iz istorije nisu dokaz da je ZIP identičan određenom Git commitu, jer arhiva nema `.git` istoriju.

**PROPOSAL — izuzeci od zaključanog headera:** promena ponašanja klik/dvoklik, veličine funkcionalnog teksta i pristupačnosti menija predlaže se eksplicitno kao V8 korekcija. Ne smatra se već prihvaćenom odlukom.

## 2 Šta već postoji i treba sačuvati

| Oblast | Postojeća osnova | V8 postupak |
| --- | --- | --- |
| Framework | Next.js 16.3.4, React 19.2.8, TypeScript 5.9.3 iz lock fajla | Zadržati polazni stack; nadogradnje obrađivati zasebno |
| Stilovi | Tailwind 4 i V7 tokeni u `app/globals.css` | Uskladiti upotrebu postojećih tokena |
| Animacije | Framer Motion 13.2.0 i Umbra globalne komponente | Zadržati autoritet sistema; profilisati trošak |
| Sadržaj | `data/*` i `lib/content/*` | Sačuvati ID-jeve, slugove, tipove i query sloj |
| Aktuelno | `publishedAt`, centralno sortiranje, dve najnovije stavke | Sačuvati semantiku i poboljšati prezentaciju |
| Lokalizacija | SR/EN rute i language switch | Otkloniti razlike u SSR jeziku, metapodacima i UX-u |
| SEO | Metadata helperi, sitemap, robots, manifest, JSON-LD | Konsolidovati i proveriti izlaz |
| Svetovi | Projekti, likovi, epizode, arhiva i dodatni domenski tipovi | Razvijati prema stvarno raspoloživom sadržaju |

U aktuelnom paketu postoje dva projekta: „MRZIM SVOG BRATA“, sa statusom `in-production`, i „BIBLIJA“, sa statusom `development`. Postoji osam likova i dvanaest epizoda sa statusom `planned`. U izvornim podacima nema `publishedAt` vrednosti. Zato je prazan latest feed očekivano ponašanje, a ne greška sortiranja.

Kolekcije `stories`, `media`, `relationships`, `timelines` i `archive` u canonical entry fajlu namerno su prazne. Postojanje tipova i pomoćnih funkcija nije dokaz da je njihov sadržaj već napravljen. V8 ne treba da prikazuje izmišljene odnose, portrete, datume, trajanja, recenzije ili broj pregleda.

Zaključana produkciona struktura `UMBRA_STUDIO/01_BRAND` do `09_BACKUP` ostaje netaknuta. Web projekat zadržava svoje postojeće korene `app`, `components`, `data`, `lib` i `public`; predloženi podfolderi nalaze se unutar njih. Ne uvodi se nova paralelna arhitektura niti drugi nezavisni design system.

## 3 Ključna dijagnoza

**INFERENCE:** sadašnji kod već pokušava da ostvari premium izgled, ali najveći rizik predstavlja razlika između napisane dizajn namere i njene dosledne primene. Još dekorativnih slojeva bi uvećalo postojeće razlike. Prioritet je da korisnik odmah vidi dobru sliku, pročita poruku i razume sledeću radnju.

### Navigacija zahteva skriveno znanje

**FACT:** `Header.tsx` sprečava podrazumevani klik i čeka 260 ms. Jedan klik vodi ka sceni početne strane, a dvoklik otvara kategoriju. Tastaturna aktivacija ide ka sceni. U handleru nema zasebnog očuvanja ponašanja modifikovanog klika, kao što je Ctrl/Cmd klik.

**RECOMMENDATION:** glavni link vodi direktno na odgovarajuću stranicu jednim klikom. Linkovi ka scenama ostaju jasno označene radnje na početnoj. Logo vodi na početnu. Aktivno stanje razlikuje stranicu od lokalne scene. Uspešan ishod je da isti cilj bude dostupan mišem, dodirom, tastaturom i otvaranjem u novom tabu.

### Čitljivost je potisnuta dekoracijom

**FACT:** u analiziranim izvorima ima 147 pojavljivanja klase `text-[6px]` i 109 pojavljivanja `text-[7px]`, uključujući responsive varijante. To nisu brojevi jedinstvenih vidljivih elemenata. Header koristi i oznake od 5,5 px, desktop navigaciju od 9 px i veoma sitne CTA oznake.

**RECOMMENDATION:** važan tekst dobija čitljivu veličinu i dovoljan kontrast. Sitne dekorativne oznake mogu ostati samo ako ne prenose jedinu važnu informaciju. Tačan kontrast ocenjuje se prema konačnoj kompoziciji, uključujući providnost i sliku ispod teksta. WCAG prag za uobičajen tekst je 4,5:1, a za veliki tekst 3:1, uz definisane izuzetke.[^4]

### Prvi ekran sadrži poruke za developera

**FACT:** `LatestContentWindow.tsx` objašnjava unos datuma u canonical registry. YouTube stanje u `HomeHero.tsx` govori o dodavanju URL-a epizode. To su instrukcije za održavanje sajta koje trenutno ulaze u javni UI.

**RECOMMENDATION:** javne poruke opisuju dostupnost i sledeću radnju posetioca. Tehnička uputstva sele se u projektni README. Prazno stanje može voditi na postojeće projekte i kanal bez stvaranja lažnog sadržaja.

### Postojeći vizuali nisu dosledno korišćeni

**FACT:** `data/projects.ts` ima `cover` za „BIBLIJU“, ali `resolveProjectImage` u `CurrentProjectScene.tsx` proverava samo `source.coverSr`, `source.coverEn` i generičku pozadinu. Isti propust postoji u project grani funkcije `imageFor` u `LatestContentWindow.tsx`.

**RECOMMENDATION:** jedan izbor medija podržava i samostalni `project.cover` i lokalizovane korice izvornog dela. Redosled zavisi od konteksta: filmski hero, kartica projekta i prikaz knjige nemaju nužno isti najbolji asset.

### Fontovi i boje imaju više izvora

**FACT:** globalni font stack referencira `--font-geist-sans` i `--font-geist-mono`, a u pregledanom root layoutu fontovi nisu vezani kroz `next/font`. Hero dodatno nameće svoj inline font. Header ima `#c8a866` i `#f4dca6`, dok CSS i druge komponente često koriste `#c4a56b` i `#dfc88f`.

**RECOMMENDATION:** prvo potvrditi stvarni computed font i odabrati jednu osnovnu porodicu. Zatim centralizovati semantičke boje, uključujući namerne varijante. Ne uklanjati razlike naslepo; svaka razlika treba da ima definisanu ulogu. `next/font` pruža podršku za lokalne i automatski hostovane Google fontove.[^15]

### Prevod i SEO nisu završeni samo zato što postoje EN rute

**FACT:** generisani HTML za `/en` i `/en/latest` počinje sa `lang="sr"`; jezik se naknadno menja u efektu. `/en` nasleđuje srpski title. Na pregledanim početnim stranicama nema canonical linka, a na pregledanim stranicama nema `hreflang` linkova. Naslovi pojedinih projektnih detalja sadrže „Umbra Studio“ dvaput.

**RECOMMENDATION:** ispravan jezik treba da postoji u početnom HTML-u, a svaki par prevoda dobija odgovarajuće metapodatke. Layout rešenje bira se nakon provere aktuelne Next arhitekture, uz očuvanje javnih URL-ova. Ne dodavati drugi `<html>` u običan nested layout.

### Build prolazi, ali ostaju latentni domenski rizici

**FACT:** `getProjectsHref('sr')` u `lib/navigation/index.ts` vraća `/projects`, a `getCharactersHref('sr')` vraća `/characters`, iako su stvarne SR rute `/serije` i `/likovi`. U ciljanoj pretrazi nisu pronađeni njihovi pozivi iz UI-ja, pa ovo nije potvrđen aktivni 404 tok. Helperi takođe definišu putanje epizoda i priča za koje u arhivi ne postoje page fajlovi.

**RECOMMENDATION:** ispraviti ugovor i testirati mapiranje pre šire upotrebe. Ne uvoditi nove episode/story rute samo da bi se opravdalo postojanje helpera.

## 4 Nalazi sa weba i primena na Umbru

Ovo je izbor relevantnih referenci, ne statističko istraživanje celog tržišta. Iz njih se ne izvodi tvrdnja da jedan stil predstavlja univerzalni trend 2026. godine. Dizajn zaključci imaju status INFERENCE.

| Referenca | Provereno zapažanje | Primena u V8 |
| --- | --- | --- |
| A24 | Sajt stavlja filmske naslove i vizuale u prvi plan; sadržaj je razdvojen po vrsti | Projekti i objavljeni sadržaj nose prvi utisak; diskretna studijska grafika ih prati |
| Pentagram | Radovi, arhiva, pretraga i kategorije imaju jasno mesto u strukturi | Jedan sistem predstavljanja projekata, sa konzistentnim detaljima i vezama |
| Stink Studios | Portfolio povezuje radove, discipline, opis studija i vesti | Jasno objasniti šta Umbra radi i omogućiti neposredan ulazak u stvarne radove |

Izvori su zvanični sajtovi navedenih studija.[^1][^2][^3] A24 je pregledan i u pregledaču; ostale dve reference korišćene su za javno dostupnu strukturu i sadržaj. Nije sproveden njihov performance ili accessibility audit, pa nisu predstavljene kao primeri potpune tehničke usklađenosti.

**Preporučeni smer:** zadržati crnu i toplu champagne paletu, ali povećati ulogu fotografije, tipografije i kompozicije. Koristiti prostran raspored, urednički izbor sadržaja, precizne odnose naslova i slike i nekoliko prepoznatljivih, tihih pokreta.

**Alternative:** dramatičan WebGL/3D uvod ima smisla samo ako postoji jedinstvena umetnička ideja, odgovarajući materijal i potvrđen budžet performansi. Svetli galerijski identitet predstavlja veću promenu brenda i nije preporučena osnova za ovaj V8. Obe opcije imaju veći trošak i slabije čuvaju kontinuitet od evolucije postojećeg stila.

## 5 Cilj sajta i merila uspeha

**ASSUMPTION:** primarna publika su gledaoci koji žele da upoznaju Umbru, pronađu seriju i pređu na raspoloživi video. Sekundarna publika su zainteresovani čitaoci i budući saradnici. Podaci o stvarnoj publici i saobraćaju nisu dostupni.

Tri najvažnija puta su: početna → projekat → dostupan video; početna → aktuelno → objavljeni sadržaj; projekat → lik → povratak u isti svet. Redizajn treba da olakša te putanje i omogući dobro čitanje na telefonu.

Posle objave meriti broj ulazaka u projekat, klikova ka YouTube-u, izbora objavljene epizode, neuspešnih pretraga i tehničkih grešaka. Outbound klik ka YouTube-u nije dokaz odgledane epizode ili pretplate. Ne postavljati izmišljeni cilj rasta konverzije pre osnovnog merenja.

## 6 Vizuelni sistem V8

### Boje i površine

Polazne površine su postojeće tople crne nijanse `#030302`, `#060605` i `#0d0d0b`. Osnovni tekst zadržava toplu belu iz postojećeg sistema. Champagne akcenti headera služe kao referenca za konačno usklađivanje. Zlato označava aktivnost, fokus, tanku liniju ili diskretan detalj.

Definisati odvojene semantičke tokene za glavni tekst, sekundarni tekst, metapodatke, fokus, liniju, aktivni element i status. Status se prenosi i rečju. Providnost sekundarnog teksta ne prepuštati svakoj komponenti zasebno.

### Tipografija

Sledeće vrednosti su početna specifikacija, ne WCAG propis. Proveravaju se sa srpskim dijakriticima, engleskim tekstom, dužim naslovima i uvećanjem.

| Uloga | Početni V8 opseg | Pravilo |
| --- | --- | --- |
| Glavni naslov na širokom ekranu | 56–88 px | Prelom prema smislu i raspoloživom prostoru |
| Glavni naslov na telefonu | 36–48 px | Bez prinudnog razbijanja svake reči u novi red |
| Naslov sekcije | 32–52 px | Jasna razlika u odnosu na H1 |
| Uvodni pasus | 18–22 px | Kratak tekst sa dovoljnom visinom reda |
| Osnovni tekst | 16–18 px | Oko 55–75 znakova po redu na širokom prikazu |
| Navigacija i CTA | 13–15 px | Odvojiti veličinu teksta od veličine klik zone |
| Korisni metapodaci | 11–13 px | Dovoljan kontrast i čitljivost pri 100% prikazu |

Jedna glavna sans porodica obezbeđuje konzistentnost. Postojeći serif može ostati pažljivo korišćen urednički detalj. Izbor komercijalnog fonta zahteva pregled glifova i web licence; visoka cena nije dokaz boljeg izbora.

### Raspored i komponente

Zadržati postojeću skalu sadržaja od približno 1360 px i hero skalu od približno 1540 px dok vizuelna provera ne pokaže razlog za promenu. Uskladiti ih sa headerom od maksimalno 1680 px preko zajedničkih linija poravnanja. Nije potrebno nasilno izjednačiti sve širine.

Uvesti mali skup ponovljivih elemenata unutar `components/ui`: kontejner sekcije, naslov sekcije, tekstualni link, primarni CTA, oznaka statusa, medijski okvir i prazno stanje. Prvo definisati postojeće varijante; komponentu izdvajati tek kad ima jasnu zajedničku odgovornost.

Jedna kartica dobija jedan dominantan okvir. Sekcije mogu imati različitu kompoziciju: veliki izdvojeni projekat, miran spisak, portreti, čitljiv tekst. Unutrašnji ram, spoljašnji ram, ugaone oznake, glow i senka ne moraju istovremeno da nose istu poruku.

## 7 Početna stranica

### Header

Zadržati prepoznatljiv obodni progress, logo, tamnu površinu i champagne ton. Funkcionalne korekcije su direktna navigacija, vidljiv keyboard fokus, očuvanje standardnih browser linkova i odgovarajuća kontrola fokusa u meniju. Za mobilni meni prvo odrediti da li je modalni overlay ili otvorena navigaciona oblast; fokus i `inert` ponašanje zatim uskladiti sa tim modelom.

Sat, datum i lokalna vremenska zona ostaju diskretan sekundarni sloj jer su deo postojećeg header ugovora. Ne širiti ovaj deo. Oznaka lokacije izvedena iz vremenske zone ne predstavlja GPS lokaciju niti lokaciju sedišta studija.

### Hero

Sačuvati ideju Umbra prozora i pristup kategorijama, uz jasnije odvajanje identiteta studija od promenljivog sadržaja. Predlog je stabilan naslov ili kratka brand poruka, jedan dominantan vizual i najviše jedna primarna i jedna sekundarna radnja u istom fokusu.

Postojećih pet izbora ostaju dostupni kao urednički indeks. Na desktopu indeks ima rezervisan prostor; ne treba da prekriva kartice ili kontrole. Na telefonu se sadržaj slaže po smislu, uz vidljive kategorije i prirodnu visinu sekcije. Ne forsirati veliki minimalni viewport na svakom bloku.

Automatska rotacija je trenutno na devet sekundi. **RECOMMENDATION:** ručni izbor kao podrazumevano ponašanje. Ako se zadrži auto-rotacija, obezbediti zasebno pause/resume dugme, zaustavljanje kada fokus uđe u ceo carousel i kad je miš iznad njega, bez samostalnog nastavka posle korisničkog zaustavljanja. To prati WAI carousel smernice.[^6]

### Aktuelno

Sačuvati centralno pravilo najviše dve stvarno objavljene stavke. Nula stavki daje uredno prazno stanje; jedna stavka daje jednu karticu; dve daju dve. Ne duplirati stavku radi simetrije. `featured` ostaje urednički izbor, a `publishedAt` redosled stvarne objave.

Latest kartice treba da budu zasebno čitljive: vrsta sadržaja, naslov, stvaran datum i jedna radnja. Smanjiti broj oznaka koje ponavljaju „latest“, „editorial“ ili „window“. Na mobilnom rasporedu nemaju fiksnu malu visinu koja odseca duži tekst.

### Projekti u fokusu

„MRZIM SVOG BRATA“ dobija dominantan tretman kao postojeći featured projekat, dok „BIBLIJA“ ima zasebnu, jasnu prezentaciju i svoj stvarni cover. Time se dobija hijerarhija bez brisanja drugog projekta. Prikazati potvrđen status, kratak opis i ulaz u detalj.

Korice knjige prikazivati kao korice kada je cilj predstavljanje izvornog dela. Filmski hero zahteva kadar prikladan širokom formatu. Ako odobren kadar još ne postoji, koristiti pošteno kompoziciono rešenje sa postojećom koricom, umesto agresivnog cropa koji odseca naslov i autora.

### Likovi

Na početnoj izdvojiti mali, urednički izabran skup tek nakon potvrde izbora. Kroz svaki prikaz se dolazi do dosijea, a „Svi likovi“ vodi u postojeću arhivu. Pošto canonical media kolekcija nema portrete, ne označavati generičku sliku kao konačan izgled lika.

Najveći vizuelni napredak u ovoj sekciji zahteva odobrene portrete sa doslednim identitetom, svetlom i kadrom. Fallback mora imati jasan, nameran dizajn. Javni teaser o liku ne treba automatski da otkriva čitav razvoj priče.

### Studio i završetak

`StudioScene` objašnjava šta Umbra radi kroz kratak, konkretan tekst i stvarni projekat kao dokaz. `StudioManifesto` dobija sažet završni iskaz. `WatchScene` daje najjasniju dostupnu sledeću radnju: video kada postoji, ili kanal dok video nije objavljen.

Footer grupiše postojeće glavne putanje, jezike, potvrđene profile i kontakt. Kontakt, pravni tekstovi i dodatni linkovi ulaze tek kada su stvarni i operativni. Nema praznih obećanja o funkcijama niti nepostojećih društvenih dokaza.

## 8 Unutrašnje stranice

| Porodica stranica | V8 raspored i ponašanje | Glavni uslov prihvatanja |
| --- | --- | --- |
| Projekti `/serije`, `/en/projects` | Izdvojeni rad pa pregled projekata; jednostavan status i opis | Oba stvarna projekta dostupna bez suvišnih filtera |
| Detalj projekta | Naslov, status, glavni medij, opis, epizode, povezani likovi, izvor | Planirana epizoda nema lažni play ni datum |
| Likovi `/likovi`, `/en/characters` | Jasno poreklo projekta, dosledni portreti/fallbacki | Filter, ako postoji, zadržava smisao i na telefonu |
| Dosije lika | Sažetak, odobreni detalji, veze prema stvarnim podacima | Nema izmišljenih odnosa i neodobrenog vizuelnog kanona |
| Aktuelno | Isti canonical redosled, prilagođen rasporedu stranice | Početna i latest stranica ne daju različite definicije objave |
| Arhiva | Objasniti razliku u odnosu na aktivne projekte | Nema paralelne ručno održavane kopije istog sadržaja |
| Pretraga | Jasno polje, tip rezultata, vraćanje unosa i stanje bez rezultata | Ne vodi na nepostojeće episode/story rute |
| Loading, 404, error | Mirne, brze povratne informacije i izlaz | Greška nikada ne ostavlja trajnu zavesu preko interfejsa |

Pretraga već postoji na `/pretraga`. EN ekvivalent `/en/search` nije u arhivi. **PROPOSAL:** dodati ga samo ako pretraga ostaje javno istaknuta funkcija. Potrebni su zajednički prikaz, odgovarajući route mapping i očuvanje `q` upita pri promeni jezika. Za sada nisu potrebni eksterni search servis ili vektorska pretraga.

Zasebna stranica epizode ima smisla kada postoji objavljen video, konkretan opis i potreba za sledećom epizodom ili transkriptom. To je uslovni budući opseg, a ne obavezno dodavanje praznih stranica u V8.

## 9 Mediji i vizuelna produkcija

U `public` postoje šest raster slika; `umbra-avatar.png` i `umbra-profile.png` imaju identične bajtove. Avatar je 1254 × 1254 px i oko 1,77 MB, pozadina 1671 × 941 px i oko 2,08 MB. To su veličine izvornika: nisu dokaz da pregledač preuzima toliko kroz Next Image optimizaciju.

Prvo napraviti popis postojećih medija sa namenom, projektom, jezikom, odobrenjem, dimenzijama, fokusnom tačkom i alt tekstom. Planirati širok kadar za hero, prikaz projekta, koricu, portret i deljenu OG sliku kao različite upotrebe. Čuvati master i optimizovane izvoze u postojećim odgovarajućim folderima.

U `lib/media/index.ts` proširiti postojeći sloj samo potrebnim pravilima izbora. U UI slati već razrešen prikaz medija. Podržati `project.cover`, lokalizovane source korice i pošten fallback. Razdvojiti sliku sadržaja od dekorativne pozadine.

Za V8 koristiti odgovarajući `sizes`, realan odnos stranica i optimizovanu veličinu. Prioritet dobija stvarni LCP kandidat, ne svaka slika u hero sistemu. Aktuelna Next dokumentacija označava `priority` kao deprecated od verzije 16 u korist `preload`; promenu primeniti uz proveru tačno instalirane verzije i bez preopterećenja preload liste.[^8]

Video u hero-u ostaje opcion. Ako se uvede, potreban je dobar poster, mogućnost pauze, odsustvo automatskog zvuka i prihvatljiv mobilni prikaz. Spoljni plejer se inicijalno može predstaviti lakom naslovnicom i aktivirati nakon namerne radnje. To se proverava zajedno sa pravilima konkretne platforme i potrebama privatnosti.

## 10 Animacija i performanse

`UmbraMotionSystem` ostaje izvor scroll podataka, `UmbraSceneDirector` upravlja scenama, a vizuelne komponente koriste njihove izlaze. Ne dodavati Lenis, GSAP ili drugi globalni scroll sistem bez dokazane potrebe i plana uklanjanja preklapanja.

Profilisati postojeće efekte pre rezanja. Proveriti da li se renderi pokreću pri svakom scroll događaju, da li više komponenti u istom frejmu meri isti layout i da li se petlje zaustavljaju kada nema potrebe. Ne pretpostaviti da postojeći sistem nema optimizacije: u njemu već postoje observeri, reduced-motion obrada i praćenje vidljivosti dokumenta.

Za mikrointerakcije početni cilj je 140–240 ms, za promenu panela približno 220–400 ms, a za diskretno otkrivanje slike do oko 650 ms. To su predlozi, ne standardni obavezni brojevi. Navigacija ne treba da čeka dekorativnu završnicu. Kod reduced-motion režima važan sadržaj mora odmah biti vidljiv, uz mirniju alternativu; Motion dokumentacija opisuje globalna i lokalna podešavanja.[^9]

| Merilo | V8 cilj | Način tumačenja |
| --- | --- | --- |
| LCP | ≤ 2,5 s | Terenski cilj na 75. percentilu |
| INP | ≤ 200 ms | Terenski cilj na 75. percentilu |
| CLS | ≤ 0,1 | Terenski cilj na 75. percentilu |
| Početni prenos stranice | PROVISIONAL budžet oko 1,5 MB bez videa/PDF-a | Potvrditi prema izmerenom baseline-u i kvalitetu vizuala |
| Hero slika | PROVISIONAL 200–400 KB za tipičan prikaz | Nije ograničenje master fajla; proveriti kvalitet i responsive isporuku |
| Reakcija navigacije | Bez namernog čekanja na dvoklik | Proveriti u stvarnoj interakciji |

Core Web Vitals pragovi potiču iz Google web.dev smernica; segmentirati mobile i desktop.[^10] Lighthouse služi dijagnostici i kontroli regresije. Jedan dobar laboratorijski rezultat nije dokaz dobrog INP-a stvarnih posetilaca. Ne obećavati „100/100“ kao zamenu za upotrebljivost.

## 11 Pristupačnost i responzivnost

Projektni cilj je WCAG 2.2 AA kroz stvarne korisničke tokove. To nije tvrdnja o postojećoj usklađenosti. Uključiti tastaturu, vidljiv fokus, smislen heading redosled, skip link, razumljive nazive kontrola, dovoljan kontrast i ispravan jezik dokumenta.[^16]

Za dodirne kontrole ciljati približno 44 × 44 CSS px kada raspored to dopušta. Ne predstavljati to kao WCAG 2.2 AA minimum: kriterijum 2.5.8 navodi 24 × 24 CSS px uz izuzetke i pravila razmaka.[^5]

Proveriti prikaz od 320 px širine naviše, uvećanje teksta od 200%, landscape telefon, tablet i kratak laptop ekran. Koristiti i stvarne uređaje. Test matrica treba da uključi Chromium, Firefox i Safari/WebKit, uz posebnu proveru iOS Safari ponašanja.

Najvažniji mobilni rizici su preklapanje fiksnog headera i anchor cilja, odsečen tekst unutar medijskog prozora, sakrivene kontrole i zavisnost od hovera. Mobilni CSS trenutno ima scroll margin od 62 px, dok sam header koristi veće minimalne visine; konačnu stvarnu geometriju izmeriti u runtime-u.

Custom scrollbar je postojeća funkcija i zadržava se samo uz ispravno tastaturno ponašanje, Page Up/Down, Home/End i jasan fallback. Ako JavaScript ne inicijalizuje kontrolu, sadržaj i uobičajeno skrolovanje moraju ostati upotrebljivi. Browser Find i povratak na prethodnu stranicu ne smeju da izgube korisnikov položaj bez razloga.

## 12 Tehnička arhitektura

Sačuvati canonical content i query sloj. Ne dodavati CMS, bazu, autentikaciju ili administratorski panel samo zato što V8 treba da izgleda profesionalnije. Takve promene imaju smisla kada postoji dokazano uredničko usko grlo ili više urednika.

Velike komponente, kao što su `CharactersArchive.tsx` i `CharacterDossier.tsx`, razdvajati po odgovornostima: javni prikaz, interaktivna kontrola, selector podataka i formatiranje. Cilj nije proizvoljno ograničenje broja linija, nego manji rizik pri izmeni i jasnije granice testiranja.

Server Components koristiti za statičan sadržaj i pripremu podataka, a client granice suziti na potrebnu interakciju. Pomeranje same direktive nije dovoljno: važan je graf importova. Next dokumentacija izričito povezuje uže client granice sa smanjenjem klijentskog JavaScript-a.[^7]

Postojeće UI primitive mogu se izdvojiti u `components/ui/`, a zajednički projektni prikaz u `components/projects/`. To su predloženi podfolderi, ne nova obavezna složena hijerarhija. Ne vraćati nepostojeći `data/design-system.ts` iz starijih beleški: konkretan ZIP već koristi `app/globals.css` kao globalni izvor dizajn vrednosti.

## 13 Sadržaj i objavljivanje

Zadržati razliku između `visibility`, produkcionog `status`, `publishedAt`, planiranog datuma i `featured`. Posebno proveriti da javno vidljiva planirana epizoda može imati informativan red, ali ne dobija tretman objavljenog videa.

Latest testovi pokrivaju: nula, jedna, dve i više stavki; privatnu stavku; nedostajući ili neispravan datum; budući datum; epizodu bez published statusa; isti timestamp i determinističan redosled. Za buduću zakazanu objavu definisati kada se stranica ponovo generiše. Trenutni build prerenderuje početnu i latest stranice, pa samo proticanje sata ne dokazuje da će buduća stavka automatski postati vidljiva bez novog renderovanja ili deploya.

Validaciju sadržaja vezati za operativni razvojni gate. Za svaki stvarni novi sadržaj proveriti odgovarajući asset, dozvoljenu javnu putanju, prevode i status. Urednik treba da može da doda sadržaj na jednom mestu bez menjanja nekoliko UI komponenti.

## 14 SEO i jezici

Uskladiti `lib/seo/index.ts` i `lib/seo/jsonLd.ts`: prvi koristi environment URL sa localhost fallbackom, drugi ima fiksan workers.dev URL. V8 treba da ima jedan potvrđen origin za production, uz jasan staging režim. Ne nagađati novi domen niti menjati hosting u sklopu vizuelnog redizajna.

Svaka javna SR/EN stranica dobija odgovarajući naslov, opis, canonical i par alternates. Naslov stranice ne uključuje studio suffix ako ga već dodaje layout template. Za prevode uključiti oba smera i samu stranicu u `hreflang` skup; Google dokumentuje ta pravila.[^11]

Sitemap treba da koristi istu politiku javne vidljivosti kao rute. Trenutno direktno prolazi kroz podatke projekata i likova; proveriti ponašanje pre pojave privatnog ili uklonjenog sadržaja. Ne unositi izmišljene `lastModified` datume niti nepostojeće episode putanje.

Planirati stvarne OG slike za početnu i projekte, uz proveru cropa i jezika. `VideoObject` koristiti tek kada postoje objavljen video i potrebna stvarna polja; schema ne stvara pravo na rich result i ne zamenjuje sadržaj.[^13]

## 15 Šta bi dodao profesionalni tim

| Odgovornost | Konkretan doprinos V8 | Dokaz da je posao završen |
| --- | --- | --- |
| Product i UX | Tri glavna korisnička toka i jasan opseg | Tokovi se završavaju bez objašnjenja skrivenih radnji |
| Art direction | Odobren raspored, tipografija i izbor vizuala | Uporedivi desktop i mobile prikazi sa stvarnim sadržajem |
| Frontend | Zajedničke primitive i precizne responsive varijante | Dosledan prikaz kroz porodice stranica |
| Arhitektura | Granice server/client i stabilni sadržajni ugovori | Nema nepotrebnog proširenja runtime-a |
| QA i accessibility | Keyboard, touch, jezik, error i empty stanja | Evidencija scenarija i zatvorenih nalaza |
| Performance | Osnovno merenje i kontrola regresije | Reproduktivni podaci, ne samo subjektivan osećaj |
| Content i SEO | Stvarni metapodaci, prevodi, statusi i objave | Sadržaj i generisani HTML se slažu |
| Release | Tačan deploy put i mogućnost povratka | Proveren preview i poznata prethodna verzija |

Ovo je model odgovornosti, ne tvrdnja da je na analizi učestvovao stvarni tim. Za veličinu Umbre jedna osoba može pokriti više uloga, uz odvojene prolaze kroz dizajn, implementaciju i proveru.

Dodatna korisna profesionalna praksa je kratak registar odluka: problem, izabrano rešenje, alternativa, razlog i pogođeni fajlovi. Postojeća dokumentacija treba da vodi ka jednom važećem checkpointu. Nisu potrebni deseci administrativnih fajlova.

## 16 Prioriteti i zavisnosti

| Prioritet | Posao | Zašto sada | Zavisnost |
| --- | --- | --- | --- |
| P0 | Vizuelni baseline i potvrda deployment putanje | Sprečava regresije i pogrešnu polaznu verziju | Prikaz aktuelnog projekta i konfiguracija okruženja |
| P0 | Navigacija, čitljivost, javni copy | Direktno utiče na korišćenje | Dogovor o eksplicitnim V8 korekcijama headera |
| P0 | Jezici, title i canonical konzistentnost | Potvrđeni problemi u izlaznom HTML-u | Jedan origin i zajednički metadata ugovor |
| P1 | Tokeni, fontovi i osnovne primitive | Sve naredne sekcije zavise od njih | Vizuelna specifikacija |
| P1 | Hero, latest i projekti | Najveći vizuelni i sadržajni uticaj | Pravi asseti i pravila praznih stanja |
| P1 | Project i character stranice | Zaokružuju glavne korisničke putanje | Zajednički prikaz i stabilni podaci |
| P1 | Mobile, accessibility, performance i SEO gate | Potrebni za završetak V8 | Implementirane ključne porodice stranica |
| P2 | EN pretraga i urednički alati | Korisni kada se potvrdi potreba | Postojeći search ugovor i urednički workflow |
| P2 | Video hero, dodatna animacija, press paket | Zavisni od materijala i jasne koristi | Odobreni mediji i preostali performance budžet |

## 17 Redosled implementacije po fajlovima

Osnovna Windows putanja je `C:\Users\Aleksandar\Desktop\Umbra Studio\umbra-studio`. Putanje ispod su relativne u odnosu na nju. Ovaj redosled je operativni predlog; potpuna lista novonastalih pomoćnih fajlova potvrđuje se po odabranoj arhitekturi.

Svaki korak: pročitati ceo fajl → proveriti njegove zavisnosti → pripremiti kompletan replacement → proveriti tipove, lint i build → proveriti pogođeni UI → zaključati rezultat. Kada promena ugovora dodiruje više fajlova, prvo dodati kompatibilnu varijantu u jednom fajlu, zatim prebacivati potrošače jedan po jedan, pa ukloniti staru varijantu. Time međukoraci ostaju izgradivi.

| Red | Fajl ili grupa za uzastopnu obradu | Predviđen posao |
| --- | --- | --- |
| 0 | Postojeći package, AGENTS, README i deployment konfiguracija | Zabeležiti baseline, identitet verzije i gde se proverava preview |
| 1 | `app/globals.css` | Konsolidovati postojeće tokene i čitljivu skalu, uz kompatibilne alias-e |
| 2 | `app/layout.tsx` | Vezati odabrane fontove, postaviti zajednički okvir i pripremiti metadata pravila |
| 3 | `lib/navigation/index.ts` | Ispraviti SR/EN ugovor bez stvaranja nepostojećih ruta |
| 4 | `components/LanguageSwitcher.tsx` | Koristiti zajedničko mapiranje i očuvati relevantan URL state |
| 5 | `components/Header.tsx` | Zadržati art direction i sprovesti eksplicitno prihvaćene UX korekcije |
| 6 | `lib/media/index.ts` | Definisati odgovarajuće izbore medija i podržati postojeći project cover |
| 7 | `components/LatestContentWindow.tsx` | Čitljive kartice i poštena nula/jedna/dve stanja |
| 8 | `components/HomeHero.tsx` | Jača kompozicija, rezervisan prostor indeksa, kontrola rotacije |
| 9 | `components/CurrentProjectScene.tsx` | Featured hijerarhija i pravilni vizuali oba projekta |
| 10 | `components/CharactersScene.tsx` | Jasan uvod u likove, smisleni fallbacki i dostupni linkovi |
| 11 | `components/StudioScene.tsx` | Sažeti tekst i dokaz kroz radove |
| 12 | `components/WatchScene.tsx` | Dostupna video/kanal radnja i lagan početni prikaz |
| 13 | `components/StudioManifesto.tsx` | Precizan završni iskaz bez ponavljanja |
| 14 | `components/Footer.tsx` | Konsistentna navigacija i stvarni operativni podaci |
| 15 | `app/page.tsx`, zatim `app/en/page.tsx` | Ujednačiti sastavljanje, oznake i localized metadata |
| 16 | SR i EN project index/detail page fajlovi | Jedan prikaz po porodici uz locale podatke; svaki fajl zasebno |
| 17 | `CharactersArchive.tsx`, `CharacterDossier.tsx`, pa njihove rute | Razdvajanje odgovornosti i dosledna prezentacija |
| 18 | Archive, latest i search page fajlovi | Zajednička pravila prikaza, praznih stanja i filtriranja |
| 19 | `lib/seo/index.ts`, `lib/seo/jsonLd.ts`, `app/sitemap.ts`, `app/robots.ts` | Jedan origin, bez duplog suffix-a i pogrešnih javnih putanja |
| 20 | Layout rešenje za jezike i `UmbraDocumentLanguage.tsx` | Server ispravan jezik uz očuvanje URL-ova; precizna mapa izmena pre rada |
| 21 | Umbra motion/scene/transition/scrollbar fajlovi | Samo izmene potkrepljene profilisanjem i korisničkim nalazima |
| 22 | `app/loading.tsx`, `app/not-found.tsx`, `app/global-error.tsx` | Dostupna završna stanja bez trajnog blokiranja interfejsa |

SEO ispravke mogu se sprovesti ranije kao zasebna kompatibilna celina jer su P0. Tabela prikazuje redosled zavisnosti za glavni dizajn prolaz, a ne zahtev da se potvrđena greška čeka do kraja. Ako rešavanje server jezika zahteva promenu layout organizacije, uraditi tu celinu pre šireg rada na rutama.

## 18 Testovi i kriterijumi prihvatanja

Automatizacija treba da pokrije rizik, a ne da mehanički proverava sopstvenu implementaciju. Najviše vrede testovi mapiranja ruta, pravila objave, dostupnosti navigacije i generisanih metapodataka. Za čisto dekorativnu promenu nije potreban zaseban unit test.

**Za svaki kompletan replacement:** `npx tsc --noEmit`, `npm run lint -- --max-warnings=0` i `npm run build`. Pokretati ih u odgovarajućem redosledu; ne dozvoliti da paralelni build i type generation daju nepouzdan rezultat. Na Windowsu po potrebi koristiti `npm.cmd` i `npx.cmd`.

**Za kritične tokove:** početna → projekat; SR ↔ EN na detalju; header mišem i tastaturom; mobilni meni otvaranje/zatvaranje/povratak fokusa; zero/one/two latest stanje; 404 i error povratak; browser back/forward; reduced-motion; prikaz na telefonu; prelazak na stvarni video kada bude objavljen.

**Za sadržaj:** nijedan planned video nema play dugme koje glumi objavu; privatan sadržaj ne ulazi u javni feed ili sitemap; nema lažnih datuma i kanonskih činjenica; svi lokalni asseti i javne putanje postoje.

**Za izgled:** nema odsečenog teksta, preklapanja kontrole i slike, horizontalnog overflowa, sitnog važnog teksta ili slučajnih font fallbackova. Svaka proverena širina ima zabeležen screenshot pre i posle. Svaki format mora da koristi stvaran sadržaj, uključujući najduže naslove.

**Za FINAL:** završeni kod, potvrđena vizuelna provera, prođeni kritični tokovi, konkretna performance evidencija i proveren ciljni deploy. Ako neki deo nije testiran, oznaka mora precizno reći šta je završeno i šta je UNKNOWN. Build PASS sam po sebi nije FINAL.

## 19 Procena vremena i troška

Sledeća procena je PROVISIONAL inženjerska procena, ne tržišna ponuda niti obećanje roka. Pretpostavlja postojeći mali lokalni registry, bez CMS migracije, kupovine, naloga ili kompleksnog 3D-a. Ne uključuje čekanje na odobrene portrete, nove video materijale i prevode.

| Faza | Procena fokusiranog rada |
| --- | --- |
| Baseline, vizuelna specifikacija i UX odluke | 12–20 h |
| Tokeni, fontovi, primitive i navigacija | 20–32 h |
| Početna stranica i postojeći mediji | 24–40 h |
| Unutrašnje stranice i SR/EN usklađivanje | 28–44 h |
| Accessibility, performance, SEO i release provera | 24–40 h |
| **Ukupno** | **108–176 h** |

Pri šest fokusiranih sati dnevno to je približno 18–30 radnih dana, pre dodatne rezerve za nepredviđene probleme i produkciju vizuala. Jedan fajl po koraku i puni build gate troše vreme, ali daju jasniju kontrolu. Ne procenjivati novčani trošak bez satnice, budžeta vizuala i potvrđene hosting potrebe.

Moguć je raniji prvi release koji obuhvata čitljivost, direktnu navigaciju, public copy, medijske propuste i potvrđene metadata greške. Taj release ima vrednost i pre završetka svih dekorativnih detalja, ali ne treba ga nazvati kompletnim V8 ako unutrašnje stranice i QA ostanu nedovršeni.

## 20 Tehnologije koje ne treba uvoditi automatski

React 19.3 je naveden na zvaničnom React blogu sa datumom 9. septembar 2026.[^14] To nije razlog da se migracija pomeša sa vizuelnim redizajnom. Postojeća kombinacija iz ZIP-a prolazi lokalne provere; kompatibilnost novih verzija procenjuje se odvojeno, uz bezbednosne ispravke kada su relevantne.

Aktuelna Cloudflare Next.js dokumentacija preporučuje vinext za svoje okruženje, dok postojeći OpenNext put navodi kao zasebnu mogućnost za postojeće aplikacije.[^12] ZIP ne sadrži dovoljan deployment manifest za utvrđivanje stvarnog produkcionog puta. **RECOMMENDATION:** prvo utvrditi kako sadašnja Umbra zaista radi; ne pokretati hosting migraciju samo zbog promene preporuke dobavljača.

CMS, korisnički nalozi, newsletter, shop, AI chatbot, kompleksna analitika, velike animacione biblioteke i interaktivne mape odnosa ostaju izvan osnovnog obima dok se ne pokaže potreba. Za ovo stanje najveću korist imaju kvalitetni vizuali, čitljiv sadržaj i pouzdani postojeći tokovi.

## 21 Konkretan početak V8

Prvi sledeći radni paket je vizuelni baseline postojeće početne i jedne projektne stranice na telefonu i desktopu, uz potvrdu stvarne deployment konfiguracije. Rezultat je merljiva referenca i lista očuvanja, ne novi početak V6/V7.

Prvi implementacioni fajl nakon toga je `C:\Users\Aleksandar\Desktop\Umbra Studio\umbra-studio\app\globals.css`, sa pregledom celog fajla i svih potrošača ključnih tokena. Ako potvrda computed fontova ukaže da je prvo potrebno vezivanje fonta, `app/layout.tsx` se obrađuje kao prethodni, zaseban kompatibilan korak.

V8 ostaje evolucija postojećeg Umbra sistema: isti studio i stvarni projekti, uz precizniji izgled, manje napora za posetioca i jasnije održavanje.

## 22 Izvori

Web izvori provereni su 14. septembra 2026. Dokumentacija je promenljiva; aktuelne API tvrdnje proveriti ponovo u trenutku implementacije. Gde datum publikacije nije istaknut, naveden je izdavač i naslov bez izmišljanja datuma.

Lokalni dokazni izvori: `umbra-studio(1).zip`; `AGENTS.md`; `README-V7.md`; `V7-VALIDATION.md`; `package.json`; `package-lock.json`; `app/globals.css`; `app/layout.tsx`; obe početne stranice; `components/Header.tsx`; `components/HomeHero.tsx`; `components/LatestContentWindow.tsx`; `components/CurrentProjectScene.tsx`; `components/LanguageSwitcher.tsx`; `components/UmbraDocumentLanguage.tsx`; `lib/content/index.ts`; `lib/content/latest.ts`; `lib/navigation/index.ts`; SEO helperi; sitemap; izvorni podaci projekata, likova i epizoda. Generisani HTML i rezultati komandi odnose se na radnu kopiju ove arhive. Književni PDF-ovi nisu reprodukovani niti korišćeni za izmišljanje novog kanona.

[^1]: A24. [Zvanični sajt](https://a24films.com/). Referenca za filmski sadržaj, vizuale i strukturu studija.
[^2]: Pentagram. [Zvanični sajt](https://www.pentagram.com/). Referenca za portfolio, arhivu i klasifikaciju radova.
[^3]: Stink Studios. [Zvanični sajt](https://www.stinkstudios.com/). Referenca za povezivanje studija, radova i vesti.
[^4]: W3C WAI. [Understanding SC 1.4.3 Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). Pragovi kontrasta i izuzeci.
[^5]: W3C WAI. [Understanding SC 2.5.8 Target Size Minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html). Minimum od 24 CSS px i izuzeci.
[^6]: W3C WAI ARIA APG. [Carousel Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/). Kontrole rotacije i ponašanje fokusa.
[^7]: Vercel Next.js. [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components). Granice klijentskog grafa i smanjenje JavaScript-a.
[^8]: Vercel Next.js. [Image Component](https://nextjs.org/docs/app/api-reference/components/image). Ažurirano 25. avgusta 2026. prema stranici. Responsive slike, sizes, preload i optimizacija.
[^9]: Motion. [Create accessible animations in React](https://motion.dev/docs/react-accessibility). Reduced-motion ponašanje i alternative animaciji.
[^10]: Philip Walton, Google web.dev. [Web Vitals](https://web.dev/articles/vitals). Objavljeno 4. maja 2020, poslednja navedena izmena 31. oktobra 2024; aktuelni pragovi provereni pri pristupu.
[^11]: Google Search Central. [Localized Versions of your Pages](https://developers.google.com/search/docs/specialty/international/localized-versions). Hreflang i dvosmerno povezivanje prevoda.
[^12]: Cloudflare. [Next.js on Workers](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/). Aktuelni deployment putevi; ne predstavlja proveru konkretnog Umbra deploya.
[^13]: Google Search Central. [Video structured data](https://developers.google.com/search/docs/appearance/structured-data/video). Stvarna video polja i uslovi upotrebe.
[^14]: React tim. [React Blog](https://react.dev/blog). Indeks navodi React 19.3 i datum 9. septembar 2026.
[^15]: Vercel Next.js. [Font Optimization](https://nextjs.org/docs/app/getting-started/fonts). Lokalni fontovi i automatski self-hosting podržanih fontova.
[^16]: W3C. [Web Content Accessibility Guidelines 2.2](https://www.w3.org/TR/WCAG22/). Referentni standard za projektni cilj pristupačnosti.
