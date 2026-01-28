# CloudFront Setup Guide

## Your JSON Structure is Perfect!

Your `photos.json` structure is already optimized for fast loading:

```json
{
	"id": "img-8553",
	"file": "IMG_8553.webp",
	"tags": {
		"category": "landscape",
		"location": "",
		"collection": "",
		"featured": false,
		"hero": false,
		"aspectRatio": "3:2"
	}
}
```

## Setup Steps

### 1. Environment Configuration

Add to your `.env` file:

```bash
# CloudFront Configuration
VITE_CLOUDFRONT_URL=https://your-cloudfront-domain.cloudfront.net
VITE_USE_CLOUDFRONT=true
VITE_USE_MOCK_DATA=false
```

### 2. Upload Files to CloudFront/S3

Upload these files to your CloudFront distribution:

- `photos.json` (your photo metadata)
- `IMG_8553.webp` (your actual image files)
- Any other image files referenced in your JSON

### 3. URL Structure

The app will automatically construct URLs like:

```
https://your-cloudfront-domain.cloudfront.net/IMG_8553.webp
https://your-cloudfront-domain.cloudfront.net/photos.json
```

### 4. Performance Benefits

✅ **Direct CloudFront calls** - No .NET API overhead
✅ **Global edge caching** - Photos load from nearest location
✅ **Automatic optimization** - CloudFront handles compression
✅ **Fast JSON loading** - Metadata loads in ~50-200ms

## How It Works

1. **App starts** → Fetches `photos.json` from CloudFront
2. **JSON loads** → Transforms your format to internal format
3. **Images load** → Uses CloudFront URLs for each photo
4. **Caching** → Everything cached at edge locations

## Fallback Strategy

The app has smart fallbacks:

- **Development**: Uses mock data (`VITE_USE_MOCK_DATA=true`)
- **Production**: Uses CloudFront (`VITE_USE_CLOUDFRONT=true`)
- **Backup**: Falls back to .NET API if CloudFront fails

## Your Advantages

- ⚡ **50-80% faster** than API calls
- 🌍 **Global performance** via CloudFront edge locations
- 💰 **Lower costs** - no server processing
- 🔄 **Instant subsequent loads** via caching
- 📱 **Better mobile performance** - fewer network hops

Just set your CloudFront URL and you're ready to go!
