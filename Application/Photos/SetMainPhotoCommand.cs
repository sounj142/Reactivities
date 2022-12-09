using Domain.Exceptions;
using Domain.Repositories;
using Domain.Services;
using MediatR;

namespace Application.Photos;

public class SetMainPhotoCommand : IRequest
{
    public string Id { get; set; }
}

public class SetMainPhotoCommandHandler : IRequestHandler<SetMainPhotoCommand>
{
    private readonly IProfileRepository _profileRepository;
    private readonly ICurrentUserContext _currentUserContext;

    public SetMainPhotoCommandHandler(
        IProfileRepository profileRepository,
        ICurrentUserContext currentUserContext)
    {
        _profileRepository = profileRepository;
        _currentUserContext = currentUserContext;
    }

    public async Task<Unit> Handle(SetMainPhotoCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserContext.GetCurrentUserId();
        var user = await _profileRepository.GetUserProfile(userId);
        if (user == null)
            throw new NotFoundException(ErrorCode.APP0019, "User not found, please logout your account.");

        var photo = user.Photos.FirstOrDefault(x => x.Id == request.Id);
        if (photo == null)
            throw new NotFoundException(ErrorCode.APP0020, "Image not found.");
        if (photo.IsMain)
            throw new FrameworkException(ErrorCode.APP0021, "This image has already been your main photo.");

        await _profileRepository.SetMainPhoto(request.Id, userId);
        return Unit.Value;
    }
}