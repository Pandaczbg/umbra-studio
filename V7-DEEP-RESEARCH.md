# Umbra Studio V7 — Deep Research / Technical Review

Datum istraživanja: 13.09.2026.

## 1. Framework state

Next.js 16.3.4 je i dalje aktuelna npm verzija za 16.3 liniju u trenutku izrade ovog paketa. Next.js 16.3 donosi Instant Navigations i dalje oslanja se na Turbopack kao centralni build/runtime pravac.

React 19.3.0 je objavljen 9. septembra 2026. i donosi stabilne View Transitions i Fragment Refs, kao i Trusted Types podršku. Umbra V7 ih trenutno ne uvodi zato što V6 već ima stabilan Framer Motion transition sloj i zato što bi dependency upgrade trebalo testirati kao zaseban kontrolisani korak.

## 2. Architecture decision

Nije uveden runtime cache sistem za lokalni canonical registry. Sadržaj je lokalni, sinhroni i mali; dodatna caching paradigma ovde nema dokazanu korist. V7 umesto toga centralizuje editorial ordering u `lib/content/latest.ts`.

## 3. Content model decision

`publishedAt` je namerno odvojen od `releaseDate`.

- `publishedAt` = kada je sadržaj stvarno objavljen na sajtu/kanalu
- `releaseDate` = narativni / planirani datum iz content domena
- `featured` = urednički izbor, ne redosled objave

Ovo sprečava da se "aktuelno" ponovo pretvori u "trenutni projekat".

## 4. Performance decisions

Novi latest card koristi Next `<Image fill>` + eksplicitni `sizes`, tako da browser ne preuzima nepotrebno velike slike za male kartice.

V7 ne dodaje nove global scroll listeners, ne duplicira `umbra:motion`, i ne dira postojeći `UmbraMotionSystem` / `UmbraSceneDirector` authority model.

## 5. SEO / discoverability

V7 uvodi:

- metadata manifest discovery
- robots route
- sitemap route
- WebSite JSON-LD
- Organization JSON-LD
- BreadcrumbList JSON-LD za latest stranice

JSON-LD vrednosti se serijalizuju tako da `<` karakter bude escape-ovan pre ubacivanja u script tag.

## 6. UX decision

Homepage ostaje curated, a latest sadržaj dobija dva jasna editorial prozora. Deep route `/aktuelno` služi kao prošireni, canonical prikaz istog feeda.

## 7. Intencionalno nije uvedeno

- izmišljeni datumi objave
- lažni YouTube linkovi
- lažne thumbnail slike
- episode route koji u trenutnom projektu ne postoji
- globalna migracija na React 19.3.0
- Cloudflare/OpenNext migracija
- novi top-level projektni folderi
