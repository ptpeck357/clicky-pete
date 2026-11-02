# SEO — clicky-pete

Split out of `plan.md` on 2026-08-25, because the SEO work outgrew a section of it. This file
carries the whole track: what is built, what is left, and how each remaining piece gets done.

**The goal is booked sessions, not rankings.** Nobody searching for a photographer types
"Clicky Pete" — they type "Bozeman senior photos", "family photographer Bozeman MT",
"engagement photos Bozeman". The site sells exactly those. That distinction decides the order
of everything below: the local half reaches clients, the technical half only amplifies demand
that already exists.

## Where we left off

### 2026-11-01

Audit item 1 (collection cards as links) is done: **#108**, `fix/collection-card-links`, open
against `dev`, not merged. Checked in Chrome on the dev server: 11 `<a href>` cards, client-side
navigation by click and by Enter, focus ring intact. The branch also carries the #107
`CHANGELOG.md` entry. Once it ships to `prod`, add a `CHANGELOG.md` entry and recheck the gallery
URLs in Search Console. The 2026-11-12 recheck in "Next" below is the natural point.

Also checked: both Business Profile edits from 2026-10-29 have published ("Next" item 1, done).
The profile's service areas list Manhattan where this file records Four Corners; unresolved.
Nothing else from the audit or "Next" has moved.

Audit item 2 (the empty shell): **prerendering is built** on `feat/prerender` in the worktree
`../clicky-pete-prerender`. It is open as **#109** against `dev` and not merged. It needs no new
dependency, but needs two Amplify console rule changes after merge. See §3.

### 2026-10-29 — audit of the live site

A fresh pass over production with curl and Chrome, after #105. Nothing changed in code. The new
findings, most important first:

1. **No crawlable link reaches any collection page.** `CollectionCard` is a `div role="button"`
   that calls `navigate()`, and the Collections/All Photos toggle is a button too. Read live:
   `/gallery` has no `<a href>` beyond the four nav links. Google finds the 11 collection URLs
   only through the sitemap, which fits the 9 stuck in "Discovered – currently not indexed".
   **Fix:** render the card as a `<Link to={`/gallery/${encodeURIComponent(name)}`}>`. A small,
   self-contained branch, and the cheapest item on this list.
2. **The empty shell** (§3), unchanged and still the largest item.
3. **Thin pages.** The visible text in `<main>`: Home 10 words, `/gallery` 18,
   `/gallery/Montana` 10 (title, photo count, sort control). Contact 158, About 184. A collection
   page has nothing to rank on beyond its alt text. **Graduations and Engagements already are
   session pages in all but copy:** a short intro paragraph on each, in the words people
   search for, gets most of what the planned session pages would, with no new routes. Families
   stays blocked on photos.
4. **Soft 404 on unknown collections.** `/gallery/Nowhere` renders "Nowhere Photos", 0 photos,
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
unreliable with WebP. It does not matter until prerendering lands, since no preview crawler sees
the tag today.

Checked and fine: one `<title>` per page, descriptions and canonicals on every route, the
`ProfessionalService` and `BreadcrumbList` JSON-LD, the apex and http 301s to https www, HSTS,
robots.txt, a 15-URL sitemap where every URL answers 200, alt text on every content image, CLS 0.

### 2026-10-29

**State at end of session:** `prod` and `dev` are level. #105 (merged 18:08 UTC) shipped #103
(pricing-button alignment) and #104 (title and alt-text fixes, README and CLAUDE.md refresh), both
verified live: the deployed bundle removes the static `<title>`, and the live sitemap has no
`Astro|Night` left (56 "Astro and night" titles). No branches other than `dev` and `prod` exist on
the remote. Search Console needs nothing until the rechecks in "Next" fall due.

The session covered Search Console and the Business Profile in the browser, then three code
branches: #100 and #101 live via #102 (17:56 UTC), #104 live via #105 (18:08 UTC).

- **Search Console: 6 indexed, 12 not indexed**, and the 15 sitemap URLs are all accounted for.
  The homepage no longer reports "Duplicate without user-selected canonical"; that re-crawl
  landed. Details and the indexing requests are under "Google Search Console — status" in §0.
- **Google Business Profile: verified and live**, 113 views so far. Services and hours were
  edited today and are pending Google's review. See "Google Business Profile — status" in §0.
- **Rich Results Test: passes**, and the HTML Googlebot renders carries every tag. It also
  turned up two bugs, below. See §2.
- **Performance read for the first time**: 4 clicks, 42 impressions. See "Google Search
  Console — status" in §0.
- **Live on `prod` via #102:**
    - #100, `fix/skip-to-content` (`bf98745`): the skip link, plus the "After merging a PR"
      section in `CLAUDE.md`.
    - #101, `feat/image-sitemap` (`5bee501`): 597 image entries in the sitemap.
    - Both branches deleted locally and on the remote; the worktree is removed.
    - Verified live: `sitemap.xml` carries 597 `<image:loc>` entries and parses, with
      `last-modified` from the deploy; the bundle contains the skip link. Sitemap resubmitted in
      Search Console 2026-10-29, read the same day, status Success.
- **Session-page mockup** for senior portraits, families and engagements:
  https://claude.ai/artifact/QFigiW2hzbD2Y4gGZDXG9n (private). Built from real prices and
  locations. **There are no family-session photos in the portfolio**, so that page has empty
  frames; that is the gating item for a Families page, ahead of any code.

**Two bugs found, fixed in #104, live via #105, 2026-10-29:**

1. **Two `<title>` elements on every page.** The static `<title>Clicky Pete Photography</title>`
   in `index.html` survives after React 19 hoists the per-page one, so the rendered head holds
   both. React's comes first and Google showed it, but it is still invalid HTML. **Fix:**
   `main.tsx` removes the static `<title>` before React renders. `index.html` keeps it, so
   clients that never run JavaScript still get a title. An inline script would act sooner, but
   the CSP's `script-src 'self'` blocks it.
2. **Alt text reads "Astro|Night photography in…"** for that category. `describePhoto` uses
   the category verbatim, pipe and all. **Fix:** `readableCategory()` turns it into "Astro and
   night photography in…", in `photoAlt.ts` and in the copy in `generate-sitemap.mjs`.

Both checked in the browser: one `<title>` per page across route changes, no pipe in any alt.
A code review then caught two gaps the title fix opened, both closed: the Suspense fallback now
renders the site name as a `<title>` while a lazy page loads, and Gallery's "Failed to load
photos" screen carries its own. It also flagged CLAUDE.md still naming a `templates/` layer that
does not exist, fixed alongside the README.

Next, in order:

1. ~~**Check both profile edits published**~~ — **done 2026-11-01**, both live with no pending
   marker. See "Google Business Profile — status" in §0.
2. **Profile photos.** Convert a selection of the 2000px WebP renditions to JPG first.
3. **Link the site to the profile.** Add the profile's share URL as `sameAs` in
   `businessSchema`, or to `SOCIAL_PROFILES`. Its own branch. Needs the URL from Share on the
   profile.
4. **Decide the phone number.** It is on the profile and nowhere on the site, and it is the
   one field the Rich Results Test flags on the business markup.
5. **Ask past clients for reviews.**
6. **Recheck the 9 gallery URLs in Search Console** around 2026-11-12: Pages report, are they
   still "Discovered – currently not indexed"? Read Performance → Queries again around
   2026-11-29.
7. **The open code and copy items.** Prerendering is still the largest of them. The session
   pages wait on family photos and on sign-off of the mockup.

### Built

| Piece                   | Where                                        | Notes                                                                                       |
| ----------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Site facts in one place | `src/config/site.ts`                         | Origin, name, city, socials, share-image helper. Metadata, JSON-LD and sitemap all read it  |
| Per-page metadata       | `src/components/atoms/Seo/Seo.tsx`           | Title, description, canonical, Open Graph, Twitter card. React 19 hoists them — no helmet   |
| Structured data         | `src/components/atoms/Seo/structuredData.ts` | `ProfessionalService` on Home, `BreadcrumbList` on a collection view. `<` escaped (f1a4569) |
| Applied to every route  | Home, Gallery, About, Contact, NotFound      | 404 renders `noIndex`                                                                       |
| Descriptive alt text    | `src/utils/photoAlt.ts`                      | Composed from the manifest, replacing several hundred `alt="Landscape"`                     |
| Lazy thumbnails         | `PhotoCard.tsx`                              | `loading="lazy"` + `decoding="async"`, added alongside the alt change                       |
| Sitemap at build        | `scripts/generate-sitemap.mjs`               | Runs in `npm run build`; enumerates collections from `photos.json`. Output is gitignored    |
| robots.txt              | `public/robots.txt`                          | Allow-all plus the sitemap line                                                             |

### Not built

1. **The HTML shell is still empty**, so social crawlers see nothing — see the prerendering
   decision below. This is the single most client-visible gap.
2. ~~**No image sitemap**~~ — live since #102, 2026-10-29.
3. **No `ImageObject` structured data.**
4. **Gallery headings still say "Collections" and "All Photos".**
5. **The local half is live but not finished** — the profile is verified with services and
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

- [ ] **Make the collection cards real links.** `CollectionCard` and the Collections toggle are
      buttons, so no collection page is reachable by a crawlable link. Audit 2026-10-29, item 1.
      In review as #108 (`fix/collection-card-links`), not merged.
- [ ] **Render `NotFound` for an unknown collection.** `/gallery/Nowhere` is an indexable page
      today. Audit item 4.
- [ ] **Slim the homepage hero preload.** Load only the rendition `getHeroImageUrl` picks, and
      only the first photo before the overlay drops. Audit item 5.
- [ ] **Small fixes:** a `preconnect` to the photo host, and the stale "302" comment in
      `site.ts`. Audit, minor.
- [ ] **Prerendering.** Decided and built 2026-11-01 on `feat/prerender` (worktree
      `../clicky-pete-prerender`), in review as #109, not merged. Needs two Amplify
      console rule changes after merge. See §3.
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
- [ ] **"At introductory rates"** still closes About and Gallery, and the contact page no longer
      says it. Either strip it from those two or put it back on contact — carried over from
      `plan.md`, unresolved.

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

**2026-08-25: created, verification processing, up to 5 days.** Not publicly visible until it
clears. Name `Clicky Pete Photography`, primary category `Photographer`, six service areas
(Bozeman, Belgrade, Livingston, Big Sky, Four Corners, Gallatin County), phone and website set.
The website field is the www form, matching `SITE_URL`.

Verification has since cleared (see 2026-10-29 below), so the warning that sat here about not
editing during it no longer applies.

Skipped during signup, all deliberately: the storefront photo (no storefront), the photo upload
step (easier in the Photos tab once verified), the $500 Ads credit (spend-matching, and there
are no reviews behind the listing yet), and the Workspace mailbox (separate decision — the
contact form already goes out through SES).

Once it clears, in this order:

1. Description — the draft is below. Done; it is on the live profile.
2. Services, mirroring the `/contact` cards. Done 2026-10-29.
3. Hours — "by appointment" is valid. Done 2026-10-29, as "Open with no main hours".
4. Photos. Still open. Note the format trap: **Google takes JPG or PNG, not WebP**, and every rendition in
   the bucket is WebP. Converting is a `sharp` pass over the 2000px copies.
5. The review short link, then the asks.

**Profile description, approved 2026-08-25** (555 chars, cap is 750; no URLs or phone numbers
are allowed in this field, and Google truncates at roughly 250 with a "More" link, so the
searchable words sit in the first two sentences):

> I'm Peter Peck, and I photograph people around Bozeman — portraits, graduations, families and
> engagements. Most sessions end up outside somewhere in Gallatin County: a trailhead, a field
> at golden hour, or wherever already means something to you. I got clicky-happy with a Kodak
> point-and-shoot as a kid and never really stopped. When I'm not photographing people I'm out
> chasing landscapes, aerials and night skies across Montana. If you're thinking about a
> session, send me a note — half of it is just working out the right spot and the right light.

Open: it says "graduations", matching the `/contact` cards, where "senior portraits" is what
parents in Bozeman actually search. If that wording changes it should change on the site first.

Also open: a phone number is now published on the profile and appears nowhere on the site.
Not a problem, but see "Code that follows from these" below.

**2026-10-29: verified and live.** It appears in search with "You manage this Business Profile",
113 views, areas served shown as "Bozeman and nearby areas". The description above was already
in place. Edited today, both pending Google's review:

- **Services**, under the `Photographer` category: Headshots and portraits, Family and group,
  Portrait photography, Senior class photography, and Engagement photography. The last is a
  custom service: Google's presets only offer engagement bundled with weddings, and weddings
  are not sold. The preset "Wedding and engagement" was on the profile before, was removed by a
  misclick during this session, and was deliberately not restored. No prices or descriptions
  are set on any service.
- **Hours: "Open with no main hours"**, which shows no hours at all, the closest fit for
  appointment-only. The previous setting was "Open with main hours", with a 9–5 week and
  Wednesday closed, which were never chosen on purpose. After saving, the panel showed "Your
  edit is taking longer than expected"; recheck before assuming it published.

**2026-11-01: both edits published**, checked in the manager panel on Google Search. Services
lists all five under `Photographer`; Hours reads "Open with no main hours", and the public
panel shows no hours. Neither carries a pending marker. 121 views. The service areas read
Big Sky, Bozeman, Belgrade, Gallatin County, Manhattan (59741) and Livingston (59047):
Manhattan where this file records Four Corners. Not changed, since it is not known whether
that was a deliberate edit.

Still to do on the profile: photos (JPG or PNG, see step 4 above), then reviews.

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
  one click. Bing does not render JavaScript, so what it indexes is a blunter second readout on
  the empty-shell problem.

#### Google Search Console — status

**2026-08-25: domain property `clickypete.photography` verified.** Verified by TXT record at the
apex in Route 53, added through the console — the `clicky-pete` IAM user is scoped to the photo
bucket and CloudFront invalidations and is denied `route53:ListHostedZones`, so this is not a
CLI job. **Leave that TXT record in place permanently**; deleting it un-verifies the property
and loses the history. There was no other TXT at the apex, so nothing had to be merged.

A domain property rather than a URL prefix, on purpose: it covers apex, www, http and https in
one, and the apex redirects to www here.

URL Inspection was run on the homepage as a baseline. The live test returned **"URL is available
to Google"** — the page fetches, is not blocked by robots, and is eligible for indexing. That is
the live-test verdict, not an indexing state; whether it is actually indexed is the separate
card at the top of the same page.

That baseline was taken before the deploy, when production had no `Seo` component, so
`og:title` and the JSON-LD were legitimately absent. Finding them there now is the proof the work
reached Google.

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

### 1. Test pass before the PR

Run 2026-08-25 against `npm run dev` before #88; every item passed. Removed 2026-11-01 as
finished; the checklist is in git history.

### 2. Production checks, once it deploys

Run 2026-08-25 against the deployed site; all pass. `robots.txt` and `sitemap.xml` answer with
the right content types, and the console is clean of CSP violations. The `/sitemap.xml` fix it
needed (the Amplify rewrite allowlist, then a redeploy to clear the edge cache) is written up in
CLAUDE.md under "Static files, Amplify rewrites and the edge cache".

**Rich Results Test, passed 2026-10-29:** two valid items, Local business and Organization.
Non-critical only: `telephone` is missing on the business, which waits on the phone decision;
`streetAddress` and `postalCode` are missing on the organization, which is right for a
service-area business with its address hidden.

### 3. Prerendering — the open decision

`index.html` is `<div id="root">` and a module script. Every tag `Seo.tsx` writes — title,
description, canonical, Open Graph — exists only after React runs. Confirmed against production
on 2026-08-25, and still true on 2026-10-29:

```bash
curl -s https://www.clickypete.photography/ | grep -ic canonical   # → 0
```

**This stopped being hypothetical the day the branch shipped.** Two separate costs, and the
second one is new:

1. **Link previews are blank** on every client that does not execute JavaScript — Facebook,
   Instagram, Slack, iMessage, Bing. For a portfolio shared by link between people planning a
   session, that is the gap most visible to clients.
2. **Google only sees the canonical on its render pass**, which is a second queue that lags the
   crawl by days or weeks. On 2026-08-25 the homepage was reported as "Duplicate without
   user-selected canonical" with "User-declared canonical: None" — the crawler had the shell and
   nothing else. A re-crawl fixed that particular reading — by 2026-10-29 the homepage is
   indexed — but the structural delay stays: every metadata change waits on the render queue
   rather than landing with the crawl. The 9 collection pages sitting in "Discovered – currently
   not indexed" since September are likely the same cost showing up as crawl priority.

Three ways out, unresolved because the first one needs a new dependency:

- **Prerender at build** — `vite-plugin-prerender` or similar headless-renders each route to
  static HTML. Keeps the app as it is. Costs a build-time dependency and a slower build.
  Collection routes have to be enumerated from `photos.json`, which `generate-sitemap.mjs`
  already does — that loop is the shared piece, and the two should read one list rather than
  each building their own.
- **Leave it client-rendered.** Google does index the site, on a delay; link previews stay blank
  everywhere else. Zero cost, and defensible if the site is found mostly by search rather than
  shared by link — but note that finding 2 above is the price, and it is paid on every
  metadata change from here on.
- **Migrate to a framework with SSG.** Correct long-term, disproportionate now.

Nothing else in this file is blocked on the answer, so it can stay open — but it should be
answered rather than drift. It is now the largest single item left, and it undercuts the value
of everything already shipped.

**Decided 2026-11-01: prerender at build, with no new dependency.** Built on `feat/prerender`,
in the worktree `../clicky-pete-prerender`. Open as #109 against `dev`, not merged. The
first option above, but without a headless browser. React 19's own `react-dom/static`
`prerender()` runs on a Vite SSR build of `src/entry-server.tsx`, and `scripts/prerender.mjs`
writes one HTML file per route. Both scripts read their route list from
`scripts/site-routes.mjs`, so the sitemap and the prerender always agree. The build gains about
a second. Full mechanics and rules are in CLAUDE.md under "Prerendering".

- 15 pages: `home.html`, `about.html`, `contact.html`, `gallery.html`, and
  `gallery/<Collection>.html` ×11. `index.html` stays the empty shell, as the fallback for
  unknown URLs.
- Each page carries its title, description, canonical, OG/Twitter tags (with `og:image` when
  `VITE_CLOUDFRONT_URL` is set at build), JSON-LD and copy. Photos are not prerendered; they
  still arrive through the client fetch.
- `main.tsx` hydrates a prerendered page (`hydrateRoot`) and client-renders the shell. It
  removes the server's head tags first, so the page never holds two of any.
- Checked in Chrome against `vite preview`, which resolves clean URLs as Amplify does:
  `/`, `/about`, `/contact`, `/gallery` and `/gallery/Montana` hydrate with no console errors,
  one copy of each head tag, and photos loading. Client-side navigation afterwards swaps the
  tags correctly. `npm run ci` passes with the same 8 warnings.
- Known and accepted: a query string the page reads (`/gallery/Montana?sort=oldest`) logs a
  recoverable hydration mismatch (React #418) and re-renders on the client. `/home` would
  serve `home.html` and do the same.

**Needs two Amplify console changes before it does anything in production** (until then,
every URL still gets the shell, so merging is safe on its own):

1. The SPA rewrite rule: type `200` → `404-200`, with the same regex source and target. It then
   rewrites only requests that have no file.
2. A new rule above it: `/` → `/home.html`, type `200`.

Then **Redeploy this version** to clear the edge cache, and verify:

```bash
for p in / /about /contact /gallery /gallery/Montana "/gallery/San%20Luis%20Obispo%2C%20CA" /gallery/Nowhere; do
  echo "$p  $(curl -s "https://www.clickypete.photography$p" | grep -o '<link rel="canonical"[^>]*>')"
done
curl -sI https://www.clickypete.photography/about | grep -i 'content-type\|x-cache'
```

Every known path should print its own canonical; `/gallery/Nowhere` should print none (the
shell). **Not verified, because it can only be tested on Amplify:** that `404-200` still
resolves `/about` to `about.html`, and that a collection name with a space and comma maps to
its file. If either fails, the fallback is an explicit `200` rule per path ahead of the SPA
rule. Then rerun the Rich Results Test, and check a link preview, for example by pasting a
URL into a Slack DM to yourself.

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
  still works, which is how to tell the two apart. This cost real time on 2026-08-25: the
  `/contact` anchor was diagnosed as broken twice before `document.visibilityState === 'hidden'`
  turned out to be the whole story. Check `document.hasFocus()` before believing a scroll result.
- **Chrome will not size a window below about 455 CSS px on this machine**, so a true 360px phone
  width cannot be tested by resizing — 455 is the narrowest real measurement available, and it is
  still below the `sm` breakpoint. Anything that hinges on 360 specifically needs a real phone.
- **The non-breaking space in the Home subtitle, between `Bozeman,` and `Montana`, is
  deliberate.** Without it the subtitle orphans "Montana" at 360–390px, the widths most phones
  use. `text-balance` or `text-pretty` would do nothing on older browsers; the nbsp cannot
  regress.
