# Image API - .NET Backend with S3 Integration

A minimal .NET 8 Web API for handling image uploads and retrieval from AWS S3.

## Running the API

From the project root, navigate to the API folder and run:

```bash
cd src/api/ImageApi
dotnet restore
dotnet run
```

Or from the solution level:
```bash
cd src/api
dotnet run --project ImageApi
```

The API will be available at `https://localhost:7000` (or the port shown in console).

## Development Workflow

1. **Start the backend**:
   ```bash
   cd src/api/ImageApi
   dotnet run
   ```

2. **Start your React frontend** (in another terminal):
   ```bash
   npm run dev
   ```

Both will run simultaneously - your React app on port 5173 and the .NET API on its assigned port.

## Configuration

Update `src/api/ImageApi/appsettings.json` with your S3 bucket name:
```json
{
  "AWS": {
    "Region": "us-east-1",
    "BucketName": "your-actual-bucket-name"
  }
}
```

## API Endpoints

- `POST /api/images/upload` - Upload images
- `GET /api/images/{key}/url` - Get presigned URLs
- `GET /api/images/{key}` - Stream images directly
- `GET /api/images` - List all images
- `DELETE /api/images/{key}` - Delete images

The API is already configured with CORS to work with your React frontend on localhost:5173.