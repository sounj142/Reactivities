using Domain.Exceptions;
using Domain.Repositories;
using Domain.Services;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Photos;

public class DeletePhotoCommand : IRequest
{
    public string Id { get; set; }
}

public class DeletePhotoCommandHandler : IRequestHandler<DeletePhotoCommand>
{
    private readonly ILogger<DeletePhotoCommandHandler> _logger;
    private readonly IProfileRepository _profileRepository;
    private readonly IPhotoAccessor _photoAccessor;
    private readonly ICurrentUserContext _currentUserContext;

    public DeletePhotoCommandHandler(
        ILogger<DeletePhotoCommandHandler> logger,
        IProfileRepository profileRepository,
        IPhotoAccessor photoAccessor,
        ICurrentUserContext currentUserContext)
    {
        _logger = logger;
        _profileRepository = profileRepository;
        _photoAccessor = photoAccessor;
        _currentUserContext = currentUserContext;
    }

    public async Task<Unit> Handle(DeletePhotoCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserContext.GetCurrentUserId();
        var user = await _profileRepository.GetUserProfile(userId);
        if (user == null)
            throw new NotFoundException(ErrorCode.APP0016, "User not found, please logout your account.");

        var photo = user.Photos.FirstOrDefault(x => x.Id == request.Id);
        if (photo == null)
            throw new NotFoundException(ErrorCode.APP0017, "Image not found.");
        if (photo.IsMain)
            throw new FrameworkException(ErrorCode.APP0018, "You cannot delete your main photo.");

        _logger.LogInformation("User '{@UserId}', deleting photo '{@Id}'", userId, request.Id);

        await _profileRepository.DeletePhoto(request.Id);

        await _photoAccessor.DeletePhoto(request.Id);

        return Unit.Value;
    }
}