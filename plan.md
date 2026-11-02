# Plan: clicky-pete

> Open work only. Anything built and verified has been cut from this file — the code is the
> record of it, and CLAUDE.md carries the rules that came out of it. What is left here is
> what is undecided, unfinished, or unchecked.

## Left off — pick up here

### 2026-11-01

**Prerendering is live:** #109, shipped to `prod` via #110 (2026-11-01 Mountain Time), with the
Amplify rules changed. #111 added its `CHANGELOG.md` entry and the CLAUDE.md rules.

**#108 (`fix/collection-card-links`) is live**, with #111, via #112 (2026-11-01 Mountain Time),
and checked on production: collection cards are
real links, the first fix from the SEO audit, plus fixes from two code reviews (a route change no
longer shows the previous view's photos). It also carries the #107 `CHANGELOG.md` entry and puts
this file and `SEO.md` under version control. The #112 `CHANGELOG.md` entry is on
`docs/changelog-112`. Details and next steps are in `SEO.md`.

### 2026-10-29

**State at end of session:** `prod` and `dev` are level. #105 shipped #103 (pricing-button
alignment) and #104 (title and alt-text fixes, README and CLAUDE.md refresh), verified live; #102
earlier shipped #100 (skip-to-content link) and #101 (image sitemap). `CHANGELOG.md` landed on `dev` in #106
(merged 18:13 UTC): every `prod` PR with its Mountain Time date and the `dev` PRs and direct
commits it shipped, plus a CLAUDE.md line saying to append an entry after each `prod` merge. #107
shipped it to `prod` at 18:14 UTC (2026-10-29 Mountain Time), docs only; `prod` and `dev` are level
again. The #107 `CHANGELOG.md` entry went into #108. Since 2026-08-17, PRs #88–#101
landed: the SEO work (#88–#92, tracked in `SEO.md`), an Amplify rewrite gotcha recorded in
CLAUDE.md (#93), hero loading and Home fixes (#94–#95), a dev-admin cross-origin guard (#96), a
photo refresh to 597 entries (#97), and a code-review pass (#98) that included publishing
`photos.json` with `Cache-Control: no-cache`.

Live via #105: #104 fixed the duplicate `<title>` and the
"Astro|Night" alt text (details in `SEO.md`) and refreshes README.md, which had fallen behind:
no SEO features, a `templates/` folder that does not exist, no `src/config/` or `scripts/`.
The README's unsupported MIT license line was removed, on Peter's call.

An SEO audit of the live site ran later on 2026-10-29. Its findings are at the top of
`SEO.md`'s "Where we left off". The first two, crawlable collection links and the empty shell,
are #108 and #110 (2026-11-01 above).

Of the "Do first" list below, only item 1 has moved: production's console was checked clean on
2026-08-25, with GA loading and no CSP violation, but a contact-form submit on production was
never recorded. Items 2–4 are still open.

### 2026-08-17

Updated 2026-08-17. `prod` and `dev` are level — the deploy that everything below was waiting
on has happened, so the site is running current code for the first time in this plan's life.

Since PRs #72/#73 (dates, gallery order, manifest validator): the contact page gained a
sessions-and-pricing section above the form, About and Gallery gained closing links to it, the
social links moved from the contact page into the site-wide footer, and a run of mobile fixes
landed on the contact form (#78–#80). Since then: contact copy (#81), the message field's
autosize fix (#82), an About overflow fix (#83), admin library grouping (#85), a CLAUDE.md
accuracy pass (#86), and `e08cf45` dropping one of About's hero images.

`e08cf45` went straight onto `dev` rather than through a branch and a PR — a single-parent
commit with no PR behind it. Nothing to undo, since `prod` and `dev` are level, but it is the
one time the rule in CLAUDE.md has slipped.

**Do first — now finally checkable, because the code is deployed:**

1. Open the deployed site with the browser console showing, go to /contact, submit a test
   message, and watch for anything mentioning "Content Security Policy". **Half done
   2026-08-25:** production's console was clean on load, with GA loading and no CSP violation
   (`SEO.md` §2). The submit on production is what was never recorded; the end-to-end send was
   run from `npm run dev`, against the same endpoint. A block is one line to fix — add the host
   it names to the matching directive.
2. Open a photo from the gallery and judge whether it still lags. Four changes went in for
   this and none of them was measured in a browser.
3. **Look at the gallery on a phone.** The sort control has never been used under a thumb, and
   the date button's whole affordance is the repeat tap.
4. **Look at /contact on a phone.** The package cards, their four hand-drawn icons, the
   dividers and the auto-growing message field have all been verified by build and by one
   desktop screenshot, not on a device. One mobile bug has already come out of real use — the
   package buttons focused the name field and opened the browser's autofill list over the form.

**Open decisions:**

- About and Gallery both end with "at introductory rates", which the contact page no longer
  says. Either strip it from those two or put it back on contact; right now the phrase is
  unsupported wherever it appears.
- Session prices are introductory and deliberately under the Bozeman market. The plan was to
  raise them after roughly 10–15 bookings, or at the start of next season. Nothing records
  when that starts.

**Then, in any order:**

- Decide the lint budget. Warnings sit at 8 against a max of 10 (as of 2026-10-29): six
  `react-hooks/set-state-in-effect`, one impure `Math.random` call during render, and one
  skipped-memoization notice. CLAUDE.md lists where each one is. Two more and CI fails, which
  is a poor way to find out.
- Verify `aspectRatio` against real pixels for the pre-existing photos (597 entries as of
  2026-10-29). `707c5fd` fixed how uploads measure the ratio after EXIF rotation, but that only
  covers new uploads. sharp is
  installed; the check is downloading each 2000px object, measuring it, and comparing against
  the manifest. Only photos added through the admin have ever been verified. This is the one
  manifest claim `npm run validate:manifest` cannot check, because it needs the pixels.

**If the site looks wrong**, the first question is whether the repo copy of
`src/data/photos.json` matches the live one — see "Verify before committing" in CLAUDE.md.

## Testing — decided 2026-08-17: a data validator, not a unit suite

**No Vitest suite for now.** The case for one was argued and rejected on evidence: the two bugs
this project has actually produced (`2026-13-01` returning 500, and date validation running
after the S3 upload) were both found by hand-testing in minutes, and neither would have been
prevented by a test written against the same wrong mental model. Every scar in CLAUDE.md is
data or environment — mixed-case S3 keys, manifest drift, deleting a referenced object, a CSP
that fails in production only. A green `sortPhotos` suite stops none of them.

The cost was also real: most of the targets below are unexported or impure as written, so
testing them means extracting helpers out of two shipping components first. Refactoring working
UI to enable tests is inverted risk on a solo project.

**When a suite earns its place:** a second contributor, or a helper with enough branching that
changing it is frightening. `sortPhotos` and `isCalendarDate` are neither — both were exercised
against real inputs through esbuild, and neither is likely to be touched again. If that day
comes, use **Vitest, not Jest**: it reuses the existing Vite config, where Jest would need its
own runner, a TypeScript transform and jsdom from scratch.

The scope that was worked out, kept for that day — all pure functions, no I/O, no mocks:

| Target                                        | Why it earns a test                                                                                                                                    |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `aspectRatio` snapping                        | Non-obvious logic: 1% tolerance against a ratio table, gcd fallback otherwise. 3000×2000 → `3:2`, 2400×1800 → `4:3`, an odd crop → reduced exact ratio |
| `ratioOf` (`AdminPage.tsx`)                   | Duplicates the server's calculation for the pre-upload warning; a test pins the two together                                                           |
| `cssAspect` (`PhotoLibrary.tsx`)              | Parses `"4:5"` → `"4 / 5"`, falls back on malformed input                                                                                              |
| `getModalDimensions` (`PhotoViewerModal.tsx`) | Pure given a ratio and viewport. Would pin the guarantee that 3:2 and 4:5 render identically to the pre-fix behaviour                                  |
| `isCalendarDate` (dates work)                 | `2026-02-31` and `2026-13-01` must fail where the regex alone passes them                                                                              |
| `captureDate` (dates work)                    | An EXIF `Date` at 00:30 must yield the day the camera recorded, not the day before                                                                     |
| `sortPhotos` (gallery order)                  | Dated photos descending, undated after them; a mixed list is the case worth pinning, along with the seed reproducing an order                          |

Not worth testing:

- **S3 and CloudFront calls** — mocking the AWS SDK mostly tests the mock. The real behaviour
  (409s, overwrites, invalidation) has been verified against the actual bucket.
- **The admin UI** — dev-only, and exercised by hand every time photos are published.
- **Existing site components** — unchanged by this work and untested today; adding coverage
  there is a separate decision.

## SEO — moved to SEO.md

The whole SEO track — what shipped (from #88 on), what is left, the prerendering
decision, and the test and production checks — lives in `SEO.md` as of 2026-08-25. It outgrew a
section here. Nothing about it is recorded in this file any more.

## Todo

### Phase 0 — decisions and config

- [x] Decide whether this file should be version-controlled. Yes: un-ignored and committed
      on 2026-11-01, in #108.

### Phase 1 — seed and audit

- [ ] Verify `aspectRatio` against real pixels for the pre-existing entries. The 4 photos
      added during triage were each verified by hand (400×267 = 1.498, so `3:2`); the rest,
      597 entries in all as of 2026-10-29, are still unchecked.

### Phase 2 — publish pipeline

- [x] ~~Optional: set `Cache-Control: max-age=60, must-revalidate` on the manifest~~ —
      decided the other way: the admin publishes `photos.json` with `Cache-Control: no-cache`
      (`d6547d4`, in #98). Why that header is load-bearing is in CLAUDE.md.

### Phase 6 — gallery order and sort control

- [ ] Check both views on a 360px viewport: pills reachable, no horizontal scroll, category
      row not squeezed. Needs a real phone: Chrome on this machine will not size a window below
      about 455px (`SEO.md`, "Notes that are easy to lose").

### Phase 7 — SEO

See `SEO.md`. Of the six items in its 2026-10-29 audit, the first two are done (#108, #110);
its "Next" list is the current order.
