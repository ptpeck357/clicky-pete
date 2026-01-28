# Photography Portfolio

A modern photography portfolio application built with React, TypeScript, and CloudFront CDN. Features a clean, professional interface for showcasing photography work with dynamic filtering and responsive design.

## 🚀 Features

- **Photo Gallery**: View and organize photos with dynamic categories
- **Dynamic Filtering**: Filter photos by category, location, and collection
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile
- **CloudFront CDN**: Fast global content delivery with multiple image sizes
- **Modern UI**: Clean, professional interface with Tailwind CSS and animations
- **Photo Modal**: Full-screen photo viewing with navigation
- **Collection Browsing**: Explore photos organized by location and theme
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
- **CloudFront CDN** for global content delivery
- **Responsive Images** with srcSet (400px, 800px, 2000px)
- **WebP Format** for optimal performance
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
│   ├── data/                  # Mock data
│   ├── utils/                 # Utility functions
│   └── styles/                # CSS styles
│
├── public/                    # Static assets
└── package.json              # Dependencies
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **.NET 8 SDK**
- **AWS Account** with S3 access
- **AWS CLI** configured (optional)

### 1. Clone and Install

```bash
git clone <repository-url>
cd photography-portfolio
npm install
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
VITE_CLOUDFRONT_URL=https://your-cloudfront-domain.cloudfront.net
```

### 3. Prepare Your Photos

Upload your photos to your CloudFront distribution with the following structure:
- **Photos JSON**: `/data/photos.json` - Contains photo metadata
- **Images**: `/photos/400/filename.webp`, `/photos/800/filename.webp`, `/photos/2000/filename.webp`

Your `photos.json` should follow this format:
```json
[
  {
    "id": "img-8553",
    "file": "IMG_8553.webp",
    "tags": {
      "category": "landscape",
      "location": "Yosemite National Park",
      "collection": "California",
      "featured": true,
      "hero": false,
      "aspectRatio": "3:2"
    }
  }
]
```

### 4. Run the Application
**Start the application:**
```bash
npm run dev
```

Visit: **http://localhost:5173**

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

### API Endpoints

- `GET /api/images` - List all photos
- `GET /api/images/by-tag/{tagKey}` - Filter by tag
- `GET /api/images/categories` - Get all categories
- `GET /api/images/{key}/url` - Get presigned URLs

## 🏗 Development

### Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run format:check # Check Prettier formatting
```

### Code Quality

The project includes:
- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for git hooks
- **Commitlint** for conventional commits

## 🔧 Configuration

### CloudFront Setup

1. Create an S3 bucket in AWS Console
2. Configure bucket permissions for your AWS credentials
3. Required permissions:
   - `s3:GetObject`
   - `s3:ListBucket`
   - `s3:GetObjectTagging`

### Environment Variables

**Frontend (.env):**
```bash
VITE_CLOUDFRONT_URL=https://your-cloudfront-domain.cloudfront.net
```

## 🚀 Deployment

```bash
npm run build
# Deploy the 'dist' folder to your hosting provider (Vercel, Netlify, etc.)
```

Popular deployment options:
- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop the `dist` folder
- **AWS S3 + CloudFront**: Upload to S3 bucket with static website hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by photography portfolio best practices
- Uses CloudFront CDN for fast global delivery