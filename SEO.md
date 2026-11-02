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

### 2026-08-25

**Updated 2026-08-25. PRs #88, #90 and #91 are on `dev`; #92 merged `dev` into `prod` and
Amplify has deployed it. All of it is live.** The §2 production checks have been run — only the
Rich Results Test is left, since it needs Google's own tool.

```
3c9cf7e Merge pull request #92 from ptpeck357/dev          ← prod
bb49507 Merge pull request #91 from ptpeck357/feat/contact-hero-photo
ed8ed8f feat(contact): add hero photo and link to form
dfefd82 Merge pull request #90 from ptpeck357/style/hero-text-duration
215ba1a style(home): give the hero text longer before it fades
f9dc2f8 Merge pull request #88 from ptpeck357/feat/seo-metadata
118eb02 feat(seo): add per-page titles, descriptions and canonicals
4bb67f2 feat(seo): describe photos in alt text
011676f feat(seo): generate sitemap.xml at build time
2341bb3 feat(seo): add site config and metadata components
97b583c fix(seo): keep "Bozeman, Montana" on one line on phones
```

The hero text timer change went in behind #88 as **PR #90** (`215ba1a`), lengthening the fade
delay from 3.5s to 5s — see "The hero text timer" below. Nothing is outstanding in git, and
`prod` contains everything on `dev`.

Done this session:

- **The whole test pass in §1**, in a browser against `npm run dev`. Every item passed, the
  contact form included — it sent end to end and the mail arrived. Details are recorded against
  each checkbox there.
- **`npm run ci`** — passing throughout.
- **The hero subtitle** — kept as written, and its line break fixed for phone widths. Confirmed
  on a real phone after the fix.
- **Google Business Profile** — created, verification processing, up to five days. Do not edit
  it until that clears. See §0.
- **Google Search Console** — domain property verified by TXT in Route 53. See §0.
- **The `/contact` hero photo and form link** (#91). Not SEO work, but it is what is now live on
  the page the local searches are meant to land on, and it brought one performance note with it
  — see the last bullet in "Notes that are easy to lose".
- **The deploy to `prod`** (#92), and the §2 checks against it. `robots.txt` and `sitemap.xml`
  both answer with the right content type, the console is clean of CSP violations, and the
  homepage carries one `ProfessionalService` JSON-LD block that parses.

Next, as of then (superseded by 2026-10-29 above):

1. **Check back in Search Console in a few days.** The sitemap should report 15 discovered
   URLs, and the homepage should stop reporting "Duplicate without user-selected canonical"
   once the re-crawl requested on 2026-08-25 lands.
2. **Wait on the Google Business Profile**, then fill it out. Verification clears within about
   five days of 2026-08-25. The description is written and sitting in §0, and the photos need
   converting out of WebP first.
3. **Run the homepage through the Rich Results Test.** The last §2 item, and the only one that
   needs Google rather than a browser.
4. **Ask past clients for reviews**, once the profile is live.
5. **Then the open code and copy items** — the prerendering decision, image sitemap entries,
   the gallery headings, and photos on the `/contact` session cards.

### What Search Console said on 2026-08-25

URL Inspection on `https://www.clickypete.photography/`, the day of the deploy. The **live test
rendered correctly** — the metadata is there once the JavaScript runs — and indexing was
requested to queue a re-crawl.

The **index card was stale and should not be read as a failure**: last crawl `Aug 20`, five days
before the deploy, so it describes the site before any of this existed.

```
Page indexing            Not indexed: Duplicate without user-selected canonical
User-declared canonical  None
Google-selected canonical https://clickypete.photography/     (the apex)
Last crawl               Aug 20, 2026
```

"User-declared canonical: None" was simply true on Aug 20. Both lines resolve on a re-crawl.

**Two real findings came out of it, though:**

**1. The apex redirect is a 302, and Google chose the apex as canonical.**

```
https://clickypete.photography/      302 → https://www.clickypete.photography/
https://www.clickypete.photography/  200
```

A 302 is temporary, which is a weak canonicalisation signal — it says www is where this lives
_for now_. **Changed to a 301 on 2026-08-25** and verified fresh from the origin, which states
that www is permanent — what `SITE_URL`, the canonicals and the sitemap all already assume. It
was a one-word change in the same redirects JSON in the Amplify console that the rewrite
allowlist lives in, plus a redeploy. Query strings survive the redirect. Note that browsers
cache a 301 hard, so this is only correct while www stays the permanent choice.

**2. The canonical is invisible without JavaScript.** Confirmed against production:

```bash
curl -s https://www.clickypete.photography/ | grep -ic canonical   # → 0
```

It exists only after React runs, and so does `og:title`. Google renders, but on a second pass
that can lag days or weeks — which is the concrete, measured cost of the empty shell, and the
strongest argument yet for settling §3. It is no longer a hypothetical about link previews: it
is delaying the canonical signal on the live site.

### The subtitle line break

Worth keeping the reasoning, since the change is one character and looks like nothing.

At `text-sm` the subtitle is 366px wide, and the hero gives it the viewport minus 32px of
padding. That put the break in the wrong place on exactly the phones people carry:

| Viewport                     | Before                                             | After                                   |
| ---------------------------- | -------------------------------------------------- | --------------------------------------- |
| 390 (iPhone 12–15), 375, 360 | `…photographer in Bozeman,` / **`Montana`** orphan | `…photographer in` / `Bozeman, Montana` |
| 320 (iPhone SE 1)            | `…photographer in` / `Bozeman, Montana`            | unchanged                               |
| 414+                         | one line                                           | one line                                |

The narrowest phone was the only one that read well. A non-breaking space between `Bozeman,` and
`Montana` forces that break at every width and cannot regress on an older browser, which
`text-pretty` and `text-balance` both can — they degrade to doing nothing where unsupported.

### The hero text timer

`Home.tsx` fades the whole hero text block out on a timer once the images load, and that
predates the SEO work — it was on `dev` before any of this. The h1 and the subtitle fade as one
block: the opacity animates on their shared wrapper, so they cannot drift apart (measured
divergence across 60 samples: 0.00).

PR #90 raises the timer from 3.5s to 5s, on the grounds that the clock
starts when the hero images finish loading — already several seconds in on a phone — and two
lines of heading plus a subtitle is more than 3.5s comfortably carries. The 1s fade sits on top
of that either way.

Note it changes behaviour that has nothing to do with SEO, which is why it went in as its own
PR rather than part of #88.

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

### Now — finish and ship the branch

- [x] Run the manual test pass below on `npm run dev` — done 2026-08-25, all items
- [x] `npm run ci` — passing 2026-08-25
- [x] Open the PR into `dev`, merge — #88, merged 2026-08-25
- [x] Deploy `dev` to `prod` — done 2026-08-25
- [x] Run the three production checks below — all pass 2026-08-25; the Amplify rewrite needed
      `xml` adding to its allowlist first, see §2

### Not code — start these first, they have lead times

Step-by-step for all three is in §0 of the implementation plan.

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
- [ ] **Decide prerendering.** Blocked on a judgement call, not on work. See below.
- [x] **Image sitemap entries** — `<image:image>` per photo on its collection URL. Committed
      on `feat/image-sitemap` (`5bee501`), merged as #101 and live on `prod` via #102, 2026-10-29.
- [ ] **`ImageObject` JSON-LD** where it fits. Lower value than either of the above; it can wait.
- [x] **A skip-to-content link.** Committed on `fix/skip-to-content` (`bf98745`), merged as #100 and live on
      `prod` via #102, 2026-10-29. Checked in Chrome: first Tab shows it above the header, Enter moves focus to
      `<main>`, and the next Tab lands in the page rather than the nav. Original note: not SEO, but it surfaced while working on `/contact` on
      2026-08-25 and has no other home. There is no `sr-only focus:not-sr-only` anywhere in
      `src/`, and `<main>` in `src/app/App.tsx:29` carries no `id`, so every keyboard and screen-reader
      user tabs the whole nav on every page load. The fix is an `id` on `<main>` plus a
      visually-hidden link that appears on focus. Its own branch — it touches the app shell,
      not a page.
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

All three are done in a browser, none of them touches the repo, and none is blocked on the
branch shipping — except submitting the sitemap, which needs the file to exist in production
first. Start them now precisely because the waiting is the expensive part.

#### Google Business Profile

This is the one that puts the site in front of someone in Gallatin County who is looking to
book. Free, and the map pack it feeds is what "photographers near me" actually returns.

1. **Pick the owning Google account before anything else.** Whatever account creates the
   profile owns it, and moving ownership later is a support request. Use one that will still
   exist in five years, not a throwaway.
2. **Create it** at `business.google.com` → Add business → enter `Clicky Pete Photography`.
   The name field must be the business name as it is presented publicly. `Clicky Pete
Photography Bozeman` or `Bozeman Photographer | Clicky Pete` is a guideline violation —
   Google edits it back or suspends the profile, and a suspension takes weeks to appeal. The
   city belongs in the description and the service areas, never the name.
3. **Primary category: `Photographer`.** This carries more ranking weight than anything else
   on the profile. Secondaries, as they apply: `Portrait Studio`, `Wedding Photographer`,
   `Photography Service`.
4. **Answer "no" to having a location customers can visit** — that makes it a service-area
   business, which is the supported type here. The address is then collected for verification
   but hidden from the public listing.
5. **Set the service areas** to the places sessions actually happen: Bozeman, Belgrade,
   Livingston, Big Sky, Four Corners, Gallatin County. Up to 20 are allowed; keep it honest —
   listing half of Montana dilutes the profile rather than widening it.
6. **Website:** `https://www.clickypete.photography` — the www form, matching `SITE_URL`. A
   phone number is optional but speeds up verification and gives someone a second way to reach
   you; the site itself has none today, and adding one is not required for consistency.
7. **Verify.** For a service-area business this is usually a video call or a recorded video —
   continuous and unedited, showing the area, your equipment, and something tying you to the
   business. A postcard to the address is the fallback. **Do not edit the profile while
   verification is pending**; a change can reset the process. Days to weeks.
8. **Once verified, fill it out properly** — this is where most profiles are left half-done:
    - Description, ~750 characters, saying what is sold in the words people search: portrait,
      senior and graduation, family, engagement sessions in Bozeman and around Gallatin County.
      The same sentence `businessSchema` already uses is a good starting draft.
    - Services, one per session type, mirroring the `/contact` cards.
    - Hours: "by appointment" is a valid answer.
    - Photos. This is the one input that gets ignored and shouldn't — profiles with real photos
      get materially more clicks. Pull straight from the 2000px renditions.

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

The only source of truth for what people actually searched before landing here. Verification
can be done today; the sitemap submission waits for the deploy.

1. **Add a Domain property** (`clickypete.photography`), not a URL-prefix one. A domain
   property covers apex, www, http and https in one, which matters here because the apex
   redirects to www (a 301 since 2026-08-25).
2. **Verification is a DNS TXT record** on the apex, added in Route 53 → the hosted zone →
   Create record → type `TXT`, name empty, value the `google-site-verification=…` string in
   quotes. The `clicky-pete` IAM user is scoped to the photo bucket and CloudFront
   invalidations, so this is a console job, not a CLI one. Propagation is usually minutes.
3. **Submit the sitemap** — Sitemaps → `sitemap.xml` → Submit. Only after the branch is
   deployed: today that URL is answered by the SPA rewrite, and submitting an HTML page as a
   sitemap gets it rejected.
4. **Run URL Inspection on the homepage → Test live URL → View tested page.** This is the
   cheapest real answer to the prerendering question in §3: it shows the HTML Google actually
   ended up with, so it says whether the rendered `<title>`, description and JSON-LD made it
   through. It says nothing about Facebook or Slack, which never run the JavaScript at all.
5. **Come back in two to four weeks** and read Performance → Queries. That report decides the
   next round of this file — which session type to build a page for first, and which wording
   is already pulling. Before it has data, everything here is a guess.
6. **Optional, five minutes:** Bing Webmaster Tools imports a verified Search Console property
   in one click. Bing does not render JavaScript, so what it indexes is a second, blunter
   readout on the same shell problem.

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

Remaining after the deploy:

1. **`sitemap.xml` submitted 2026-08-25.** Note the address has to be the **full URL** —
   `https://www.clickypete.photography/sitemap.xml` — not the bare `sitemap.xml`. A domain
   property spans apex, www, http and https, so there is no prefix to prepend and a bare path
   is rejected as "Invalid sitemap address". The bare form only works on a URL-prefix property.
   Use the www form, matching the canonicals and the `Sitemap:` line in `robots.txt`.
2. Re-run URL Inspection → View tested page → HTML, and look for `<title>`, `og:title`,
   `canonical` and `application/ld+json`. Passing proves Googlebot's renderer sees them; it
   proves nothing about Facebook, Slack or iMessage, which never run the JavaScript.
3. Read Performance → Queries after two to four weeks. That report decides the next round.

Optional, five minutes: Bing Webmaster Tools imports a verified Search Console property in one
click. Bing does not render JavaScript at all, so what it manages to index is a blunter second
readout on the same empty-shell problem — cheap evidence for the prerendering decision.

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
  two different numbers. w

### 1. Test pass before the PR

Run `npm run dev`. Metadata is not on this list — it was checked already. What is here is what
a build and a DOM query cannot answer.

**Run 2026-08-25 in Chrome against `npm run dev`.** Results inline. `npm run ci` passed on the
branch first — 15 sitemap urls, 11 collections, nothing admin in `dist/`, lint under budget.

- [x] **Metadata on every route.** Titles change across Home → Gallery → `/gallery/Montana` →
      About → Contact → a 404 and never go stale. Canonicals are the www absolute form,
      `ProfessionalService` on Home, `BreadcrumbList` on the collection view, `noindex, follow`
      on the 404 only. The 404's canonical points at the site root rather than being
      self-referential — deliberate, commented in `NotFound.tsx`, and moot since `noIndex` wins.
- [x] **Lazy-loaded thumbnails.** `/gallery/Montana` went from 16 images to 100 across a fast
      scroll to the bottom, with zero left unresolved, and nothing blank on the way back up. The
      infinite-scroll sentinel fired once per batch rather than repeatedly; document height grew
      1756 → 6463 and stayed there. Every thumbnail carries `loading="lazy"`. Not throttled to
      Slow 4G — that is still worth a manual pass.
- [x] **The photo viewer modal.** Opens, arrows through, the 2000px rendition loads, and the alt
      text changes per photo ("Aerial photography in Hyalite Reservoir, MT — Montana
      collection"). Escape closes it.
- [x] **Footer social links.** All three hrefs match `SOCIAL_PROFILES` exactly, with
      `target="_blank"` and `rel="noopener noreferrer"`.
- [x] **Console.** Clean on load and through the whole pass — only Vite's HMR messages.
- [x] **The contact form, end to end.** Sent 2026-08-25. The API Gateway endpoint answered 200
      in 3.5s with `{"success":true}`, the honeypot was left empty, and the form cleared itself
      afterwards. Delivery itself is SES-side and was confirmed separately.
- [x] **The hero subtitle — kept as written, decided 2026-08-25.** "Portrait & landscape
      photographer in Bozeman, Montana". It is a plainer register than the rest of the site, and
      that was weighed and accepted: the h1 above it carries the voice, and a hero can afford one
      informative beat. The h1 and the subtitle fade as one block — the opacity animates on their
      shared wrapper, so they cannot drift apart; measured divergence across 60 samples was 0.00.

**Two things the pass turned up, neither a regression:**

1. **The hero text is on screen for 3.5 seconds** (raised to 5s since, in #90; the timer is now
   `Home.tsx:162`). It fades the whole hero text
   block out on a timer once the images load, and that predates this branch — it is on `dev`.
   The new subtitle inherits it, so the line being judged is a 3.5-second flash rather than
   something a visitor reads at leisure. Crawlers are unaffected: the text is in the DOM
   throughout, and opacity is not something a search engine holds against a page. The decision
   is whether a line written to say what the site sells should disappear on a timer.
2. **At a 455px viewport the subtitle fills the full width as a single line**, close to both
   edges. It does not collide with the mobile dot indicators — 139px clear — and there is no
   horizontal scroll. A true 360px viewport was not tested: Chrome would not size the window
   below 455 on this machine. At 360 the line wraps to two, which is fine, but it is worth one
   look on a real phone.

Original list, for reference:

- [ ] **The Home hero subtitle**, the only visible change on the site. Desktop and a 360px
      phone width. Does it crowd the h1? On mobile it sits near the dot indicators
      (`top-[calc(50%+34vw+2rem)]`) — check they do not collide. It should fade with the rest of
      the hero text on scroll rather than lagging. The real question is whether it reads like
      the site or like SEO copy bolted on; it is one element to delete if not.
- [ ] **Lazy-loaded thumbnails** — the change most able to break quietly. `/gallery` and a large
      collection such as `/gallery/Montana`: scroll fast, then scroll back up. Throttle to Slow
      4G and watch for thumbnails that never resolve, boxes that stay blank, or the
      infinite-scroll sentinel firing repeatedly because what is below it never loads. The
      masonry should not jump as photos land — the aspect-ratio box predates this change — but
      that interaction is worth watching rather than assuming.
- [ ] **The photo viewer modal.** Open a photo and arrow through several. Its alt attribute
      changed and it shares the preload path with `PhotoCard`.
- [ ] **All three footer social links.** Their hrefs moved into `src/config/site.ts`; a typo
      there breaks a link and nothing errors.
- [ ] **The contact form, end to end.** Send a real test message. Only an import changed, but it
      is the page that earns anything.
- [ ] **Tab titles** across Home → Gallery → a collection → About → Contact. Should change every
      time and never go stale. Spot-check — already verified against `npm run preview`.

Not worth testing yet: link previews pasted into Slack or iMessage. They stay blank until
prerendering is decided, and that is not a fault in this branch.

### 2. Production checks, once it deploys

**Run 2026-08-25 against the deployed site. All three pass** — but one needed a fix and a
redeploy first, recorded below because it will recur.

```
robots.txt    200  text/plain   the sitemap line is correct
sitemap.xml   200  text/xml     2102 bytes, 15 <loc> entries
console       clean — no CSP violation of any kind, GA loads, 22 images, 0 failures
```

**The inline `ld+json` is not blocked.** `ProfessionalService` is present and parsing in the
live DOM under `script-src 'self'`. Browsers do not enforce `script-src` on
`application/ld+json` data blocks — only on executable script. The worry recorded here before
the deploy was unfounded, and nothing in `customHttp.yml` needs to change for it.

**`/sitemap.xml` returned `text/html` at first, and the cause was the Amplify rewrite.** The SPA
rewrite rule carries an extension allowlist, and `xml` was not on it, so the file was shadowed
by `index.html` — `txt` was on the list, which is why `robots.txt` worked and the sitemap did
not. The fix is in the Amplify console under Rewrites and redirects, not in the repo:

```
</^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|xml|svg|woff|woff2|ttf|map|json|webp)$)([^.]+$)/>
```

**Editing the rule is not enough on its own.** CloudFront had already cached the HTML response
with `s-maxage=31536000` — a year at the edge — and Amplify exposes no manual invalidation. A
query string does not bust it either, since the distribution does not key on one. What clears it
is **Redeploy this version** on the branch in the Amplify console, which triggers the
invalidation without needing a commit. The confirming header is `x-cache: Miss from cloudfront`;
a `Hit` with a non-zero `age` means you are still reading the old object and cannot judge the
rule.

Original checks, for reference — three things only production can answer, and all three fail
silently:

```bash
curl -sI https://www.clickypete.photography/robots.txt    # expect 200, text/plain
curl -sI https://www.clickypete.photography/sitemap.xml   # expect 200, text/xml
```

`text/html` on either means the SPA rewrite answered instead of the file. **Both pass as of
2026-08-25** — `text/plain` and `text/xml` respectively — but only after `xml` was added to the
Amplify rewrite allowlist. A real file in `dist/` does not take precedence on its own, which is
the trap now written up in CLAUDE.md under "Static files, Amplify rewrites and the edge cache".
Re-check with `x-cache` in the headers: a hit with a non-zero age is the cached answer, not the
current one.

- [x] Open the deployed site with the console showing and look for a violation naming
      `script-src` — that would be the inline `ld+json` being blocked by `customHttp.yml`.
      Nothing local enforces the CSP, so this is production-only. **Checked 2026-08-25: not
      blocked**, and it never could be — browsers enforce `script-src` on executable script, not
      on data blocks. The homepage carries one `ProfessionalService` block and it parses.
- [x] Run the homepage through Google's Rich Results Test. **Passed 2026-10-29**: two valid
      items, Local business and Organization. Non-critical only: `telephone` is missing on the
      business, which waits on the phone decision; `streetAddress` and `postalCode` are missing
      on the organization, which is right for a service-area business with its address hidden.
- [x] Confirm no other CSP violation appeared. Console clean on a fresh load, 2026-08-25.
      Nothing here adds an external host, and the `/contact` backdrop added in #91 loads from
      the CloudFront host that was already allowed.

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

### 4. Image sitemap

**Built 2026-10-29, merged as #101, live via #102 the same day, and resubmitted in Search
Console.** 597 images across the
11 collection URLs, which is every photo with a collection. The photo host is hardcoded as
`PHOTO_URL` beside `SITE_URL`. The title duplicates `describePhoto`, commented on both sides.
The build throws past 1,000 images per URL. `xmllint` passes, `&` in place names is escaped,
and all 597 `<image:loc>` URLs answered 200. The sitemap grows from about 2 KB to 136 KB.

The plan as written beforehand:

`scripts/generate-sitemap.mjs` already walks `photos.json` and groups by collection. The work is
adding, inside each collection's `<url>`, one `<image:image>` per photo in it:

```xml
<image:image>
  <image:loc>https://photos.clickypete.photography/photos/2000/IMG_8553.webp</image:loc>
  <image:title>Landscape photography in Horse Prairie, MT — Montana collection</image:title>
</image:image>
```

Points that will otherwise cost a second pass:
p

- The `urlset` needs `xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"`.
- The image host is CloudFront, not the site origin. The script has no access to
  `VITE_CLOUDFRONT_URL` at build unless it reads `.env` — decide whether to hardcode the photo
  host next to the existing `SITE_URL` constant (consistent with how that one is already
  duplicated by hand) or to load the env file.
- The caption is the same sentence `describePhoto` builds. That helper is bundled TS and the
  script is plain Node, which is the same split `SITE_URL` already lives with. Duplicating a
  three-line template is cheaper than a build step; if it is duplicated, say so in a comment on
  both sides.
- Google caps a sitemap at 1,000 images per URL. 597 photos across 11 collections (2026-10-29)
  is far under it, but the cap is worth a note in the script rather than a surprise later.

Done looks like: `npm run build` prints the same url count, `public/sitemap.xml` validates, and
every `<image:loc>` resolves to a real object.

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
