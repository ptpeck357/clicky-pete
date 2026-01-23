namespace ImageApi.Services;

public interface IS3ImageService
{
    Task<string> UploadImageAsync(IFormFile file, Dictionary<string, string>? tags = null, string? customKey = null);
    Task<Stream> GetImageAsync(string key);
    Task<string> GetImageUrlAsync(string key, TimeSpan? expiration = null);
    Task<bool> DeleteImageAsync(string key);
    Task<List<ImageInfo>> ListImagesAsync(string? prefix = null);
    Task<List<ImageInfo>> GetImagesByTagAsync(string tagKey, string? tagValue = null);
    Task<Dictionary<string, string>> GetImageTagsAsync(string key);
    Task<bool> UpdateImageTagsAsync(string key, Dictionary<string, string> tags);
}

public class ImageInfo
{
    public string Key { get; set; } = string.Empty;
    public DateTime LastModified { get; set; }
    public long Size { get; set; }
    public Dictionary<string, string> Tags { get; set; } = new();
    public string? PreSignedUrl { get; set; }
}