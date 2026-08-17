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

- **`id` is lowercased, `file` keeps the camera's casing.** Every entry pairs them that way:
  `img-8553` with `IMG_8553.webp`, `psx-20170228-194849` with `PSX_20170228_194849.webp`. The
  id drops the extension, lowercases, and turns underscores into hyphens; the filename only
  swaps its extension. Deriving both from the same slug is a mistake that has already been
  made once, and it leaves the bucket with mixed-case keys.
- **Only 3:2, 4:5 and 4:3 are accepted on upload.** Anything else means the Lightroom export
  used the wrong crop, and the upload is refused with 422 unless `x-allow-any-ratio` is set.
  The list lives in `vite-plugin-admin.ts` and is served to the client via `GET /photos`, so
  it stays in one place.
- **`photos.json` must be written as `JSON.stringify(data, null, 2)` plus a trailing
  newline.** It is in `.prettierignore` (the repo sets `useTabs: true`, which would otherwise
  reformat a generated file), so nothing enforces this but the diff. Any other format churns
  the whole file on every publish.
- **`aspectRatio` is derived from the image, never typed.** It is not an editable field
  anywhere in the admin, and `/__admin/update` refuses to change it.
- **`date` is optional and typed, and an absent one means "unknown".** Stored as `YYYY-MM-DD`,
  which is what makes a string compare chronological — the gallery order depends on that.
  Nothing backfills it: most entries predate the field and stay without one. The admin
  pre-fills EXIF `DateTimeOriginal`, or today when the file carries none, but the server only
  validates what it is sent and never invents a value. Clearing the field drops the key rather
  than storing `""`.
- **Never delete an S3 object that the live `photos.json` still references.** The site breaks
  immediately, regardless of what the repo copy says. Publish first, then delete — which is
  what the admin's "Remove and delete files" does, and why it refuses to delete when the
  publish hits the ETag lock.
- **Uploading refuses to overwrite.** A filename already in `photos.json` returns 409, and so
  does one whose objects exist in the bucket without an entry — removing an entry leaves its
  files behind, so that state is normal and silently overwriting them would lose a photo.

### Verify before committing a `photos.json` change

The commit is a record of what is live, so check it against reality first rather than trusting
the file. For every entry added or changed:

```bash
# all three renditions exist for each new file
aws s3 ls s3://clicky-pete-photography/ --recursive --profile clicky-pete | grep "/IMG_0009.webp$"

# the live copy matches the repo copy
curl -s https://photos.clickypete.photography/data/photos.json | node -e "..."
```

Entry counts should agree: repo, live, and objects per size prefix. A mismatch means either
an upload half-finished or the manifest was never published — both worth knowing before the
change is recorded as done.

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

## Contact form and headers

`customHttp.yml` sets a Content-Security-Policy listing every external host the app may
reach: CloudFront for photos, the API Gateway contact endpoint, and Google Analytics.
**Adding a new external host means adding it there too** — otherwise the request is blocked
in production only, with nothing failing locally to warn you. `style-src` keeps
`'unsafe-inline'` because Framer Motion animates through inline style attributes.

The contact form carries a honeypot: a `website` field positioned off-screen. The handler
answers 200 without sending when it is filled, so a bot learns nothing from the response. The
field name has to match on both sides — `Contact.tsx` and `lambda/contact-form/index.mjs` —
and neither validates that it does.

`lambda/contact-form` is not deployed by Amplify. Changes to it need deploying separately, so
a commit touching the Lambda is not live until that happens.

## Conventions

Tabs, single quotes, 120 columns, semicolons — enforced by Prettier on commit via Husky and
lint-staged. Components are organised atoms/molecules/organisms/templates and use Tailwind
utilities, not CSS modules.

Commits follow Conventional Commits, checked by commitlint, and are grouped by what the
changes have in common — several small commits rather than one covering ten unrelated files.
Stage explicit paths rather than `git add -A`, so an unrelated edit sitting in the working
tree does not end up inside a feature commit.

Committing is its own step, asked for separately — never the automatic end of making a change.
Changes get tested and approved first, so finishing an edit means running `npm run ci` and
saying it is ready, then waiting. Approval to commit covers that commit, not the next one.

Gallery order is shuffled on every load (`Gallery.tsx`), so array order in `photos.json`
carries no meaning.

## Branching

`dev` and `prod` are never worked on directly. Every change starts as a new branch cut from
`dev`, and lands through a pull request — never a commit or a push straight to either branch.

```bash
git switch dev && git pull
git switch -c <type>/<short-description>
```

Branch off the remote, not whatever `dev` happens to be locally: fetch first, and rebase a
branch that has fallen behind before pushing or opening a PR.

```bash
git fetch origin
git log --oneline HEAD..origin/dev   # empty means up to date
git rebase origin/dev                # only if it is not
```

**Name the branch on the first push.** Cutting one from `origin/dev` — `git switch -c <branch>
origin/dev` — sets its upstream to `dev`, so a later bare `git push` aims your commits at `dev`
rather than at the branch, and the first sign of it is a rejection. Push it by name once, which
also repoints the upstream:

```bash
git push -u origin <branch>
```

If work has already been committed on `dev` by mistake, move it to a branch before pushing:
`git switch -c <branch>` keeps the commits, then reset `dev` back to `origin/dev`.
