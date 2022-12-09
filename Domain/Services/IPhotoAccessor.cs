using Domain.Photos;

namespace Domain.Services;

public interface IPhotoAccessor
{
    Task<PhotoUploadResult> AddPhoto(Stream fileStream, string fileName);
    Task<string> DeletePhoto(string publicId);
}