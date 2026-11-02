# SEO — clicky-pete

Split out of `plan.md` on 2026-08-25, because the SEO work outgrew a section of it. This file
carries the whole track: what is built, what is left, and how each remaining piece gets done.

**The goal is booked sessions, not rankings.** Nobody searching for a photographer types
"Clicky Pete" — they type "Bozeman senior photos", "family photographer Bozeman MT",
"engagement photos Bozeman". The site sells exactly those. That distinction decides the order
of everything below: the local half reaches clients, the technical half only amplifies demand
that already exists.

## Where we left off

### Next

1. **Profile photos.** Convert a selection of the 2000px WebP renditions to JPG first.
2. **Link the site to the profile.** Add the profile's share URL as `sameAs` in
   `businessSchema`, or to `SOCIAL_PROFILES`. Its own branch. Needs the URL from Share on the
   profile.
3. **Decide the phone number.** It is on the profile and nowhere on the site, and it is the
   one field the Rich Results Test flags on the business markup.
4. **Ask past clients for reviews.**
5. **Recheck the 9 gallery URLs in Search Console** around 2026-11-12: Pages report, are they
   still "Discovered – currently not indexed"? Read Performance → Queries again around
   2026-11-29.
6. **The open code and copy items.** Prerendering is done (#110). Next largest: build-time
   collection links on `/gallery` (see 2026-11-01 below) and the hero preload. The session
   pages wait on family photos and on sign-off of the mockup.
7. **Rerun the Rich Results Test and check a link preview** now that pages are prerendered,
   for example by pasting a URL into a Slack DM to yourself.

### 2026-11-01

**The soft 404 is fixed, live via #122:** #121 renders `NotFound` for an unknown collection, and
redirects a collection URL in other casing (`/gallery/montana`) to its real name. Audit item 4.

**#109, prerendering, is live** via #110 (2026-11-01 Mountain Time), with the Amplify rules changed and
verified on production. Every route now carries its own metadata in the raw HTML. #111 added
its `CHANGELOG.md` entry and the CLAUDE.md rules, and shipped via #112. See §3.

**#108, collection cards as links, is live**: merged into `dev`, shipped via #112 (2026-11-01
Mountain Time). It also carried the
#107 `CHANGELOG.md` entry, `plan.md` and this file, and has `dev` merged in. Two code reviews
ran on it; the main fix is that a route change no longer shows the previous view's photos or
category for a moment (`usePhotos` now ties photos and errors to their filter). Details are in
the PR. Checked on production after the deploy: 11 `<a href>` collection cards, Back from All
Photos to a collection shows no stray photos, and `/gallery/Montana` hydrates with no console
errors.

- **Known:** `/gallery?view=collections` loaded directly logs a recoverable hydration mismatch
  (React #418), because the prerendered `/gallery` is All Photos. Accepted, per CLAUDE.md.
- **Gap #108 does not close:** the prerendered `/gallery` has no collection links, since the
  collections load in effects. Googlebot renders JavaScript and sees them; a crawler that does
  not, sees only the nav. Rendering the list from `photos.json` at build would close it.

**Business Profile:** both 2026-10-29 edits have published. The service areas list Manhattan
where this file used to record Four Corners; unresolved. See §0.

### 2026-10-29 — audit of the live site

A fresh pass over production with curl and Chrome, after #105. Nothing changed in code. The new
findings, most important first:

1. **Done, live via #112.** ~~No crawlable link reaches any collection page.~~ `CollectionCard` is a `div role="button"`
   that calls `navigate()`, and the Collections/All Photos toggle is a button too. Read live:
   `/gallery` has no `<a href>` beyond the four nav links. Google finds the 11 collection URLs
   only through the sitemap, which fits the 9 stuck in "Discovered – currently not indexed".
   **Fix:** render the card as a `<Link to={`/gallery/${encodeURIComponent(name)}`}>`. A small,
   self-contained branch, and the cheapest item on this list.
2. **Done, live via #110.** ~~The empty shell~~ (§3).
3. **Thin pages.** The visible text in `<main>`: Home 10 words, `/gallery` 18,
   `/gallery/Montana` 10 (title, photo count, sort control). Contact 158, About 184. A collection
   page has nothing to rank on beyond its alt text. **Graduations and Engagements already are
   session pages in all but copy:** a short intro paragraph on each, in the words people
   search for, gets most of what the planned session pages would, with no new routes. Families
   stays blocked on photos.
4. **Done, live via #122.** ~~Soft 404 on unknown collections.~~ `/gallery/Nowhere` renders "Nowhere Photos", 0 photos,
   a self-referencing canonical and no `noindex`. It should render `NotFound`. Unknown
   top-level paths are fine, since NotFound sets `noindex`, though like every route they answer
   HTTP 200.
5. **The homepage hero waits on about 2.6 MB.** `Home.tsx` preloads both the 800px and the 2000px
   renditions of all 5 hero photos before the overlay drops. Phones display only the 800s, so
   about 2.2 MB of that is wasted on exactly the visitors local search sends. Chrome measured LCP at
   10.2s on a warm desktop cache. Every photo was cached and the gate cleared at about 0.55s,
   so the 10.2s is most likely the 2.5s carousel producing later, larger LCP candidates, not
   the download. That is inferred, not confirmed. There is no field data at this traffic, and
   the PageSpeed API quota was used up on the day. **Fix:** preload only the size
   `getHeroImageUrl` picks, and only the first photo before showing.
6. **The h1s say nothing searchable**: "Capturing The Moment", "Get to Know Me", "Let's
   capture something neat", "All Photos". The Home subtitle partly makes up for it. Worth folding
   into the copy pass with the gallery headings.

Minor: the `SITE_URL` comment in `site.ts` still says the apex 302s (it is a 301 since
2026-08-25). `/about/` answers 200 alongside `/about`, but the canonical covers it. The shell has
no `preconnect` to `photos.clickypete.photography`, though every image and `photos.json` come
from there. That costs one connection setup on first load, and it can be added in `index.html`
without touching the CSP. `og:image` is a WebP. Facebook and iMessage take it; LinkedIn has been
unreliable with WebP. Since prerendering (#110) preview crawlers do see the tag, so this now
matters; a LinkedIn preview has not been checked.

Checked and fine: one `<title>` per page, descriptions and canonicals on every route, the
`ProfessionalService` and `BreadcrumbList` JSON-LD, the apex and http 301s to https www, HSTS,
robots.txt, a 15-URL sitemap where every URL answers 200, alt text on every content image, CLS 0.

### Built

| Piece                   | Where                                           | Notes                                                                                       |
| ----------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Site facts in one place | `src/config/site.ts`                            | Origin, name, city, socials, share-image helper. Metadata, JSON-LD and sitemap all read it  |
| Per-page metadata       | `src/components/atoms/Seo/Seo.tsx`              | Title, description, canonical, Open Graph, Twitter card. React 19 hoists them — no helmet   |
| Structured data         | `src/components/atoms/Seo/structuredData.ts`    | `ProfessionalService` on Home, `BreadcrumbList` on a collection view. `<` escaped (f1a4569) |
| Applied to every route  | Home, Gallery, About, Contact, NotFound         | 404 renders `noIndex`                                                                       |
| Descriptive alt text    | `src/utils/photoAlt.ts`                         | Composed from the manifest, replacing several hundred `alt="Landscape"`                     |
| Lazy thumbnails         | `PhotoCard.tsx`                                 | `loading="lazy"` + `decoding="async"`, added alongside the alt change                       |
| Sitemap at build        | `scripts/generate-sitemap.mjs`                  | Runs in `npm run build`; enumerates collections from `photos.json`. Output is gitignored    |
| robots.txt              | `public/robots.txt`                             | Allow-all plus the sitemap line                                                             |
| Prerendering            | `src/entry-server.tsx`, `scripts/prerender.mjs` | Every route as static HTML at build, live via #110. See §3                                  |
| Image sitemap           | `scripts/generate-sitemap.mjs`                  | An image entry per photo on each collection URL, live via #102. See §4                      |

### Not built

1. **Photos and `/gallery`'s collection links in the prerendered HTML.** Both load in effects,
   so neither is in the static pages.
2. **No `ImageObject` structured data.**
3. **The local half is live but not finished** — the profile is verified with services and
   hours set (2026-10-29), but has no photos and no reviews. Search Console is verified and the
   sitemap submitted. See §0.

## Todo

### Not code — start these first, they have lead times

Detail for all three is in §0 of the implementation plan.

- [x] **Claim the Google Business Profile.** Created 2026-08-25, verified and live by
      2026-10-29. Services and hours set 2026-10-29; photos are the remaining half — see §0.
- [ ] **Ask past clients for reviews** on that profile once it is live. Strongest local ranking
      input there is, and the slowest to accumulate.
- [x] **Verify the domain in Google Search Console.** Done 2026-08-25, domain property, TXT in
      Route 53. Sitemap submitted 2026-08-25. Reading the query report is still open. See §0.

### Code — after the branch lands

- [x] **Make the collection cards real links.** `CollectionCard` and the Collections toggle are
      buttons, so no collection page is reachable by a crawlable link. Audit 2026-10-29, item 1.
      Live via #112, 2026-11-01. The prerendered `/gallery`
      still has no collection links; see 2026-11-01.
- [x] **Render `NotFound` for an unknown collection.** Audit item 4. #121, live via #122 on
      2026-11-01.
- [ ] **Slim the homepage hero preload.** Load only the rendition `getHeroImageUrl` picks, and
      only the first photo before the overlay drops. Audit item 5.
- [ ] **Small fixes:** a `preconnect` to the photo host, and the stale "302" comment in
      `site.ts`. Audit, minor.
- [x] **Prerendering.** #109, live via #110 on 2026-11-01, with both Amplify rules set. See §3.
- [x] **Image sitemap entries.** Live via #102, 2026-10-29.
- [ ] **`ImageObject` JSON-LD** where it fits. Lower value than either of the above; it can wait.
- [x] **A skip-to-content link.** Live via #102, 2026-10-29.
- [x] **Fix the duplicate `<title>` and the "Astro|Night" alt text.** Found 2026-10-29; fixed
      in #104, live via #105 on 2026-10-29.

### Copy — separate branch, judgement rather than mechanics

- [ ] **Intro copy on the Graduations and Engagements collections**, in searched wording. Most
      of the value of a session page, with no new routes. Audit 2026-10-29, item 3.
- [ ] **Searchable h1s** on Home, About and Contact, alongside the gallery headings below. Audit
      item 6.
- [ ] **Gallery headings.** "Collections" and "All Photos" say nothing searchable. Worth a pass
      once the rest is live, and lower stakes than the landing page.
- [ ] **A page per session type** — senior portraits, families, engagements — split out of the
      `/contact` cards, each with its own URL, heading and photos. This is what ranks for those
      separate searches. Plan it on its own; it is a site change, not an SEO tweak. Mockup
      2026-10-29: https://claude.ai/artifact/QFigiW2hzbD2Y4gGZDXG9n. Blocked on family photos.

## Implementation plan

Ordered as the todo is. Each item names the file it touches and what "done" looks like, so
none of them needs re-deriving later.

### 0. The lead-time items, step by step

All three are done in a browser and none touches the repo. Reviews is the one still open, and
the slowest to accumulate.

#### Google Business Profile

Set up 2026-08-25 and verified by 2026-10-29; progress is under "status" below. The rules that
still apply to any edit:

- **The name stays `Clicky Pete Photography`.** Adding a city or keyword to it ("… Bozeman",
  "Bozeman Photographer | …") breaks Google's guidelines and risks a suspension that takes weeks
  to appeal. The city belongs in the description and the service areas.
- **Primary category `Photographer`**, which carries more ranking weight than anything else on
  the profile.
- **It is a service-area business**, with the address hidden. Keep the service areas to places
  sessions actually happen; listing half of Montana dilutes the profile rather than widening it.
- **Photos matter more than they look**: profiles with real photos get materially more clicks.

#### Google Business Profile — status

**Live and verified**, checked 2026-11-01 in the manager panel on Google Search; 121 views.

- **Name** `Clicky Pete Photography`, primary category `Photographer`, phone and the www
  website set.
- **Service areas:** Big Sky, Bozeman, Belgrade, Gallatin County, Manhattan and Livingston.
  This file used to record Four Corners where Manhattan now is; whether that was deliberate is
  unresolved.
- **Description:** the one approved 2026-08-25, live. Google truncates at roughly 250
  characters, so the searchable words sit in the first two sentences, and no URLs or phone
  numbers are allowed in it.
- **Services**, published 2026-11-01: Headshots and portraits, Family and group, Portrait
  photography, Senior class photography, and Engagement photography. The last is custom, since
  Google's presets bundle engagement with weddings, which are not sold. No prices set.
- **Hours: "Open with no main hours"**, published 2026-11-01. It shows no hours, the closest fit
  for appointment-only.
- **Skipped on purpose:** the storefront photo (there is none), the $500 Ads credit
  (spend-matching, and no reviews behind the listing yet), and the Workspace mailbox.

Open:

- **Photos.** Google takes JPG or PNG, not WebP, and every rendition in the bucket is WebP, so
  this starts with a `sharp` pass over the 2000px copies.
- **"Graduations" or "senior portraits".** The description and the `/contact` cards say
  "graduations"; parents in Bozeman search "senior portraits". If it changes, change the site
  first.
- **The phone number** is on the profile and nowhere on the site. See "Code that follows from
  these" below.
- **Reviews**, below.

#### Reviews

Strongest local ranking input there is, and the slowest to accumulate — which is exactly why it
sits next to the profile rather than after everything else.

1. **Get the short review link** from the profile dashboard ("Ask for reviews"). It looks like
   `g.page/r/<id>/review` and opens the review box directly.
2. **Ask past clients individually**, by text or email, soon after they receive their gallery.
   A specific ask — "would you mind saying a line about the session?" — converts far better
   than a generic one.
3. **Two rules that get profiles penalised:** never offer anything in exchange for a review,
   and never screen first ("tell me if you'd leave five stars"). Review gating is against
   Google's policy and it is the one people fall into by accident.
4. **Reply to every review**, including any bad one. Replies are public and are read.
5. **Five to ten is the threshold** where a profile stops looking new. After that, a steady
   trickle from each delivered session keeps it current — a link at the bottom of the gallery
   delivery message makes it automatic.

#### Google Search Console

Set up 2026-08-25; progress is under "status" below. Still open from the original steps:

- **Read Performance → Queries** periodically. That report decides which session type gets a
  page first and which wording is already pulling.
- **Optional, five minutes:** Bing Webmaster Tools imports a verified Search Console property in
  one click, for a second readout of how the prerendered pages index.

#### Google Search Console — status

**Verified 2026-08-25** as a domain property, by a TXT record at the apex in Route 53. The IAM
user cannot touch Route 53, so that is a console job. **Leave the TXT record in place
permanently**; deleting it un-verifies the property and loses the history.

**`sitemap.xml` submitted 2026-08-25.** The address has to be the **full URL**,
`https://www.clickypete.photography/sitemap.xml`. A domain property has no prefix to prepend, so
a bare `sitemap.xml` is rejected as "Invalid sitemap address".

**2026-10-29: 6 indexed, 12 not indexed.** Four web search clicks in total since August.

- **Page with redirect, 3 URLs:** `https://clickypete.photography/`,
  `http://www.clickypete.photography/` and `http://clickypete.photography/`. All three 301 to
  `https://www.clickypete.photography/` and the report is the expected result of that. Nothing
  to fix, and Validate Fix would only fail. If a www URL ever shows up here, that is real.
- **Discovered – currently not indexed, 9 URLs**, first detected 2026-09-04: the gallery
  collections Arizona, Engagements, Fragments, Graduations, Idaho, Montana, Utah, Washington
  and Wyoming. Every one answers 200 with no redirect. Google knows them from the sitemap and
  has not spent a crawl on them, which on a small new site is a crawl-budget call rather than
  a fault, and the empty shell (§3) gives it little reason to hurry. **Indexing requested for
  all 9 on 2026-10-29** through URL Inspection; there is a daily quota of roughly ten.
- **Indexed, 6:** by elimination against the 15-URL sitemap, Home, Gallery, About, Contact and
  the People and San Luis Obispo collections. Not checked one by one.

**Rendered HTML, checked 2026-10-29** through the Rich Results Test's View tested page, which
shows the same render as URL Inspection. `<title>`, description, `canonical`, every `og:` and
`twitter:` tag and the `ProfessionalService` JSON-LD are all present. It also showed the
duplicate `<title>`, see "Where we left off".

**Performance, first read 2026-10-29**, covering Aug 24 – Oct 27: 4 clicks, 42 impressions, 9.5%
CTR, average position 11.3. Only one query is shown, `senior portraits` with 1 impression;
Google withholds the rest at this volume. By page:

```
/about                          3 clicks  20 impressions
/                               1          6
/gallery/San Luis Obispo, CA    0         13
/gallery                        0          6
/contact                        0          1
/gallery/People                 0          1
```

Too little to decide anything on yet. Read it again in a month.

#### Code that follows from these

- The profile is live as of 2026-10-29, so this is unblocked: add its URL to `SOCIAL_PROFILES`, or to a `sameAs` entry in
  `businessSchema` — linking the site to the profile is a signal in both directions.
- If a phone number goes on the profile, decide whether it also belongs on `/contact` and in
  `businessSchema` as `telephone`. Consistent is better than absent, and absent is better than
  two different numbers.

### 2. Production checks, once it deploys

Run 2026-08-25 against the deployed site; all pass. `robots.txt` and `sitemap.xml` answer with
the right content types, and the console is clean of CSP violations. The `/sitemap.xml` fix it
needed (the Amplify rewrite allowlist, then a redeploy to clear the edge cache) is written up in
CLAUDE.md under "Static files, Amplify rewrites and the edge cache".

**Rich Results Test, passed 2026-10-29:** two valid items, Local business and Organization.
Non-critical only: `telephone` is missing on the business, which waits on the phone decision;
`streetAddress` and `postalCode` are missing on the organization, which is right for a
service-area business with its address hidden.

### 3. Prerendering

**Live since 2026-11-01** (#109, shipped via #110). Every route is prerendered at build with
React's own `react-dom/static`, no new dependency: 15 pages, each with its title, description,
canonical, Open Graph tags, JSON-LD and copy in the raw HTML. Photos are not prerendered. The
mechanics, the two Amplify rules it needs, what changed with `404-200` and the rule for
changing them safely are all in CLAUDE.md under "Prerendering".

Verified on production: `/`, `/about`, `/contact`, `/gallery`, `/gallery/Montana` and the
encoded San Luis Obispo path each answer 200 with their own canonical, and hydrate with no
console errors. Unknown URLs now answer a real 404.

Why it mattered: before it, link previews were blank on every client that does not run
JavaScript, and Google only saw the canonical on its delayed render pass.

Still to do: rerun the Rich Results Test and check a link preview — "Next" item 7.

### 4. Image sitemap

**Live since #102, 2026-10-29.** 597 images across the 11 collection URLs, from
`scripts/generate-sitemap.mjs`. The photo host is hardcoded as `PHOTO_URL` beside `SITE_URL`,
the image title duplicates `describePhoto` (commented on both sides), and the build throws past
1,000 images per URL, the protocol's limit.

### 5. `ImageObject` JSON-LD

Lowest value of the code items — the image sitemap already tells Google what the photos are, and
per-photo markup mostly repeats it. Worth doing only where a photo has its own view. If the
viewer modal ever gets a URL of its own, that is the place; until then this is optional.

### 6. Copy and the local half

Not sequenced here because they are not code and do not block each other. The one rule: say what
is sold in the words people search, and stop well short of keyword mush — the copy still has to
read like a person wrote it.

## Notes that are easy to lose

- The sitemap is **gitignored and generated** (`public/sitemap.xml`). Committing it would mean a
  diff on every photo added. Amplify runs `npm run build`, so the deployed copy is current.
- `SITE_URL` is `https://www.clickypete.photography` — the apex 301s to www, so a canonical
  pointing at the apex would point at a redirect. It is duplicated in `site.ts` and in
  `generate-sitemap.mjs` on purpose; both say so.
- The share image is one fixed hero (`IMG_4350.webp`), not a random pick, so a link previews the
  same way every time it is shared.
- Adding an external host means adding it to `customHttp.yml` — nothing here does, but the SEO
  work is exactly the kind that quietly would.
- **`/contact` has an LCP image behind a three-hop chain**, as of `ed8ed8f`. The intro backdrop
  is a random `hero`-tagged photo, so the browser boots the JS, fetches `photos.json` from
  CloudFront, picks, and only then requests the WebP. That is likely the largest element on the
  page the whole site is trying to send people to, and it cannot be preloaded from the shell
  while the pick stays random — the same trade the share image resolves the other way. If
  PageSpeed on `/contact` ever comes back poor, this is why, and pinning the hero to one photo
  is the fix.
- **Verifying anything in a browser: keep the tab in the foreground.** Chrome does not run
  smooth-scroll animations in a hidden tab, and `globals.css` sets `scroll-behavior: smooth`
  globally, so `scrollIntoView()`, `location.hash = …` and any anchor click all silently do
  nothing while the tab is backgrounded — `scrollY` just stays put. An instant `window.scrollTo`
  still works, which is how to tell the two apart. Check `document.hasFocus()` before believing a
  scroll result.
- **The non-breaking space in the Home subtitle, between `Bozeman,` and `Montana`, is
  deliberate.** Without it the subtitle orphans "Montana" at 360–390px, the widths most phones
  use. `text-balance` or `text-pretty` would do nothing on older browsers; the nbsp cannot
  regress.
