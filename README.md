# Photography Portfolio

## Features

- **Photo Gallery**: View and organize photos with dynamic categories
- **Dynamic Filtering**: Filter photos by category, location, and collection
- **Date Sorting**: Gallery and collections run newest first, with a date button that flips to oldest and a Random shuffle
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile
- **CloudFront CDN**: Fast global content delivery with multiple image sizes
- **Modern UI**: Clean, professional interface with Tailwind CSS and animations
- **Photo Modal**: Full-screen photo viewing with navigation
- **Collection Browsing**: Explore photos organized by location and theme
- **Contact Form**: Get in touch directly through the site, powered by AWS SES and Lambda
- **Photo Admin**: Drag-and-drop publishing at `/admin` — resize, tag, upload and publish, available only in development
- **Hero Carousel**: Auto-rotating hero images with dot indicators and parallax scrolling
- **Infinite Scroll**: Photos load progressively as you scroll down the page
- **Progressive Loading**: Optimized image loading with srcSet and lazy loading

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and building
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Custom hooks** for state management

### Infrastructure
- **AWS S3** for photo storage, with images stored in multiple sizes (400px, 800px, 2000px) in WebP format
- **AWS CloudFront** as a CDN sitting in front of S3 for fast global content delivery
- **AWS Amplify** for hosting and continuous deployment
- **AWS Route 53** for DNS management
- **AWS SES** for handling contact form emails via a Lambda function (`lambda/contact-form`)
- **Responsive Images** with srcSet served through CloudFront
- **Security headers** — CSP, HSTS, nosniff and a referrer policy, served by Amplify from `customHttp.yml`

## Getting Started

```bash
npm install
cp .env.example .env    # set VITE_CLOUDFRONT_URL
npm run dev             # http://localhost:5173
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Dev server, and the only place the photo admin exists |
| `npm run build` | Type-check and build to `dist/` |
| `npm run ci` | Lint, format check, build, and verify no admin code shipped |
| `npm run fix` | Auto-fix lint and formatting |

## 📁 Project Structure

```
photography-portfolio/
├── src/
│   ├── app/                   # App configuration
│   │   ├── App.tsx            # Main app component
│   │   └── Router.tsx         # Route definitions (/admin is gated to dev)
│   │
│   ├── components/            # React components
│   │   ├── atoms/             # Basic UI components
│   │   ├── molecules/         # Composite components
│   │   ├── organisms/         # Complex components
│   │   └── templates/         # Page layouts
│   │
│   ├── data/
│   │   └── photos.json        # Photo index — source of truth, published to S3
│   │
│   ├── pages/                 # Page components
│   │   ├── Home.tsx           # Homepage with featured photos
│   │   ├── Gallery.tsx        # Photo gallery with filtering
│   │   ├── About.tsx          # About page
│   │   ├── Contact.tsx        # Contact form
│   │   ├── NotFound.tsx       # 404 page
│   │   └── Admin/             # Photo admin (development only)
│   │
│   ├── hooks/                 # Custom React hooks
│   ├── services/              # API communication
│   ├── types/                 # TypeScript definitions
│   ├── utils/                 # Utility functions
│   └── styles/                # CSS styles
│
├── vite-plugin-admin.ts       # Dev-only endpoints backing the admin
├── admin.config.example.json  # Template for local AWS targets
├── lambda/                    # AWS Lambda functions (contact form)
├── public/                    # Static assets
└── package.json               # Dependencies
```

## Managing Photos

`src/data/photos.json` is the index the site reads: one entry per photo with its id, filename
and tags. A copy is published to S3, and CloudFront serves that copy to visitors — so photos
appear on the site as soon as they are published, with no rebuild or deploy.

Each photo is stored as three WebP renditions at `photos/{400,800,2000}/<file>`.

### Adding photos

```bash
npm run dev     # then open http://localhost:5173/admin
```

Drag photos or a whole folder onto the page — files are read in place, never copied into the
project or moved on disk. Set the category, location and collection once for the batch, adjust
anything per photo, then upload and publish. The admin resizes to all three sizes, uploads
them, updates `photos.json` and clears the CDN cache.

Accepted crops are 3:2, 4:5 and 4:3; anything else is flagged as a likely export mistake, with
an option to upload it anyway. `aspectRatio` is measured from the image, never entered by hand.

The date field arrives filled in: the capture date from the file's EXIF where there is one,
otherwise today. Both are editable before upload, and clearing the field is how you say the
date is unknown — nothing is stored in that case, and nothing is ever guessed on the server.

The Library tab lists everything already published. Click a photo to open it full screen with
its tags alongside, where arrow keys move through the list. Removing offers two choices:
dropping the entry alone, which leaves the image files in storage, or removing it and deleting
the files — which publishes first, so the site never points at a missing image.

**Tag descriptions:**
- `category`: Landscape, Portrait, Aerial, or Astro|Night
- `location`: where it was taken, as `Place, ST` or `Place, Country`
- `collection`: the group it belongs to (Montana, Engagements, Graduations, Idaho, …)
- `date`: when it was taken, as `YYYY-MM-DD`. Optional — an absent date means unknown, and the
  photos that predate the field keep none rather than being given a guess
- `featured`: show in the homepage featured section
- `hero`: use as a hero/banner image
- `collectionCover`: use as the cover photo for this collection

### Local setup for the admin

Copy `admin.config.example.json` to `admin.config.json` (gitignored) and fill in the bucket,
region, AWS profile and CloudFront distribution id. Credentials are read from `~/.aws` by
profile name — nothing AWS-related is `VITE_`-prefixed, since that would inline it into the
shipped bundle.

The admin exists only under `npm run dev`. It is excluded from production builds, and
`npm run ci` fails if any of it reaches `dist/`.

## Usage

### Browsing Photos

- **Home**: Featured photos with progressive loading
- **Gallery**: View all photos, with category filters and a sort control
- **Sorting**: Newest first by default. The date button flips between newest and oldest and shows which is in force; Random shuffles, and reshuffles each time it is clicked. Undated photos sit below the dated ones, shuffled, and the choice is held in the URL as `?sort=` so a sorted view can be shared
- **Collections**: Browse photos by group — Montana, Graduations, Engagements, Idaho, Portraits, Fragments, Washington, San Luis Obispo, Arizona, Wyoming, Utah
- **Categories**: Filter by photo type — Landscape, Portrait, Aerial, Astro|Night
- **Photo Modal**: Click any photo for full-screen view with navigation

### Navigation

- **Home** → Featured photos and hero carousel
- **Gallery** → All photos with collection and category filters
- **About** → Photographer information
- **Contact** → Contact form (sends via AWS SES Lambda)

### Code Quality

The project includes:
- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for git hooks
- **Commitlint** for conventional commits

`npm run ci` runs all of the above plus the production build, and verifies that no admin code
made it into the bundle.

See `CLAUDE.md` for the constraints that are not obvious from the code — the `photos.json`
format requirement, the id convention, and the two ways admin code can silently reach
production.


## License

This project is licensed under the MIT License.
