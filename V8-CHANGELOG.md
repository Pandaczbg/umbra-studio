# Umbra Studio V8 — promene

## Implementirano

Aktivne stranice sada koriste `components/v8`. Svi postojeći javni SR/EN ulazi ostaju na istim adresama. Dodata je engleska pretraga, zajednički route resolver, lokalizovani SEO i server jezik. Početna, projektne arhive, likovi, dosjei, Aktuelno, Arhiva, pretraga, footer i error prikazi imaju zajednički V8 dizajn.

Header koristi direktne linkove. Meni je native modalni dijalog. Pet hero tabova bira se ručno. Sat je izolovan u zasebnu klijentsku komponentu, a obodni indikator koristi postojeći globalni scroll podatak. Jezički link pri aktiviranju preuzima stvarni URL sa trenutnim query/hash stanjem i otvara odgovarajuću lokalizovanu stranicu.

Projekti koriste centralni izbor slike. Sačuvan je odnos stranica knjiga, povezani su PDF downloadi, dodati su kanonski likovi za svaki projekat i sidra planiranih epizoda. Dosjei prikazuju postojeće podatke i javne povezane zapise kada postoje. Nedostajući portreti su označeni, bez izmišljenih fotografija.

Osnovne boje, mere, fokus, filteri i mobile prelom nalaze se u `app/v8.css`. Dodati su lokalni Geist, WebP varijante i eksplicitni Tailwind izvori. Izmenjene su samo reference ka optimizovanim slikama; originali su ostali netaknuti.

Nova čista publication funkcija zadržava V7 pravila najnovijih objava i dodaje testove. Search normalizacija je zajednička. Srpski helperi više ne vode na `/projects` ili `/characters`; epizode i priče vode do stvarnih sidara projekta.

## Sačuvano

`data/projects.ts`, `data/characters.ts`, `data/episodes.ts` i svi originalni javni asseti sačuvani su bajt za bajt. Zadržani su kanonski tipovi, registry, javni query slojevi i postojeći validator. Nema migracije sadržaja u drugi sistem.

Originalni motion/scene moduli nisu prepisivani. `UmbraMotionSystem` i `UmbraSceneDirector` ostaju montirani. Druge stare UI komponente ostaju u folderu radi kontinuiteta, ali ih nove rute ne koriste. Njihovo ponovno aktiviranje traži proveru kompozicije i Tailwind izvora.

## Namerni kompromisi

Root jezik određen pre renderovanja koristi `headers()` i Proxy, pa većina stranica koristi server renderovanje na zahtev. To nije čisto statički export. Puna provera ciljnog hostinga ostaje potrebna.

Katalog je mali i lokalni, pa nisu dodati CMS, backend, newsletter, analitika ili novi spoljni servisi. Nema automatskog videa. Objavljeni video dobija vezu ka stvarnom izvoru; dostavljeni podaci nemaju objavljene epizode.

Portreti, stvarni datumi objava, produkcione metrike i odnosi likova nisu izmišljeni. Redizajn ne menja autorski sadržaj romana.

## Predaja

Dodati su README sa Windows uputstvom, launcher, izveštaj istraživanja, izveštaj validacije, prethodni master plan, testovi i inventar sa SHA-256 otiscima. `V8-VALIDATION.md` određuje stvarni status paketa.
