# Umbra Studio V8

Kompletan izvorni paket V8 redizajna zasnovan na dostavljenom sajtu. Sadrzaj projekata, likova, epizoda, originalne slike i PDF izdanja sacuvani su iz izvornog ZIP-a. Novi prikaz koristi zajednicke SR/EN komponente, direktnu navigaciju i optimizovane slike.

**Status isporuke:** zavrsen izvorni kod i automatizovane provere. Vizuelni pregled u lokalnom browseru, realni mobilni uredjaji, Lighthouse/Core Web Vitals i ciljni hosting nisu potvrdjeni. Detalji su u `V8-VALIDATION.md`. Naziv FINAL_SOURCE oznacava izdanje izvornog paketa; nije potvrda produkcionog prihvatanja.

## Zamena na tvom racunaru

1. Zaustavi stari sajt u terminalu pomocu Ctrl+C.
2. U folderu `C:\Users\Aleksandar\Desktop\Umbra Studio` preimenuj postojeci `umbra-studio` u `umbra-studio-V7-backup`.
3. Raspakuj ZIP u isti roditeljski folder. Unutra je jedan folder `umbra-studio`; on treba da stoji pored backup foldera.
4. Ako tvoj stari projekat ima lokalna podesavanja koja nisu bila u dostavljenom ZIP-u, sacuvaj ih. Kopiraj svoju `.env.local` u novi folder ako je koristis. Hosting konfiguraciju koja nije bila dostavljena treba zasebno uskladiti, bez brisanja postojece konfiguracije.
5. Otvori `POKRENI-V8.cmd` za instalaciju i lokalni razvojni pregled, ili koristi komande ispod.

Ovaj paket sadrzi cele fajlove. Nije potrebno rucno lepiti delove koda. `node_modules`, `.next` i privremeni build cache namerno nisu u ZIP-u; generisu se na tvom racunaru za tvoj operativni sistem.

## Rucno pokretanje

Potreban je Node.js 22.18 ili noviji; paket je proveren na Node.js 24.19.0. Ne menjaj zakljucane verzije zavisnosti pre prve provere.

```powershell
Set-Location 'C:\Users\Aleksandar\Desktop\Umbra Studio\umbra-studio'
npm ci
npm run check
npm run dev
```

Otvori `http://localhost:3000`. Srpska pocetna je `/`, engleska `/en`.

Za lokalni production pregled, posle zaustavljanja razvojnog servera:

```powershell
npm run build
npm run start
```

HTTP smoke provera automatski pokrece i zaustavlja svoj lokalni server na portu 3218:

```powershell
npm run test:http
```

`npm run check` pokrece TypeScript, ESLint bez upozorenja, testove i production build. `test:http` zahteva prethodno zavrsen build. Rezultati se upisuju u `lib/tests/results`.

## Sta je novo

- Velika editorial pocetna sa postojecim filmskim vizualom, stabilnim naslovom i rucnim izborom pet sekcija.
- Champagne header sa direktnim linkovima, obodnim indikatorom napretka i izolovanim lokalnim satom na velikim ekranima.
- Mobilni meni sa native modal dijalogom, Escape zatvaranjem i povratkom fokusa.
- Zajednicki SR/EN prikazi projekata, likova, dosjea, aktuelnosti, arhive i pretrage.
- Potpuna `/en/search` ruta; promena jezika cuva parametre i fragment adrese.
- Ispravljene srpske navigacione putanje i linkovi pretrage ka epizodama unutar projekta.
- Pretraga i filteri preko standardnih GET formi; srpski dijakritici i dj imaju usaglaseno pretrazivanje.
- WebP varijante cetiri glavne slike, ispravan odnos stranica knjiga i lokalni Geist font sa licencom.
- Canonical, SR/EN hreflang, Open Graph, JSON-LD i sitemap iz javnih podataka.
- Citljiviji tekst, vidljivi fokusi, glavne kontrole najmanje 44px, reduced-motion i forced-colors pravila.
- Jasna prazna stanja bez izmisljenih objava, datuma, portreta ili videa.

## Gde se menja sadrzaj i dizajn

| Potreba | Fajlovi |
| --- | --- |
| Projekti, likovi, epizode | `data/projects.ts`, `data/characters.ts`, `data/episodes.ts` |
| UI tekstovi SR/EN | `lib/site/copy.ts` i tekstovi odgovarajucih server prikaza |
| Boje, razmaci, tipografija i responsive pravila | `app/v8.css` |
| Postojeci sistemski tokeni | `app/globals.css` |
| Header i mobilni meni | `components/v8/SiteHeader.tsx` |
| Lokalni sat | `components/v8/LocalTime.tsx` |
| Hero tabovi | `components/v8/HeroExplorer.tsx` |
| Pocetna | `components/v8/HomePage.tsx` |
| Arhive i pretraga | `components/v8/CollectionPages.tsx` |
| Projekat, lik, arhivski zapis | `components/v8/DetailPages.tsx` |
| Zajednicki elementi i footer | `components/v8/Primitives.tsx` |
| URL mapiranje | `lib/site/routes.ts`, `lib/site/content-links.ts` |
| Izbor slike | `lib/media/presentation.ts` |
| Objavljivanje | `lib/content/publication.ts`, `lib/content/latest.ts` |
| SEO | `lib/site/metadata.ts`, `lib/seo/jsonLd.ts`, `app/sitemap.ts` |

Ranije komponente na starim putanjama ostaju u paketu radi kontinuiteta; aktivne rute sada koriste `components/v8`. Ne menjaj stari `components/HomeHero.tsx` ocekujuci promenu V8 pocetne. Tailwind skenira aktivni `app` i `components/v8`; za ponovno aktiviranje starog utility UI-ja potrebno je prosiriti `@source` pravila.

`UmbraMotionSystem` i `UmbraSceneDirector` ostaju autoriteti za globalne podatke o skrolu/sceni. Novi prikaz koristi native skrol i CSS mikrointerakcije. Raniji vizuelni overlay, custom scrollbar i transition moduli sacuvani su kao fajlovi, ali ih V8 layout ne montira. Ovo je promena kompozicije; nije tvrdnja da su stari moduli profilisanjem dokazano spori.

## Objavljivanje novih materijala

Projekti i likovi vidljivi u arhivi ne postaju automatski najnovije objave. Za Aktuelno je potreban javni zapis sa validnim `publishedAt` datumom u proslosti/sadasnjosti. Epizoda mora dodatno imati `status: "published"`. Prazan feed je ocekivan sa dostavljenim podacima.

Nema izmisljenih portreta: tipografski dosje je namerno resenje dok odobreni medij ne postoji. Nova kanonska slika dodaje se kroz medijski registry; ne menjati identitet lika samo dekorativnim assetom.

Slugs za detalje dolaze iz javnog registry-ja tokom builda. Posle dodavanja novog projekta, lika ili arhivskog zapisa pokreni novi build. Nema baze, CMS-a, naloga ili skrivene spoljne usluge.

## Hosting i jezik

`proxy.ts` postavlja jezik na osnovu URL-a, a root layout cita taj jezik pre isporuke HTML-a. To zahteva Next server/kompatibilan runtime i uvodi dinamicko serversko renderovanje. Ovo nije static-export paket.

Produkcioni osnovni URL podesava se kroz `NEXT_PUBLIC_SITE_URL`. Ako vrednost nije zadata, ostaje domen iz dostavljenog projekta. Posle promene promenljive uradi novi build. Ne koristi development localhost kao javni canonical.

ZIP nije sadrzao dovoljno konfiguracije da se potvrdi postojeci Cloudflare adapter. Ne sadrzi novu hosting migraciju, pristupne kljuceve niti izvrsen deploy. Node production build je potvrda Node builda, a ne Cloudflare kompatibilnosti.

## Povratak na prethodnu verziju

Zaustavi V8, preimenuj njegov folder i vrati ime `umbra-studio` backup folderu. Pokreni prethodnu verziju na njenim postojecim podesavanjima. Podaci nisu migrirani u spoljnu bazu.

## Dokumentacija

`V8-RESEARCH.md` povezuje istrazene izvore sa izvedenim odlukama. `V8-VALIDATION.md` navodi granice testiranja. `V8-CHANGELOG.md` navodi izmene i sacuvane delove. `V8-FILES.json` sadrzi popis fajlova i SHA-256 otiske. Originalni odobreni plan je prilozen kao `V8-MASTER-PLAN.md`.
