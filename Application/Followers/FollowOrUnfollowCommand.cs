using Application.Followers.Dtos;
using Domain.Exceptions;
using Domain.Repositories;
using Domain.Services;
using MediatR;

namespace Application.Followers;

public class FollowOrUnfollowCommand : IRequest<FollowOrUnfollowResultDto>
{
    public string TargetUserName { get; set; }
    public bool IsFollow { get; set; }
}

public class FollowOrUnfollowCommandHandler : IRequestHandler<FollowOrUnfollowCommand, FollowOrUnfollowResultDto>
{
    private readonly IProfileRepository _profileRepository;
    private readonly ICurrentUserContext _currentUserContext;

    public FollowOrUnfollowCommandHandler(
        IProfileRepository profileRepository,
        ICurrentUserContext currentUserContext)
    {
        _profileRepository = profileRepository;
        _currentUserContext = currentUserContext;
    }

    public async Task<FollowOrUnfollowResultDto> Handle(FollowOrUnfollowCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserContext.GetCurrentUserId();

        var targetUser = await _profileRepository.GetUserProfileByUserName(request.TargetUserName);
        if (targetUser == null)
            throw new FrameworkException(ErrorCode.APP0023, "User does not exist.");

        var hasFollowed = await _profileRepository.HasFollowed(userId, targetUser.Id);
        if (request.IsFollow)
        {
            if (hasFollowed)
                throw new FrameworkException(ErrorCode.APP0024, "You have already followed this account.");
            await _profileRepository.FollowUser(
                userId, targetUser.Id, _currentUserContext.GetClientNow());
        }
        else
        {
            if (!hasFollowed)
                throw new FrameworkException(ErrorCode.APP0025, "You haven't followed this account.");
            await _profileRepository.UnfollowUser(userId, targetUser.Id);
        }

        var result = new FollowOrUnfollowResultDto
        {
            Observer = await _profileRepository.GetUserFollowerInfo(userId),
            Target = await _profileRepository.GetUserFollowerInfo(targetUser.Id),
        };
        return result;
    }
}