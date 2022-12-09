using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Domain.Exceptions;
using Domain.Photos;
using Domain.Services;
using Microsoft.Extensions.Logging;

namespace ImageServices;

public class PhotoAccessor : IPhotoAccessor
{
    const int DEFAULT_WIDTH = 500;
    private readonly Cloudinary _cloudinary;
    private readonly ILogger<PhotoAccessor> _logger;

    public PhotoAccessor(CloudinarySettings settings, ILogger<PhotoAccessor> logger)
    {
        _logger = logger;
        var account = new Account(
            cloud: settings.CloudName,
            apiKey: settings.ApiKey,
            apiSecret: settings.ApiSecret);
        _cloudinary = new Cloudinary(account);
    }

    public async Task<PhotoUploadResult> AddPhoto(Stream fileStream, string fileName)
    {
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(fileName, fileStream),
            Transformation = new Transformation()
                .Height(DEFAULT_WIDTH).Width(DEFAULT_WIDTH)
                .Crop("fill")
        };
        var uploadResult = await _cloudinary.UploadAsync(uploadParams);

        if (uploadResult.Error != null)
            throw new FrameworkException(ErrorCode.IMGO0001, uploadResult.Error.Message);

        return new PhotoUploadResult
        {
            PublicId = uploadResult.PublicId,
            Url = uploadResult.SecureUrl.ToString()
        };
    }

    public async Task<string> DeletePhoto(string publicId)
    {
        var deleteParams = new DeletionParams(publicId);
        var deleteResult = await _cloudinary.DestroyAsync(deleteParams);

        if (deleteResult.Error != null)
        {
            _logger.LogWarning("Error happened when try to delete image {@ImageId}, Error: {@Error}", publicId, deleteResult.Error.Message);
            throw new FrameworkException(ErrorCode.IMGO0002, "Problem deleting photo from Cloudinary");
        }

        return deleteResult.Result;
    }
}