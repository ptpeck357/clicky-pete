# Changelog

Every pull request merged into `prod`, newest first. `prod` is what Amplify deploys, so each
entry is a release to the live site. The date is when the `prod` PR merged, in Mountain Time.

Under each release are the pull requests into `dev` that it shipped, then any commits that went
onto `dev` directly, without a PR of their own.

## 2026-10-29 — #105

- #104 fix(seo): drop the duplicate `<title>` and the pipe in alt text
- #103 fix(contact): align pricing card buttons

## 2026-10-29 — #102

- #101 feat(seo): add image entries to the sitemap
- #100 fix(a11y): add a skip-to-content link

## 2026-10-06 — #99

- #98 Fix bugs from a full code review
- #97 chore(photos): add 8 photos and remove 19 Montana State entries
- #96 fix(admin): refuse cross-origin requests; apply npm audit fixes
- #95 refactor(home): derive displayedPhotos instead of storing it
- #94 fix(home): clear hero loading overlay on failure paths
- #93 chore: add gotchas in claude.md file

## 2026-08-25 — #92

- #91 feat(contact): add hero photo and link to form

## 2026-08-25 — #89

- #90 style(home): give the hero text longer before it fades
- #88 Feat/seo metadata
- #87 Refactor/rename portrait category
- #86 Docs/claude md accuracy
- #85 Feat/admin library grouping

Direct commits:

- feat: manifest update (`4c040fc`)
- feat: update current photos and couple new ones (`4a77b77`)
- feat: update current photo (`3a3ddd5`)

## 2026-08-17 — #84

- #83 fix(about): animate the intro columns vertically

## 2026-08-17 — #77

- #82 fix(contact): grow the message field with its contents
- #81 Chore/contact copy
- #80 Feat/page ctas
- #79 Feat/contact pricing
- #78 Feat/admin library controls
- #75 fix: match sort pill size to the view pills
- #74 chore: correct capture date on two engagement photos
- #73 Chore/validate manifest
- #72 Feat/photo dates

## 2026-08-16 — #71

- #70 Fix/preload modal neighbours
- #69 docs: require a branch off dev for every change
- #68 chore: delete the unused moab hero renditions
- #67 Perf photo modal
- #66 Fix manifest path
- #65 refactor: delete five modules nothing imports
- #64 Admin portal

Direct commits:

- docs: list the security headers in the infrastructure section (`c760387`)
- docs: record the CSP, honeypot and Lambda deployment constraints (`5c1453f`)
- Revert "refactor: delete five modules nothing imports" (`ed3896a`)
- refactor: delete five modules nothing imports (`8fdd673`)
- feat(contact): add a honeypot field to the contact form (`3d257af`)
- docs(env): add the missing VITE_CONTACT_API_URL to .env.example (`9efd6b7`)
- feat(security): serve a CSP and hardening headers from Amplify (`b1b80a4`)
- chore(deps): clear the two remaining dev-only advisories (`6a49116`)
- perf(router): lazy-load the non-landing routes (`9fad7a3`)
- fix(admin): validate the upload filename before deriving keys from it (`92f228f`)
- chore(deps): drop unused @emotion/react and @emotion/styled (`256e6de`)
- docs: require verifying a photos.json change against S3 before committing (`b13d3bc`)
- feat(photos): add 11 photos from Big Sky, Grassy Mountain, Lava Lake and Hyalite (`4d05a9f`)

## 2026-08-14 — #63

- chore(deps): update dependencies to latest (`76616c5`)

## 2026-05-07 — #61

- Revise README structure and content (`03d2c97`)

## 2026-05-04 — #60

- docs(about): tighten bio copy (`8703933`)
- refactor(photo-card): drop hover info overlay (`5f667c2`)
- refactor(gallery): default to all photos view (`93291c4`)

## 2026-04-28 — #59

- refactor: update hero image for about me (`3c8abd6`)
- refactor: move dots for hero image index below the image (`8fca27d`)

## 2026-04-26 — #58

- refactor: add gradient background to about me page (`0160478`)
- refactor: add gradient background to contact (`852d362`)

## 2026-04-26 — #57

- refactor: add logo to git (`d108d08`)
- refactor: update logo (`f7f4bad`)

## 2026-04-12 — #56

- #55 Updates to journal page
- #54 refactor: make website more mobile friendly. add logo
- #51 Feed page

Direct commits:

- refactor: fix hero image in collection (`b349a96`)
- fix: update package path (`3ab5bd4`)
- refactor: remove name and location over profile picture. add it to bio (`0d807f1`)

## 2026-03-19 — #53

- refactor: add text shadow (`21f1591`)

## 2026-03-19 — #52

- feat: add profile picture. fix spacing between each section (`066e890`)

## 2026-03-12 — #50

- #49 refactor: split out about me page and create contact page
- #48 Merge pull request #47 from ptpeck357/dev

## 2026-02-13 — #47

- refactor: remove mui package (`24b5752`)
- fix: replace MUI Masonry with react-masonry-css to fix scroll jerk (`00f4d73`)
- fix: add rootMargin and overflowAnchor none class to help with scrolling (`2ac3470`)

## 2026-02-10 — #46

- fix: adjust hero image in collections (`c45ac4c`)

## 2026-02-10 — #45

- #44 Collection hero image

Direct commits:

- refactor: remove meta data under photo card (`b659a0d`)

## 2026-02-09 — #43

- #42 update dev to prod

Direct commits:

- refactor: align Home hero dot indicators with About page and remove scroll arrow (`71015fd`)

## 2026-02-09 — #41

- refactor: update readme file (`04abc0a`)

## 2026-02-09 — #40

- #39 feat: hook up contact me to lamda functino

## 2026-02-09 — #38

- feat: swap out hero image in about me page (`6d2751b`)
- refactor: improve mobile gallery layout (`d530430`)
- feat: add dot indictators for home page (`329e70d`)
- refactor: update bio in about me (`a65a50a`)
- refactor: add less time on hero images (`b16a520`)
- fix: disable scrollbar if contact me modal is open (`eccef01`)

## 2026-02-06 — #37

- #36 Prod

## 2026-02-06 — #35

- refactor: instead eslint warnings (`40264ff`)

## 2026-02-06 — #34

- #33 refactor: delete unused code
- #32 refactor: add MUI grid so photos won't jump around
- #31 feat: add GA to site. udpate readme file
- #30 fix: timing problem in useEffect. use callback ref
- #29 refactor: update page icon. fix mobile view in about me page
- #28 refactor: use real data. fix bugs. add features
- #27 refactor: remove search func and components
- #26 feat: new icons
- #25 feat: add not found page if url doesnt exist
- #24 refactor: delete upload and admin func
- #23 Add progressive loading home page
- #22 fix: have arrow show on mobile devices
- #21 refactor: new mobile layout masonry style
- #20 fix: change ratio aspect to 4 to 5
- #19 feat: add contact modal
- #18 fix: make photos load faster
- #17 feat: add photo shuffle
- #16 fix: update about me page
- #15 refactor: change header background color
- #14 refactor: fix pills on individual photos
- #13 refactor: update file structure to match atomic file structure better
- #12 feat: add new dynamic route for collections
- #11 fix: redo grid
- #10 Fix photo ratios
- #9 fix: remove unneeded code comments
- #8 refactor: make ui smoother. add arrow down functionality
- #7 refactor: more mobile friendly
- #6 fix: eslint errors
- #5 feat: add .net for backend to hook with s3 bucket
- #4 Fix conventional commits
- #3 feat: add tail wind and navbar and header
- #2 feat: add dummy routing
- #1 Local branch

Direct commits:

- ci: add github file (`4196cad`)
