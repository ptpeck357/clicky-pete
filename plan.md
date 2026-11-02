# Plan: clicky-pete

> Open work only. Anything built and verified has been cut from this file — the code is the
> record of it, `CHANGELOG.md` the record of what shipped when, and CLAUDE.md carries the rules
> that came out of it. What is left here is what is undecided, unfinished, or unchecked.

## Left off — pick up here

### 2026-11-01

`prod` is at #122 (2026-11-01 Mountain Time), with its `CHANGELOG.md` entry merged in #123.
`dev` is ahead by #123 (docs only) and #124, the light/dark mode toggle, which has not shipped to
`prod` yet. When it does, add its `CHANGELOG.md` entry and check on production that
`/theme-init.js` is served as JavaScript, as the dev URL was.

SEO work is tracked in `SEO.md`; its "Next" list is the current order.

## Do first

These are manual checks that nothing in the repo records as done.

1. Open the deployed site with the browser console showing, go to /contact, submit a test
   message, and watch for anything mentioning "Content Security Policy". **Half done
   2026-08-25:** production's console was clean on load, with GA loading and no CSP violation
   (`SEO.md` §2). The submit on production is what was never recorded; the end-to-end send was
   run from `npm run dev`, against the same endpoint. A block is one line to fix — add the host
   it names to the matching directive.
2. Open a photo from the gallery and judge whether it still lags. Four changes went in for
   this and none of them was measured in a browser.
3. **Look at the gallery on a phone.** The sort control has never been used under a thumb, and
   the date button's whole affordance is the repeat tap. On a 360px viewport, check that the
   pills are reachable, nothing scrolls horizontally, and the category row is not squeezed.
   Chrome on this machine will not size a window below about 455px, so it needs a real phone.
4. **Look at /contact on a phone.** The package cards, their four hand-drawn icons, the
   dividers and the auto-growing message field have all been verified by build and by one
   desktop screenshot, not on a device. One mobile bug has already come out of real use — the
   package buttons focused the name field and opened the browser's autofill list over the form.

## Open decisions

- About and Gallery both end with "at introductory rates", which the contact page no longer
  says. Either strip it from those two or put it back on contact; right now the phrase is
  unsupported wherever it appears.
- Session prices are introductory and deliberately under the Bozeman market. The plan was to
  raise them after roughly 10–15 bookings, or at the start of next season. Nothing records
  when that starts.
- The lint budget. Warnings sit at 7 against a max of 10: five
  `react-hooks/set-state-in-effect`, one impure `Math.random` call during render, and one
  skipped-memoization notice. CLAUDE.md lists where each one is. Three more and CI fails, which
  is a poor way to find out.

## Todo

- [ ] Verify `aspectRatio` against real pixels for the pre-existing photos (597 entries as of
      2026-10-29). `707c5fd` fixed how uploads measure the ratio after EXIF rotation, but that
      only covers new uploads, and only photos added through the admin have ever been checked.
      sharp is installed; the check is downloading each 2000px object, measuring it, and
      comparing against the manifest. It is the one manifest claim `npm run validate:manifest`
      cannot check, because it needs the pixels.

**If the site looks wrong**, the first question is whether the repo copy of
`src/data/photos.json` matches the live one — see "Verify before committing" in CLAUDE.md.

## Testing — decided 2026-08-17: no unit suite yet

The bugs this project has produced were data or environment problems, found by hand in minutes,
that a test written against the same assumptions would not have caught. Revisit with a second
contributor, or a helper branchy enough that changing it is frightening. Then use **Vitest, not
Jest**, since it reuses the Vite config. The first targets are the pure helpers: aspect-ratio
snapping, `isCalendarDate`, `captureDate` and `sortPhotos`.
