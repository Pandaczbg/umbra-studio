# Umbra Studio V9

V9 je update dostavljenog `umbra-studio(3).zip`, čija dokumentacija i interni npm broj potiču iz V8. Ovaj paket nastavlja tu tačnu osnovu. Stare V7/V8 beleške ostaju istorija; za ovu isporuku merodavni su ovaj dokument i izveštaji u update ZIP-u.

## Pokretanje

Node.js 22.18 ili noviji. U korenu projekta:

```powershell
npm ci
npm run check
npm run test:http
npm run start
```

Otvoriti http://localhost:3000. Za razvoj koristiti `npm run dev` umesto `npm run start`. Ne pokretati oba servera na istom portu. `npm run check` pokreće TypeScript, ESLint, testove i produkcijski build. `test:http` sam pokreće i zaustavlja test server. Izveštaji HTTP skripte su u `lib/tests/results`.

## Šta je promenjeno

Nova početna kompozicija, V9 crno-zlatni tokeni, preciznija interaktivna stanja i kontrast, podrška za reduced-motion. Dva nova lokalna WebP ambijentalna vizuala; originalni Umbra vizual ostaje u odeljku Studio. Naslovnice su očuvane.

Pregledani su javni srpski i engleski tekstovi. Naslovi nemaju završnu tačku. Plan epizoda je izričito privremen. Engleski PDF iz početnog projekta sadrži samo omot; uklonjen je link koji ga predstavlja kao ceo roman. Postojeći fajl nije brisan, a engleska naslovnica ostaje prikazana.

Umbra vodič otvara se preko ikone kompasa u zaglavlju. Bez podešavanja koristi lokalnu pretragu kratkog odobrenog sadržaja. To nije aktivan AI. Opciona AI integracija koristi serverski endpoint `/api/assistant`, bez novih paketnih zavisnosti. Aktivacija je zasebna; uputstvo je `AI_ASISTENT_SETUP.txt` u ZIP-u. Nikada ne stavljati ključ u javni fajl, klijentski kod ili NEXT_PUBLIC promenljivu.

## Gde održavati V9

- `app/v9.css`: zajednički V9 tokeni, nova početna kompozicija i konačne dopune postojećih V8 stilova.
- `components/v8/*`: aktivni zajednički prikazi; zadržane putanje čuvaju postojeću arhitekturu.
- `data/projects.ts`, `data/characters.ts`, `data/episodes.ts`: javni podaci SR/EN.
- `lib/site/copy.ts`, `lib/site/metadata.ts`: UI tekstovi i metapodaci.
- `components/v9/UmbraAssistant.tsx`, `assistant.css`: vodič i njegov panel.
- `lib/assistant/core.ts`: eksplicitna mala javna baza i serverske zaštite. Pri promeni biografija proveriti i ove odobrene sažetke; ne unositi kompletne izvore ni interne beleške.
- `public/images/v9`: optimizovane slike koje sajt zaista učitava.

Master PNG slike i promptovi nalaze se odvojeno u `ASSET_MASTERS` u update ZIP-u, nisu potrebni u javnom folderu. Postojeće neaktivne komponente ostaju zbog kontinuiteta; nisu alternativni aktivni V9 prikazi. Nema promena glavne produkcijske arhive UMBRA_STUDIO.

## Granice isporuke

Pročitan je sav izdvojeni tekst srpskog romana; iz Svetog pisma provereni su relevantni odlomci, ne svih 1.079 strana. Produkcijska Biblija nije dostavljena. Postojeći statusi i radni plan očuvani su iz početnog projekta; nisu pretvoreni u nove potvrđene produkcijske odluke.

Lokalni Node build ne potvrđuje Cloudflare adapter ili javni deploy. U dostavljenoj arhivi nema potpune adapterske konfiguracije. Hosting, nalog, stvarne .env datoteke i tajne nisu menjani. AI servis nije aktiviran ni testiran uživo. Tačni završni testovi i ograničenja navedeni su u `PROVERA.txt` u ZIP-u.
