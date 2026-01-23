using Amazon.S3;
using Amazon.S3.Model;

namespace ImageApi.Services;

public class S3ImageService : IS3ImageService
{
    private readonly IAmazonS3 _s3Client;
    private readonly IConfiguration _configuration;
    private readonly string _bucketName;
    private readonly ILogger<S3ImageService> _logger;

    public S3ImageService(IAmazonS3 s3Client, IConfiguration configuration, ILogger<S3ImageService> logger)
    {
        _s3Client = s3Client;
        _configuration = configuration;
        _bucketName = _configuration["AWS:BucketName"] ?? throw new InvalidOperationException("AWS:BucketName not configured");
        _logger = logger;
    }

    public async Task<string> UploadImageAsync(IFormFile file, Dictionary<string, string>? tags = null, string? customKey = null)
    {
        if (file == null || file.Length == 0)
            throw new ArgumentException("File is empty or null");

        // Validate image file
        var allowedTypes = new[] { "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp" };
        if (!allowedTypes.Contains(file.ContentType.ToLower()))
            throw new ArgumentException("Invalid file type. Only images are allowed.");

        // Generate unique key
        var key = customKey ?? $"images/{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";

        try
        {
            using var stream = file.OpenReadStream();

            var request = new PutObjectRequest
            {
                BucketName = _bucketName,
                Key = key,
                InputStream = stream,
                ContentType = file.ContentType,
                ServerSideEncryptionMethod = ServerSideEncryptionMethod.AES256
            };

            // Add tags if provided
            if (tags != null && tags.Any())
            {
                request.TagSet = tags.Select(t => new Tag { Key = t.Key, Value = t.Value }).ToList();
            }

            var response = await _s3Client.PutObjectAsync(request);
            _logger.LogInformation("Successfully uploaded image with key: {Key} and tags: {@Tags}", key, tags);

            return key;
        }
        catch (AmazonS3Exception ex)
        {
            _logger.LogError(ex, "Failed to upload image to S3");
            throw new InvalidOperationException("Failed to upload image", ex);
        }
    }

    public async Task<Stream> GetImageAsync(string key)
    {
        try
        {
            var request = new GetObjectRequest
            {
                BucketName = _bucketName,
                Key = key
            };

            var response = await _s3Client.GetObjectAsync(request);
            return response.ResponseStream;
        }
        catch (AmazonS3Exception ex) when (ex.ErrorCode == "NoSuchKey")
        {
            throw new FileNotFoundException($"Image with key '{key}' not found");
        }
        catch (AmazonS3Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve image from S3");
            throw new InvalidOperationException("Failed to retrieve image", ex);
        }
    }

    public async Task<string> GetImageUrlAsync(string key, TimeSpan? expiration = null)
    {
        try
        {
            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = key,
                Verb = HttpVerb.GET,
                Expires = DateTime.UtcNow.Add(expiration ?? TimeSpan.FromHours(1))
            };

            return await _s3Client.GetPreSignedURLAsync(request);
        }
        catch (AmazonS3Exception ex)
        {
            _logger.LogError(ex, "Failed to generate presigned URL");
            throw new InvalidOperationException("Failed to generate image URL", ex);
        }
    }

    public async Task<bool> DeleteImageAsync(string key)
    {
        try
        {
            var request = new DeleteObjectRequest
            {
                BucketName = _bucketName,
                Key = key
            };

            await _s3Client.DeleteObjectAsync(request);
            _logger.LogInformation("Successfully deleted image with key: {Key}", key);
            return true;
        }
        catch (AmazonS3Exception ex)
        {
            _logger.LogError(ex, "Failed to delete image from S3");
            return false;
        }
    }

    public async Task<List<ImageInfo>> ListImagesAsync(string? prefix = null)
    {
        try
        {
            var request = new ListObjectsV2Request
            {
                BucketName = _bucketName,
                Prefix = prefix ?? "images/",
                MaxKeys = 100
            };

            var response = await _s3Client.ListObjectsV2Async(request);
            var imageInfos = new List<ImageInfo>();

            foreach (var obj in response.S3Objects)
            {
                var tags = await GetImageTagsAsync(obj.Key);
                var preSignedUrl = await GetImageUrlAsync(obj.Key);

                imageInfos.Add(new ImageInfo
                {
                    Key = obj.Key,
                    LastModified = obj.LastModified,
                    Size = obj.Size,
                    Tags = tags,
                    PreSignedUrl = preSignedUrl
                });
            }

            return imageInfos;
        }
        catch (AmazonS3Exception ex)
        {
            _logger.LogError(ex, "Failed to list images from S3");
            throw new InvalidOperationException("Failed to list images", ex);
        }
    }

    public async Task<List<ImageInfo>> GetImagesByTagAsync(string tagKey, string? tagValue = null)
    {
        try
        {
            // First get all images
            var allImages = await ListImagesAsync();

            // Filter by tag
            var filteredImages = allImages.Where(img =>
            {
                if (!img.Tags.ContainsKey(tagKey))
                    return false;

                if (tagValue == null)
                    return true; // Just check if tag key exists

                return img.Tags[tagKey].Equals(tagValue, StringComparison.OrdinalIgnoreCase);
            }).ToList();

            _logger.LogInformation("Found {Count} images with tag {TagKey}={TagValue}",
                filteredImages.Count, tagKey, tagValue ?? "any");

            return filteredImages;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get images by tag");
            throw new InvalidOperationException("Failed to get images by tag", ex);
        }
    }

    public async Task<Dictionary<string, string>> GetImageTagsAsync(string key)
    {
        try
        {
            var request = new GetObjectTaggingRequest
            {
                BucketName = _bucketName,
                Key = key
            };

            var response = await _s3Client.GetObjectTaggingAsync(request);
            return response.Tagging.ToDictionary(tag => tag.Key, tag => tag.Value);
        }
        catch (AmazonS3Exception ex) when (ex.ErrorCode == "NoSuchKey")
        {
            return new Dictionary<string, string>();
        }
        catch (AmazonS3Exception ex)
        {
            _logger.LogError(ex, "Failed to get tags for image {Key}", key);
            return new Dictionary<string, string>();
        }
    }

    public async Task<bool> UpdateImageTagsAsync(string key, Dictionary<string, string> tags)
    {
        try
        {
            var request = new PutObjectTaggingRequest
            {
                BucketName = _bucketName,
                Key = key,
                Tagging = new Tagging
                {
                    TagSet = tags.Select(t => new Tag { Key = t.Key, Value = t.Value }).ToList()
                }
            };

            await _s3Client.PutObjectTaggingAsync(request);
            _logger.LogInformation("Successfully updated tags for image {Key}", key);
            return true;
        }
        catch (AmazonS3Exception ex)
        {
            _logger.LogError(ex, "Failed to update tags for image {Key}", key);
            return false;
        }
    }
}