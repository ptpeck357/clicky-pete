# clicky-pete

Photography portfolio. React 19 + Vite + Tailwind v4, deployed on AWS Amplify. Photos live in
S3 behind CloudFront; the site reads a single JSON index at runtime.

## Commands

```
npm run dev     # dev server, and the only place /admin exists
npm run ci      # eslint + prettier + build + verify:no-admin
npm run fix     # eslint --fix + prettier --write
```

`npm run ci` must pass before committing. Lint runs with `--max-warnings=10`; there are
currently 9, all the pre-existing `react-hooks/set-state-in-effect` pattern in `usePhotos`,
`Gallery`, `Home` and `AdminPage`.

## How photos work

`src/data/photos.json` is the source of truth: one entry per photo, holding its id, filename
and tags. The site does not read the repo copy — it fetches the copy published to
`s3://clicky-pete-photography/data/photos.json` via CloudFront. The two are kept in sync by
publishing, never by editing S3 directly.

Each photo exists as three WebP renditions at `photos/{400,800,2000}/<file>`.
`cloudFrontPhotoService.getPhotoUrl()` builds those paths, so the key layout is load-bearing.

Rules that are easy to break:

- **ids follow one convention across every entry**: filename without extension, lowercased,
  underscores to hyphens (`PSX_20170228_194849.webp` → `psx-20170228-194849`).
- **`photos.json` must be written as `JSON.stringify(data, null, 2)` plus a trailing
  newline.** It is in `.prettierignore` (the repo sets `useTabs: true`, which would otherwise
  reformat a generated file), so nothing enforces this but the diff. Any other format churns
  the whole file on every publish.
- **`aspectRatio` is derived from the image, never typed.** It is not an editable field
  anywhere in the admin, and `/__admin/update` refuses to change it.
- **Never delete an S3 object that the live `photos.json` still references.** The site breaks
  immediately, regardless of what the repo copy says. Publish first, then delete.

## The admin (`/admin`)

A dev-only tool for adding and retagging photos: resize to three sizes, upload, update
`photos.json`, invalidate CloudFront. It runs as Vite dev middleware in
`vite-plugin-admin.ts` (`apply: 'serve'`), with the UI in `src/pages/Admin/`.

None of it ships. Two ways that silently stops being true, both of which have happened:

1. **A module-scope `lazy(() => import('./AdminPage'))` still emits a chunk.** Guarding only
   the JSX leaves the import reachable. The `import()` has to sit inside the
   `import.meta.env.DEV` branch itself — see `Router.tsx`.
2. **Tailwind generates classes from source it scans, bundled or not.** The exclusion is
   applied by `adminCssExcludePlugin` (`apply: 'build'`), not written into `globals.css`
   directly — putting it there also strips the classes in dev and leaves the admin unstyled.

`npm run verify:no-admin` greps `dist/` for admin strings and is part of `npm run ci`. If it
fails, something above regressed.

### Local setup

`admin.config.json` (gitignored, see `admin.config.example.json`) holds bucket, region, AWS
profile and CloudFront distribution id. Credentials come from `~/.aws` via the profile name;
nothing AWS-related is `VITE_`-prefixed, since that would inline it into the shipped bundle.

`.admin-state.json` (gitignored) stores the ETag of the last publish. Publishing does a
`HeadObject` first and returns 409 if the live file changed since — an out-of-band edit is
not silently overwritten. If you legitimately need to force a publish, update that file.

The IAM user is scoped to this one bucket plus `cloudfront:CreateInvalidation`.

## Conventions

Tabs, single quotes, 120 columns, semicolons — enforced by Prettier on commit via Husky and
lint-staged. Components are organised atoms/molecules/organisms/templates and use Tailwind
utilities, not CSS modules.

Commits follow Conventional Commits, checked by commitlint, and are grouped by what the
changes have in common — several small commits rather than one covering ten unrelated files.
Stage explicit paths rather than `git add -A`, so an unrelated edit sitting in the working
tree does not end up inside a feature commit.

Gallery order is shuffled on every load (`Gallery.tsx`), so array order in `photos.json`
carries no meaning.
