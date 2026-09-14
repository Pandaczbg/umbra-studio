# Umbra Studio V7 — system upgrade pack

## Šta je V7

V7 je kontrolisana nadogradnja V6 koja uvodi stvarni **AKTUELNO / LATEST** editorial feed, jaču SEO osnovu, operativne route-e i čistiju centralizaciju sistema bez menjanja zaključane top-level folder strukture.

## Implementirano

- `publishedAt?: string` u canonical `ContentBase` tipu
- `lib/content/latest.ts` kao jedini izvor za latest editorial ordering
- tačno 2 najnovija javno objavljena sadržaja
- `featured` više ne utiče na latest redosled
- future `publishedAt` vrednosti se ne prikazuju
- epizode moraju imati status `published` da bi ušle u latest feed
- `components/LatestContentWindow.tsx` sa dve odvojene editorial kartice/prozora
- V6 `HomeHero` povezan sa canonical latest feedom
- `/aktuelno` i `/en/latest`
- SR/EN language switch za latest route
- `robots.txt`, `sitemap.xml`, `manifest.webmanifest`
- WebSite + Organization JSON-LD
- Breadcrumb JSON-LD na latest stranicama
- `global-error.tsx`
- Next Image `sizes` disciplina na novom latest UI sloju

## Važna činjenica o trenutnim podacima

V6 canonical data trenutno nema stvarne `publishedAt` vrednosti za postojeće projekte i epizode. Zato V7 **namerno ne izmišlja datume** i AKTUELNO će trenutno prikazati prazan editorial state. To je ispravno ponašanje.

Kada stvarno objavite sadržaj, dodaje se npr.:

```ts
publishedAt: "2026-09-13T20:00:00Z",
```

Za epizodu se istovremeno postavlja:

```ts
status: "published",
youtubeUrl: "https://www.youtube.com/watch?v=...",
```

## Validacija posle zamene

```powershell
npm.cmd run lint
npx tsc --noEmit
npm.cmd run build
```

Očekivanje: 0 errors i 0 warnings.

## Dependency odluka

V7 zadržava trenutno verifikovani runtime stack iz V6: Next.js 16.3.4 / React 19.2.8. Deep research je pokazao da je React 19.3.0 sada aktuelan, ali njegova migracija se ne radi zajedno sa ovom funkcionalnom nadogradnjom da ne bi dve nezavisne promene otežale dijagnostiku lint/Compiler problema.
