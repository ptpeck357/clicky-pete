# Photography Portfolio

A modern, full-stack photography portfolio application built with React, TypeScript, .NET 8, and AWS S3. Features a clean, professional interface for showcasing photography work with tag-based filtering and responsive design.

## 🚀 Features

- **Photo Gallery**: View and organize photos with tags
- **Tag-Based Filtering**: Filter photos by category, location, equipment, and style
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile
- **AWS S3 Integration**: Secure cloud storage with presigned URLs
- **Modern UI**: Clean, professional interface with Tailwind CSS
- **Photo Modal**: Full-screen photo viewing with navigation
- **Collection Browsing**: Explore photos organized by location and theme

## 🛠 Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and building
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Custom hooks** for state management

### Backend
- **.NET 8** Web API
- **AWS S3 SDK** for cloud storage
- **Swagger** for API documentation
- **Dependency Injection** for clean architecture

### Infrastructure
- **AWS S3** for photo storage
- **Object tagging** for organization
- **Presigned URLs** for secure access

## 📁 Project Structure

```
photography-portfolio/
├── src/
│   ├── api/                    # .NET Backend
│   │   └── ImageApi/
│   │       ├── Controllers/    # API endpoints
│   │       ├── Services/       # Business logic
│   │       └── Program.cs      # API startup
│   │
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
VITE_API_URL=https://localhost:7000/api
VITE_USE_MOCK_DATA=true
```

### 3. Configure AWS S3

Update `src/api/ImageApi/appsettings.json`:

```json
{
  "AWS": {
    "Region": "us-east-1",
    "BucketName": "your-actual-bucket-name"
  }
}
```

Set up AWS credentials using one of these methods:
- **AWS CLI**: `aws configure`
- **Environment variables**: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
- **IAM roles** (if running on EC2)

### 4. Run the Application

**Start the backend (.NET API):**
```bash
cd src/api/ImageApi
dotnet restore
dotnet run
```

**Start the frontend (React app):**
```bash
# In a new terminal
npm run dev
```

Visit:
- **Frontend**: http://localhost:5173
- **API Documentation**: https://localhost:7000/swagger

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

### Frontend Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run format:check # Check Prettier formatting
```

### Backend Development

```bash
cd src/api/ImageApi
dotnet run           # Start API server
dotnet build         # Build project
dotnet test          # Run tests (if any)
```

### Code Quality

The project includes:
- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for git hooks
- **Commitlint** for conventional commits

## 🔧 Configuration

### AWS S3 Bucket Setup

1. Create an S3 bucket in AWS Console
2. Configure bucket permissions for your AWS credentials
3. Required permissions:
   - `s3:GetObject`
   - `s3:ListBucket`
   - `s3:GetObjectTagging`

### Environment Variables

**Frontend (.env):**
```bash
VITE_API_URL=https://localhost:7000/api
VITE_USE_MOCK_DATA=true
```

**Backend (appsettings.json):**
```json
{
  "AWS": {
    "Region": "us-east-1",
    "BucketName": "your-bucket-name"
  }
}
```

## 🚀 Deployment

### Frontend Deployment

```bash
npm run build
# Deploy the 'dist' folder to your hosting provider
```

### Backend Deployment

```bash
cd src/api/ImageApi
dotnet publish -c Release
# Deploy to your hosting provider (Azure, AWS, etc.)
```

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
- Uses AWS S3 for reliable cloud storage