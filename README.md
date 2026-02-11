# Photography Portfolio

I created this website to host my photos with the help of AI. Hope you enjoy!

## 🚀 Features

- **Photo Gallery**: View and organize photos with dynamic categories
- **Dynamic Filtering**: Filter photos by category, location, and collection
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile
- **CloudFront CDN**: Fast global content delivery with multiple image sizes
- **Modern UI**: Clean, professional interface with Tailwind CSS and animations
- **Photo Modal**: Full-screen photo viewing with navigation
- **Collection Browsing**: Explore photos organized by location and theme
- **Contact Form**: Get in touch directly through the site, powered by AWS SES and Lambda
- **Hero Carousel**: Auto-rotating hero images with dot indicators and parallax scrolling
- **Infinite Scroll**: Photos load progressively as you scroll down the page
- **Progressive Loading**: Optimized image loading with srcSet and lazy loading

## 🛠 Tech Stack

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
- **AWS SES** for handling contact form emails via a Lambda function
- **Responsive Images** with srcSet served through CloudFront
## 📁 Project Structure

```
photography-portfolio/
├── src/
│   ├── app/                   # App configuration
│   │   ├── App.tsx            # Main app component
│   │   └── Router.tsx         # Route definitions
│   │
│   ├── components/            # React components
│   │   ├── atoms/             # Basic UI components
│   │   ├── molecules/         # Composite components
│   │   ├── organisms/         # Complex components
│   │   └── templates/         # Page layouts
│   │
│   ├── pages/                 # Page components
│   │   ├── Home.tsx           # Homepage with featured photos
│   │   ├── Gallery.tsx        # Photo gallery with filtering
│   │   ├── About.tsx          # About page
│   │   └── NotFound.tsx       # 404 page
│   │
│   ├── hooks/                 # Custom React hooks
│   ├── services/              # API communication
│   ├── types/                 # TypeScript definitions
│   ├── utils/                 # Utility functions
│   └── styles/                # CSS styles
│
├── public/                    # Static assets
└── package.json               # Dependencies
```

**Tag descriptions:**
- `featured`: Show on homepage featured section
- `hero`: Use as hero/banner image
- `collectionCover`: Use as the cover photo for this collection

## 📸 Usage

### Browsing Photos

- **Home**: Featured photos with progressive loading
- **Gallery**: View all photos with filtering options
- **Collections**: Browse photos organized by location (Idaho, Montana, Drone, etc.)
- **Categories**: Filter by photo type (landscape, portrait, street, aerial)
- **Photo Modal**: Click any photo for full-screen view with navigation

### Navigation

- **Home** → Featured photos and hero carousel
- **Gallery** → All photos with collection and category filters
- **About** → Photographer information and contact

### Code Quality

The project includes:
- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for git hooks
- **Commitlint** for conventional commits


## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.