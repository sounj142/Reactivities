using Application.Profiles.Dtos;
using Domain.Repositories;
using Domain.Services;
using MediatR;

namespace Application.Activities;

public class UpdateUserAboutCommand : IRequest
{
    public UserAboutDto About { get; set; }
}

public class UpdateUserAboutCommandHandler : IRequestHandler<UpdateUserAboutCommand>
{
    private readonly IProfileRepository _profileRepository;
    private readonly ICurrentUserContext _currentUserContext;

    public UpdateUserAboutCommandHandler(
        IProfileRepository profileRepository,
        ICurrentUserContext currentUserContext)
    {
        _profileRepository = profileRepository;
        _currentUserContext = currentUserContext;
    }

    public async Task<Unit> Handle(UpdateUserAboutCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserContext.GetCurrentUserId();
        await _profileRepository.UpdateUserAboutInfo(userId,
            request.About.DisplayName, request.About.Bio);
        return Unit.Value;
    }
}