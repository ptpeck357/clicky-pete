using Microsoft.AspNetCore.Mvc;
using ImageApi.Services;

namespace ImageApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ImagesController : ControllerBase
{
    private readonly IS3ImageService _imageService;
    private readonly ILogger<ImagesController> _logger;

    public ImagesController(IS3ImageService imageService, ILogger<ImagesController> logger)
    {
        _imageService = imageService;
        _logger = logger;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadImage(
        IFormFile file,
        [FromQuery] string? customKey = null,
        [FromQuery] string? category = null,
        [FromQuery] string? location = null,
        [FromQuery] string? equipment = null,
        [FromQuery] string? style = null)
    {
        try
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file provided");

            // Build tags from query parameters
            var tags = new Dictionary<string, string>();
            if (!string.IsNullOrEmpty(category)) tags["category"] = category;
            if (!string.IsNullOrEmpty(location)) tags["location"] = location;
            if (!string.IsNullOrEmpty(equipment)) tags["equipment"] = equipment;
            if (!string.IsNullOrEmpty(style)) tags["style"] = style;

            // Add upload date
            tags["uploaded"] = DateTime.UtcNow.ToString("yyyy-MM-dd");

            var key = await _imageService.UploadImageAsync(file, tags, customKey);
            var url = await _imageService.GetImageUrlAsync(key);

            return Ok(new { key, url, tags, message = "Image uploaded successfully" });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading image");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("{key}")]
    public async Task<IActionResult> GetImage(string key)
    {
        try
        {
            var imageStream = await _imageService.GetImageAsync(key);
            return File(imageStream, "application/octet-stream");
        }
        catch (FileNotFoundException)
        {
            return NotFound("Image not found");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving image");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("{key}/url")]
    public async Task<IActionResult> GetImageUrl(string key, [FromQuery] int? expirationHours = 1)
    {
        try
        {
            var expiration = TimeSpan.FromHours(expirationHours ?? 1);
            var url = await _imageService.GetImageUrlAsync(key, expiration);
            return Ok(new { url, expiresIn = expiration.TotalHours });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating image URL");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("{key}/tags")]
    public async Task<IActionResult> GetImageTags(string key)
    {
        try
        {
            var tags = await _imageService.GetImageTagsAsync(key);
            return Ok(new { key, tags });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting image tags");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPut("{key}/tags")]
    public async Task<IActionResult> UpdateImageTags(string key, [FromBody] Dictionary<string, string> tags)
    {
        try
        {
            var success = await _imageService.UpdateImageTagsAsync(key, tags);
            if (success)
                return Ok(new { message = "Tags updated successfully", tags });
            else
                return StatusCode(500, "Failed to update tags");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating image tags");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpDelete("{key}")]
    public async Task<IActionResult> DeleteImage(string key)
    {
        try
        {
            var success = await _imageService.DeleteImageAsync(key);
            if (success)
                return Ok(new { message = "Image deleted successfully" });
            else
                return StatusCode(500, "Failed to delete image");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting image");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet]
    public async Task<IActionResult> ListImages([FromQuery] string? prefix = null)
    {
        try
        {
            var images = await _imageService.ListImagesAsync(prefix);
            return Ok(new { images, count = images.Count });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error listing images");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("by-tag/{tagKey}")]
    public async Task<IActionResult> GetImagesByTag(string tagKey, [FromQuery] string? tagValue = null)
    {
        try
        {
            var images = await _imageService.GetImagesByTagAsync(tagKey, tagValue);
            return Ok(new {
                tagKey,
                tagValue,
                images,
                count = images.Count,
                message = $"Found {images.Count} images with tag '{tagKey}'" + (tagValue != null ? $" = '{tagValue}'" : "")
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting images by tag");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
    {
        try
        {
            var allImages = await _imageService.ListImagesAsync();
            var categories = allImages
                .Where(img => img.Tags.ContainsKey("category"))
                .Select(img => img.Tags["category"])
                .Distinct()
                .OrderBy(c => c)
                .ToList();

            return Ok(new { categories, count = categories.Count });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting categories");
            return StatusCode(500, "Internal server error");
        }
    }
}