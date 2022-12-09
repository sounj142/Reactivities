using Domain.Exceptions;
using Domain.Photos;
using Domain.Repositories;
using Domain.Services;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Activities;

public class UploadPhotoCommand : IRequest<Photo>
{
    public Stream FileStream { get; set; }
    public string FileName { get; set; }
    public long FileLength { get; set; }
}

public class UploadPhotoCommandHandler : IRequestHandler<UploadPhotoCommand, Photo>
{
    private readonly ILogger<UploadPhotoCommandHandler> _logger;
    private readonly IProfileRepository _profileRepository;
    private readonly IPhotoAccessor _photoAccessor;
    private readonly ICurrentUserContext _currentUserContext;

    public UploadPhotoCommandHandler(
        ILogger<UploadPhotoCommandHandler> logger,
        IProfileRepository profileRepository,
        IPhotoAccessor photoAccessor,
        ICurrentUserContext currentUserContext)
    {
        _logger = logger;
        _profileRepository = profileRepository;
        _photoAccessor = photoAccessor;
        _currentUserContext = currentUserContext;
    }

    public async Task<Photo> Handle(UploadPhotoCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserContext.GetCurrentUserId();
        var user = await _profileRepository.GetUserProfile(userId);
        if (user == null)
            throw new NotFoundException(ErrorCode.APP0012, "User not found, please logout your account.");

        _logger.LogInformation("User '{@UserId}', uploading photo '{@FileName}', length '{@FileLength}'", userId, request.FileName, request.FileLength);

        var uploadResult = await _photoAccessor.AddPhoto(request.FileStream, request.FileName);

        bool isMain = !user.Photos.Any(x => x.IsMain);
        var photo = await _profileRepository.CreatePhoto(uploadResult.PublicId,
            uploadResult.Url, userId, isMain);

        return photo;
    }
}